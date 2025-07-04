import Auth from './Auth';
import { useAuth } from '@/hooks/useAuth';
import { ChatApp } from '@/components/ChatApp';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <ChatApp />;
};

export default Index;
