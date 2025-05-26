
import { useState } from 'react';
import { Settings, Edit, Bell, Shield, Heart, LogOut, ShieldCheck, ShieldX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CollegeVerification from './CollegeVerification';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const Profile = () => {
  const { signOut } = useAuth();
  const { profile, loading } = useProfile();
  const [showVerification, setShowVerification] = useState(false);

  const menuItems = [
    { icon: Edit, label: 'Edit Profile', color: 'text-blue-600' },
    { icon: Bell, label: 'Notifications', color: 'text-green-600' },
    { icon: Shield, label: 'Privacy & Security', color: 'text-purple-600' },
    { icon: Heart, label: 'Saved Items', color: 'text-red-600' },
    { icon: Settings, label: 'Settings', color: 'text-gray-600' },
  ];

  const handleVerificationComplete = () => {
    setShowVerification(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Unable to load profile</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar_url} alt={`${profile.first_name} ${profile.last_name}`} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {profile.first_name[0]}{profile.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile.first_name} {profile.last_name}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                {profile.academic_year && <Badge variant="outline">{profile.academic_year}</Badge>}
                {profile.major && <Badge variant="secondary">{profile.major}</Badge>}
              </div>
              {profile.college_name && (
                <p className="text-sm text-gray-500 mt-2">{profile.college_name}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {profile.is_verified ? (
                <ShieldCheck size={24} className="text-green-600" />
              ) : (
                <ShieldX size={24} className="text-orange-500" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {profile.is_verified ? 'College Verified' : 'Verify Your College'}
                </h3>
                <p className="text-sm text-gray-600">
                  {profile.is_verified 
                    ? 'Your student status has been confirmed' 
                    : 'Confirm your student status to access all features'
                  }
                </p>
              </div>
            </div>
            {!profile.is_verified && (
              <Button 
                size="sm" 
                onClick={() => setShowVerification(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Verify
              </Button>
            )}
          </div>
          {profile.is_verified && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-center">
              <p className="text-xs text-green-700">
                ✓ Full access to marketplace and community features
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interests */}
      {profile.interests && profile.interests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Menu Items */}
      <Card>
        <CardContent className="p-0">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                className="w-full flex items-center space-x-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
              >
                <Icon size={20} className={item.color} />
                <span className="font-medium text-gray-900">{item.label}</span>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Logout */}
      <Button 
        variant="outline" 
        className="w-full text-red-600 border-red-200 hover:bg-red-50"
        onClick={signOut}
      >
        <LogOut size={20} className="mr-2" />
        Sign Out
      </Button>

      {/* Verification Dialog */}
      <Dialog open={showVerification} onOpenChange={setShowVerification}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>College Verification</DialogTitle>
          </DialogHeader>
          <CollegeVerification onVerificationComplete={handleVerificationComplete} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
