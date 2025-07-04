import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { Message } from '@/hooks/useRealTimeChat';

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, messagesEndRef }) => {
  const { user } = useAuth();

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((message, index) => {
        const isOwn = message.user_id === user?.id;
        const displayName = message.profiles?.display_name || 'Unknown User';
        const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();
        
        // Check if this message is from the same user as the previous one
        const prevMessage = messages[index - 1];
        const isGrouped = prevMessage && 
          prevMessage.user_id === message.user_id &&
          new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() < 300000; // 5 minutes
        
        return (
          <div
            key={message.id}
            className={`flex space-x-4 animate-fade-in ${
              isOwn ? 'flex-row-reverse space-x-reverse' : ''
            } ${isGrouped ? 'mt-2' : 'mt-6'}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Avatar - only show if not grouped or is own message */}
            {!isGrouped && (
              <Avatar className="w-10 h-10 flex-shrink-0 shadow-md">
                {message.profiles?.avatar_url ? (
                  <AvatarImage src={message.profiles.avatar_url} alt={displayName} />
                ) : (
                  <AvatarFallback className={`text-sm font-semibold ${
                    isOwn ? 'bg-gradient-primary text-white' : 'bg-chat-message-bg text-foreground border border-border/20'
                  }`}>
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
            )}
            
            {/* Spacer for grouped messages */}
            {isGrouped && <div className="w-10 flex-shrink-0" />}
            
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isOwn ? 'text-right' : ''}`}>
              {/* Message header - only show if not grouped */}
              {!isGrouped && (
                <div className={`mb-2 ${isOwn ? 'text-right' : 'text-left'}`}>
                  <span className="text-sm font-semibold text-foreground">
                    {isOwn ? 'You' : displayName}
                  </span>
                  <span className="ml-2 text-xs text-chat-timestamp">
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              )}
              
              {/* Message bubble */}
              <div className={`relative p-4 rounded-2xl shadow-lg backdrop-blur-sm transition-all duration-200 hover:shadow-xl ${
                isOwn
                  ? 'bg-gradient-message text-white rounded-br-md ml-auto'
                  : 'bg-chat-message-other/80 text-foreground rounded-bl-md border border-border/20'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
                
                {/* Message timestamp for grouped messages */}
                {isGrouped && (
                  <div className={`absolute -bottom-5 text-xs text-chat-timestamp/70 ${
                    isOwn ? 'right-2' : 'left-2'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};