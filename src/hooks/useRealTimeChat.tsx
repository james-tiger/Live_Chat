import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Room {
  id: string;
  name: string;
  type: 'public' | 'private';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  room_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    display_name?: string;
    avatar_url?: string;
  };
}

export interface Profile {
  id: string;
  user_id: string;
  display_name?: string;
  avatar_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface TypingIndicator {
  id: string;
  room_id: string;
  user_id: string;
  is_typing: boolean;
  updated_at: string;
  profiles?: {
    display_name?: string;
  };
}

export const useRealTimeChat = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<Profile[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching rooms:', error);
      return;
    }

    const rooms = (data || []) as Room[];
    setRooms(rooms);
    if (rooms.length > 0 && !selectedRoom) {
      setSelectedRoom(rooms[0]);
    }
  }, [user, selectedRoom]);

  // Fetch messages for selected room - fixed to work without foreign key
  const fetchMessages = useCallback(async () => {
    if (!selectedRoom || !user) return;

    const { data: messagesData, error } = await supabase
      .from('messages')
      .select('*')
      .eq('room_id', selectedRoom.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching messages:', error);
      return;
    }

    // Fetch profiles separately for each message
    const messagesWithProfiles = await Promise.all(
      (messagesData || []).map(async (message) => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name, avatar_url')
          .eq('user_id', message.user_id)
          .single();
        
        return {
          ...message,
          profiles: profile || { display_name: 'Unknown User', avatar_url: null }
        };
      })
    );

    setMessages(messagesWithProfiles);
  }, [selectedRoom, user]);

  // Fetch online users with better status handling
  const fetchOnlineUsers = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('status', 'online')
      .order('display_name', { ascending: true });

    if (error) {
      console.error('Error fetching users:', error);
      return;
    }

    setOnlineUsers(data || []);
  }, [user]);

  // Send message
  const sendMessage = useCallback(async (content: string) => {
    if (!selectedRoom || !user || !content.trim()) return;

    const { error } = await supabase
      .from('messages')
      .insert({
        room_id: selectedRoom.id,
        user_id: user.id,
        content: content.trim(),
      });

    if (error) {
      console.error('Error sending message:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to send message',
        description: error.message,
      });
    }
  }, [selectedRoom, user, toast]);

  // Update typing indicator with upsert fix
  const updateTypingIndicator = useCallback(async (isTyping: boolean) => {
    if (!selectedRoom || !user) return;

    const { error } = await supabase
      .from('typing_indicators')
      .upsert(
        {
          room_id: selectedRoom.id,
          user_id: user.id,
          is_typing: isTyping,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'room_id,user_id',
          ignoreDuplicates: false,
        }
      );

    if (error) {
      console.error('Error updating typing indicator:', error);
    }
  }, [selectedRoom, user]);

  // Update user status with better error handling
  const updateUserStatus = useCallback(async (status: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating user status:', error);
      }
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    // Subscribe to rooms changes
    const roomsChannel = supabase
      .channel('rooms-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rooms',
      }, () => {
        fetchRooms();
      })
      .subscribe();

    // Subscribe to messages changes
    const messagesChannel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
      }, () => {
        if (selectedRoom) {
          fetchMessages();
        }
      })
      .subscribe();

    // Subscribe to profiles changes
    const profilesChannel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
      }, () => {
        fetchOnlineUsers();
      })
      .subscribe();

    // Subscribe to typing indicators
    const typingChannel = supabase
      .channel('typing-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'typing_indicators',
      }, async () => {
        if (!selectedRoom) return;

        const { data } = await supabase
          .from('typing_indicators')
          .select(`
            *,
            profiles(display_name)
          `)
          .eq('room_id', selectedRoom.id)
          .eq('is_typing', true)
          .neq('user_id', user.id);

        setTypingUsers((data || []) as TypingIndicator[]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(roomsChannel);
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(typingChannel);
    };
  }, [user, selectedRoom, fetchRooms, fetchMessages, fetchOnlineUsers]);

  // Initial data loading
  useEffect(() => {
    if (!user) return;

    const loadInitialData = async () => {
      setLoading(true);
      await Promise.all([
        fetchRooms(),
        fetchOnlineUsers(),
      ]);
      setLoading(false);
    };

    loadInitialData();
    
    // Set user status to online when they join
    updateUserStatus('online');

    // Clean up on unmount - set status to offline
    return () => {
      updateUserStatus('offline');
    };
  }, [user, fetchRooms, fetchOnlineUsers, updateUserStatus]);

  // Load messages when room changes
  useEffect(() => {
    if (selectedRoom) {
      fetchMessages();
    }
  }, [selectedRoom, fetchMessages]);

  return {
    rooms,
    selectedRoom,
    setSelectedRoom,
    messages,
    onlineUsers,
    typingUsers,
    loading,
    sendMessage,
    updateTypingIndicator,
    updateUserStatus,
  };
};