import React from 'react';
import { X, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Profile } from '@/hooks/useRealTimeChat';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OnlineUsersProps {
  users: Profile[];
  onClose: () => void;
}

export const OnlineUsers: React.FC<OnlineUsersProps> = ({ users, onClose }) => {
  return (
    <div className="w-72 bg-chat-sidebar/95 backdrop-blur-sm border-l border-border/50 shadow-xl flex flex-col animate-slide-in-right">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-center justify-between h-16">
        <div className="flex items-center space-x-3">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-foreground">Online Users ({users.length})</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground hover:bg-chat-message-bg/50 w-8 h-8"
        >
          <X className="w-4 h-4" />
        </Button>
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
                className="flex items-center space-x-3 p-2.5 rounded-lg hover:bg-chat-message-bg/50 transition-colors duration-200 cursor-pointer"
              >
                <div className="relative">
                  <Avatar className="w-9 h-9 shadow-sm">
                    {user.avatar_url ? (
                      <AvatarImage src={user.avatar_url} alt={displayName} />
                    ) : (
                      <AvatarFallback className="bg-gradient-primary text-white text-xs font-semibold">
                        {initials}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-chat-online rounded-full border-2 border-chat-sidebar"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-muted-foreground">Online</p>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};