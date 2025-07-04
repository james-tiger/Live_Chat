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
    <div className="flex-1 overflow-y-auto p-6 space-y-2">
      {messages.map((message, index) => {
        const isOwn = message.user_id === user?.id;
        const displayName = message.profiles?.display_name || 'Unknown User';
        const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase();
        
        const prevMessage = messages[index - 1];
        const isGrouped = prevMessage && 
          prevMessage.user_id === message.user_id &&
          new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime() < 300000; // 5 minutes
        
        return (
          <div
            key={message.id}
            className={`flex items-end space-x-3 animate-fade-in ${
              isOwn ? 'flex-row-reverse space-x-reverse' : ''
            } ${isGrouped ? 'mt-1' : 'mt-4'}`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {!isGrouped ? (
              <Avatar className="w-8 h-8 flex-shrink-0 shadow-md">
                {message.profiles?.avatar_url ? (
                  <AvatarImage src={message.profiles.avatar_url} alt={displayName} />
                ) : (
                  <AvatarFallback className={`text-xs font-semibold ${
                    isOwn ? 'bg-gradient-primary text-white' : 'bg-chat-message-bg text-foreground border border-border/20'
                  }`}>
                    {initials}
                  </AvatarFallback>
                )}
              </Avatar>
            ) : (
              <div className="w-8 flex-shrink-0" />
            )}
            
            <div className={`max-w-md lg:max-w-lg xl:max-w-xl ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
              {!isGrouped && (
                <div className={`flex items-center space-x-2 mb-1 ${isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <span className="text-xs font-semibold text-foreground">
                    {isOwn ? 'You' : displayName}
                  </span>
                  <span className="text-xs text-chat-timestamp">
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              )}
              
              <div className={`relative px-4 py-3 rounded-2xl shadow-md backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${
                isOwn
                  ? 'bg-gradient-message text-white rounded-br-lg'
                  : 'bg-chat-message-other/80 text-foreground rounded-bl-lg border border-border/20'
              }`}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};