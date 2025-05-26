
import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import Navigation from '@/components/Navigation';
import Marketplace from '@/components/Marketplace';
import Community from '@/components/Community';
import Academic from '@/components/Academic';
import Profile from '@/components/Profile';

const Index = () => {
  const [activeTab, setActiveTab] = useState('marketplace');

  const renderContent = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md mx-auto bg-white shadow-xl min-h-screen relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 pb-8">
          <h1 className="text-2xl font-bold text-center">CampusHub</h1>
          <p className="text-center text-blue-100 mt-1">Your College Companion</p>
        </div>

        {/* Content */}
        <div className="pb-20 min-h-[calc(100vh-120px)]">
          {renderContent()}
        </div>

        {/* Bottom Navigation */}
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      <Toaster />
    </div>
  );
};

export default Index;
