import { useAuth } from '@/hooks/useAuth';
import { ChatSidebar } from './ChatSidebar';
import { MessageList } from './MessageList';
import { OnlineUsers } from './OnlineUsers';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { TypingIndicator } from './TypingIndicator';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, LogOut, User, Smile, Paperclip, MoreVertical, Menu } from 'lucide-react';

export const ChatApp = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const {
    rooms,
    selectedRoom,
    setSelectedRoom,
    messages,
    onlineUsers,
    typingUsers,
    loading,
    sendMessage,
    updateTypingIndicator,
  } = useRealTimeChat();
  
  const [message, setMessage] = useState('');
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      await sendMessage(message);
      setMessage('');
      // Stop typing indicator
      updateTypingIndicator(false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    
    // Handle typing indicator
    updateTypingIndicator(true);
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout to stop typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingIndicator(false);
    }, 2000);
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleAdminAccess = () => {
    if (user?.email === 'admin@gmail.com') {
      navigate('/admin');
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gradient-background items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-background">
      {/* Sidebar */}
      <ChatSidebar 
        rooms={rooms}
        selectedRoom={selectedRoom}
        onRoomSelect={(room) => {
          setSelectedRoom(room);
          if (window.innerWidth < 768) {
            setSidebarOpen(false);
          }
        }}
        currentUser={user}
        onSignOut={handleSignOut}
        isOpen={isSidebarOpen}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col transition-all duration-300 md:ml-0">
        {/* Modern Header */}
        <div className="h-16 bg-chat-sidebar/80 backdrop-blur-sm border-b border-border/50 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="md:hidden text-muted-foreground hover:text-foreground"
            >
              <Menu className="w-6 h-6" />
            </Button>
            <div className="w-3 h-3 bg-chat-online rounded-full animate-glow-pulse shadow-lg"></div>
            <div>
              <h2 className="font-semibold text-foreground text-lg">{selectedRoom?.name || 'General'}</h2>
              <p className="text-sm text-muted-foreground">
                Public channel • {onlineUsers.length} member{onlineUsers.length !== 1 ? 's' : ''} online
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/profile')}
              className="text-muted-foreground hover:text-foreground hover:bg-chat-message-bg/50 transition-all duration-200"
            >
              <User className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOnlineUsers(!showOnlineUsers)}
              className="text-muted-foreground hover:text-foreground hover:bg-chat-message-bg/50 transition-all duration-200"
            >
              <Users className="w-4 h-4" />
              <span className="ml-1 text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                {onlineUsers.length}
              </span>
            </Button>
            {user?.email === 'admin@gmail.com' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleAdminAccess}
                className="text-muted-foreground hover:text-foreground hover:bg-chat-message-bg/50 transition-all duration-200"
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-foreground hover:bg-chat-message-bg/50 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex">
          {/* Messages Area */}
          <div className="flex-1 flex flex-col">
            <MessageList messages={messages} messagesEndRef={messagesEndRef} />
            
            {/* Typing Indicator */}
            <TypingIndicator typingUsers={typingUsers} />

            {/* Modern Message Input */}
            <div className="p-4 bg-chat-sidebar/50 backdrop-blur-sm border-t border-border/50">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end space-x-3">
                  <div className="flex-1 relative">
                    <Input
                      value={message}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder={`Message #${selectedRoom?.name?.toLowerCase() || 'general'}...`}
                      className="bg-chat-message-bg/80 backdrop-blur-sm border-border/50 text-foreground placeholder:text-muted-foreground rounded-xl px-4 py-3 pr-12 min-h-[48px] shadow-sm focus:shadow-lg transition-all duration-200"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Smile className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-8 h-8 p-0 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Paperclip className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!message.trim()}
                    className="bg-gradient-primary hover:opacity-90 transition-all duration-300 rounded-xl px-6 py-3 min-h-[48px] shadow-lg hover:shadow-xl disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Online Users Sidebar */}
          {showOnlineUsers && (
            <OnlineUsers users={onlineUsers} onClose={() => setShowOnlineUsers(false)} />
          )}
        </div>
      </div>
    </div>
  );
};