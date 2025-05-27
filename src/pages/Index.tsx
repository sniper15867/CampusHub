
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Auth from '@/components/Auth';
import Navigation from '@/components/Navigation';
import Profile from '@/components/Profile';
import Marketplace from '@/components/Marketplace';
import Community from '@/components/Community';
import Academic from '@/components/Academic';

const Index = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('marketplace');

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

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'marketplace':
        return <Marketplace />;
      case 'community':
        return <Community />;
      case 'academic':
        return <Academic />;
      case 'profile':
        return <Profile />;
      default:
        return <Marketplace />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {renderActiveTab()}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
};

export default Index;
