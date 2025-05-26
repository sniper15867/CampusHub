
import { useAuth } from '@/hooks/useAuth';
import Auth from '@/components/Auth';
import Navigation from '@/components/Navigation';

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth onAuthSuccess={() => {}} />;
  }

  return <Navigation />;
};

export default Index;
