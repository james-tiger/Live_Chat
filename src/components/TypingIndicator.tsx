import React from 'react';
import { TypingIndicator as TypingData } from '@/hooks/useRealTimeChat';

interface TypingIndicatorProps {
  typingUsers: TypingData[];
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ typingUsers }) => {
  if (!typingUsers.length) return null;

  const typingNames = typingUsers
    .map(user => user.profiles?.display_name || 'Someone')
    .slice(0, 2); // Show max 2 names

  let displayText;
  if (typingNames.length === 1) {
    displayText = <><span className="font-medium">{typingNames[0]}</span> is typing...</>;
  } else if (typingNames.length === 2) {
    displayText = <><span className="font-medium">{typingNames[0]}</span> and <span className="font-medium">{typingNames[1]}</span> are typing...</>;
  } else {
    displayText = <><span className="font-medium">{typingNames.slice(0, -1).join(', ')}</span>, and <span className="font-medium">{typingUsers.length - 2} others</span> are typing...</>;
  }

  return (
    <div className="h-6 px-6 flex items-center text-xs text-muted-foreground transition-all duration-300">
      <div className="flex items-center space-x-1.5 animate-fade-in">
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></div>
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <span className="ml-1">{displayText}</span>
      </div>
    </div>
  );
};