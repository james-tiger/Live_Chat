import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, LogOut, User, Smile, Paperclip, MoreVertical, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatSidebar } from './ChatSidebar';
import { MessageList } from './MessageList';
import { TypingIndicator } from './TypingIndicator';
import { OnlineUsers } from './OnlineUsers';
import { useAuth } from '@/hooks/useAuth';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import { useIsMobile } from '@/hooks/use-mobile';

export const ChatApp = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  const [showOnlineUsers, setShowOnlineUsers] = useState(false);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    setShowSidebar(!isMobile);
  }, [isMobile]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    updateTypingIndicator(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  return (
    <div className="flex h-screen bg-gradient-background overflow-hidden">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="absolute top-4 left-4 z-50 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile ? 'absolute left-0 top-0 bottom-0 z-40' : 'relative'}
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
        transition-transform duration-300 ease-in-out
      `}>
        <ChatSidebar 
          rooms={rooms}
          selectedRoom={selectedRoom}
          onRoomSelect={(room) => {
            setSelectedRoom(room);
            if (isMobile) setShowSidebar(false);
          }}
          currentUser={user}
          onSignOut={handleSignOut}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 bg-chat-sidebar/80 backdrop-blur-sm border-b border-border/50 px-6 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-4 ml-12 md:ml-0">
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

        {/* Messages and Input Area */}
        <div className="flex-1 flex relative">
          <div className="flex-1 flex flex-col">
            <MessageList messages={messages} messagesEndRef={messagesEndRef} />
            <TypingIndicator typingUsers={typingUsers} />
            
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
            <div className={`${isMobile ? 'absolute inset-0 z-30' : 'relative'}`}>
              <OnlineUsers 
                users={onlineUsers} 
                onClose={() => setShowOnlineUsers(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
