import React from 'react';
import { TypingIndicator as TypingData } from '@/hooks/useRealTimeChat';

interface TypingIndicatorProps {
  typingUsers: TypingData[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (!typingUsers.length) return null;

  const typingNames = typingUsers
    .map(user => user.profiles?.display_name || 'Someone')
    .slice(0, 3); // Show max 3 names

  const displayText = typingNames.length === 1
    ? `${typingNames[0]} is typing...`
    : typingNames.length === 2
    ? `${typingNames[0]} and ${typingNames[1]} are typing...`
    : `${typingNames[0]}, ${typingNames[1]} and ${typingNames.length - 2} others are typing...`;

  return (
    <div className="px-4 pb-2">
      <div className="flex items-center space-x-2 text-chat-typing">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-chat-typing rounded-full animate-typing-dots"></div>
          <div className="w-2 h-2 bg-chat-typing rounded-full animate-typing-dots" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-chat-typing rounded-full animate-typing-dots" style={{ animationDelay: '0.4s' }}></div>
        </div>
        <span className="text-sm">{displayText}</span>
      </div>
    </div>
  );
};