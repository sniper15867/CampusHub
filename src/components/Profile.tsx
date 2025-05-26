
import { useState } from 'react';
import { Settings, Edit, Bell, Shield, Heart, LogOut, ShieldCheck, ShieldX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CollegeVerification from './CollegeVerification';

const Profile = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [showVerification, setShowVerification] = useState(false);

  const user = {
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    year: 'Junior',
    major: 'Computer Science',
    avatar: '/placeholder.svg',
    joinDate: 'September 2023',
    interests: ['Programming', 'Basketball', 'Music', 'Study Groups'],
    stats: {
      itemsSold: 12,
      activitiesJoined: 8,
      currentGPA: 8.67,
    },
  };

  const menuItems = [
    { icon: Edit, label: 'Edit Profile', color: 'text-blue-600' },
    { icon: Bell, label: 'Notifications', color: 'text-green-600' },
    { icon: Shield, label: 'Privacy & Security', color: 'text-purple-600' },
    { icon: Heart, label: 'Saved Items', color: 'text-red-600' },
    { icon: Settings, label: 'Settings', color: 'text-gray-600' },
  ];

  const handleVerificationComplete = () => {
    setIsVerified(true);
    setShowVerification(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <Badge variant="outline">{user.year}</Badge>
                <Badge variant="secondary">{user.major}</Badge>
              </div>
              <p className="text-sm text-gray-500 mt-2">Member since {user.joinDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Status */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isVerified ? (
                <ShieldCheck size={24} className="text-green-600" />
              ) : (
                <ShieldX size={24} className="text-orange-500" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isVerified ? 'College Verified' : 'Verify Your College'}
                </h3>
                <p className="text-sm text-gray-600">
                  {isVerified 
                    ? 'Your student status has been confirmed' 
                    : 'Confirm your student status to access all features'
                  }
                </p>
              </div>
            </div>
            {!isVerified && (
              <Button 
                size="sm" 
                onClick={() => setShowVerification(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Verify
              </Button>
            )}
          </div>
          {isVerified && (
            <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-center">
              <p className="text-xs text-green-700">
                ✓ Full access to marketplace and community features
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{user.stats.itemsSold}</div>
            <div className="text-xs text-gray-600">Items Sold</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{user.stats.activitiesJoined}</div>
            <div className="text-xs text-gray-600">Activities</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{user.stats.currentGPA}</div>
            <div className="text-xs text-gray-600">GPA</div>
          </CardContent>
        </Card>
      </div>

      {/* Interests */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest, index) => (
              <Badge key={index} variant="outline" className="px-3 py-1">
                {interest}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

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
      <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
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

      {/* Authentication Placeholder */}
      <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
        <h3 className="font-semibold text-green-800 mb-2">🔐 Authentication Ready</h3>
        <p className="text-sm text-green-700">
          User authentication and profile management systems can be integrated here.
        </p>
      </div>
    </div>
  );
};

export default Profile;
