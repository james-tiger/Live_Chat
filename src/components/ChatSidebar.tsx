import React from 'react';
import { MessageCircle, LogOut, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Room } from '@/hooks/useRealTimeChat';
import { User } from '@supabase/supabase-js';

interface ChatSidebarProps {
  rooms: Room[];
  selectedRoom: Room | null;
  onRoomSelect: (room: Room) => void;
  currentUser: User | null;
  onSignOut: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  rooms,
  selectedRoom,
  onRoomSelect,
  currentUser,
  onSignOut,
  isOpen,
  onToggle,
}) => {
  const generalRoom = rooms.find(room => room.name === 'General') || rooms[0];
  const userInitials = currentUser?.email?.substring(0, 2).toUpperCase() || 'U';

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onToggle}
      ></div>
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-chat-sidebar border-r border-border shadow-sidebar flex flex-col z-40 transition-transform duration-300 ease-in-out md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-8 h-8 text-primary animate-glow-pulse" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PhoneLiveChat
            </h1>
            <p className="text-sm text-muted-foreground">Real-time messaging</p>
          </div>
        </div>
      </div>

      {/* General Channel */}
      <div className="p-4">
        <div className="mb-3">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Channel
          </h3>
        </div>
        {generalRoom && (
          <button
            onClick={() => onRoomSelect(generalRoom)}
            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 ${
              selectedRoom?.id === generalRoom.id
                ? 'bg-chat-message-bg text-foreground shadow-message'
                : 'text-muted-foreground hover:bg-chat-message-bg/50 hover:text-foreground'
            }`}
          >
            <Hash className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">{generalRoom.name}</span>
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="mt-auto p-4 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-primary text-white text-xs">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {currentUser?.email?.split('@')[0] || 'User'}
              </p>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-chat-online rounded-full animate-glow-pulse"></div>
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
      </div>
    </>
  );
};