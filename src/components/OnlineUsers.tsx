import React from 'react';
import { X, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Profile } from '@/hooks/useRealTimeChat';

interface OnlineUsersProps {
  users: Profile[];
  onClose: () => void;
}

export const OnlineUsers: React.FC<OnlineUsersProps> = ({ users, onClose }) => {
  return (
    <div className="w-80 bg-chat-sidebar/95 backdrop-blur-sm border-l border-border/50 shadow-xl animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Circle className="w-4 h-4 text-chat-online" />
            <h3 className="font-semibold text-foreground">Online ({users.length})</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Users List */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {users.map((user) => {
            const displayName = user.display_name || 'Unknown User';
            const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();
            
            return (
              <div
                key={user.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-chat-message-bg/50 transition-all duration-200 cursor-pointer"
              >
                <Avatar className="w-8 h-8 shadow-sm">
                  {user.avatar_url ? (
                    <AvatarImage src={user.avatar_url} alt={displayName} />
                  ) : (
                    <AvatarFallback className="bg-gradient-primary text-white text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {displayName}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-chat-online rounded-full animate-glow-pulse"></div>
                    <span className="text-xs text-chat-online font-medium">Online</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};