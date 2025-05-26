
import { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Community = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('all');

  const activityTypes = [
    { id: 'all', label: 'All' },
    { id: 'study', label: 'Study' },
    { id: 'social', label: 'Social' },
    { id: 'sports', label: 'Sports' },
    { id: 'events', label: 'Events' },
  ];

  const mockActivities = [
    {
      id: 1,
      title: 'Calculus Study Group',
      type: 'study',
      creator: 'Maria S.',
      participants: 4,
      maxParticipants: 8,
      location: 'Library Room 205',
      time: 'Today 7:00 PM',
      description: 'Preparing for midterm exam, all welcome!',
      interests: ['Math', 'Study Group'],
    },
    {
      id: 2,
      title: 'Basketball Pickup Game',
      type: 'sports',
      creator: 'James R.',
      participants: 6,
      maxParticipants: 10,
      location: 'Campus Gym',
      time: 'Tomorrow 4:00 PM',
      description: 'Casual basketball game, all skill levels welcome.',
      interests: ['Basketball', 'Sports'],
    },
    {
      id: 3,
      title: 'Coffee & Code',
      type: 'social',
      creator: 'Alex P.',
      participants: 3,
      maxParticipants: 6,
      location: 'Campus Café',
      time: 'Friday 2:00 PM',
      description: 'Coding session with coffee and good vibes.',
      interests: ['Programming', 'Coffee'],
    },
    {
      id: 4,
      title: 'Music Festival Meetup',
      type: 'events',
      creator: 'Lisa M.',
      participants: 12,
      maxParticipants: 20,
      location: 'Student Center',
      time: 'Saturday 6:00 PM',
      description: 'Planning trip to upcoming music festival.',
      interests: ['Music', 'Events'],
    },
  ];

  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesActivity = selectedActivity === 'all' || activity.type === selectedActivity;
    return matchesSearch && matchesActivity;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {activityTypes.map((type) => (
            <Button
              key={type.id}
              variant={selectedActivity === type.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedActivity(type.id)}
              className="whitespace-nowrap"
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Create Activity */}
      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
        <Users size={20} className="mr-2" />
        Create New Activity
      </Button>

      {/* Activities List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Discover Activities</h2>
        <div className="space-y-4">
          {filteredActivities.map((activity) => (
            <Card key={activity.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{activity.title}</CardTitle>
                  <Badge 
                    variant={activity.type === 'study' ? 'default' : 
                            activity.type === 'sports' ? 'destructive' :
                            activity.type === 'social' ? 'secondary' : 'outline'}
                  >
                    {activity.type}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-gray-600 text-sm">{activity.description}</p>
                
                <div className="flex flex-wrap gap-1">
                  {activity.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={16} className="mr-2" />
                    {activity.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2" />
                    {activity.time}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users size={16} className="mr-2" />
                    {activity.participants}/{activity.maxParticipants} participants
                  </div>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button className="flex-1" size="sm">
                    Join Activity
                  </Button>
                  <Button variant="outline" size="sm">
                    Message Creator
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Interest Filters Placeholder */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">🎯 Smart Matching</h3>
        <p className="text-sm text-blue-700">
          Advanced interest-based filtering and recommendation system will be integrated here.
        </p>
      </div>
    </div>
  );
};

export default Community;
