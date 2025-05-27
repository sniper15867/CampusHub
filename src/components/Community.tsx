// Update the Community component to include chat functionality
import { useState } from 'react';
import { Search, MapPin, Calendar, Users, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCommunity } from '@/hooks/useCommunity';
import { useAuth } from '@/hooks/useAuth';
import { useChat } from '@/hooks/useChat';
import CreatePostForm from './CreatePostForm';
import ChatDialog from './ChatDialog';

const Community = () => {
  const { user } = useAuth();
  const { posts, loading, createPost, deletePost } = useCommunity();
  const { createThread } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);

  const activityTypes = [
    { id: 'all', label: 'All' },
    { id: 'study', label: 'Study' },
    { id: 'social', label: 'Social' },
    { id: 'sports', label: 'Sports' },
    { id: 'events', label: 'Events' },
  ];

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (post.description && post.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesActivity = selectedActivity === 'all' || post.activity_type === selectedActivity;
    return matchesSearch && matchesActivity;
  });

  const handleCreatePost = async (postData: {
    title: string;
    description: string;
    activity_type: string;
    interest_tags: string[];
  }) => {
    await createPost(postData);
    setShowCreateForm(false);
  };

  const handleStartChat = async (postId: string) => {
    const threadId = await createThread(undefined, postId);
    if (threadId) {
      setActiveChat(threadId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (showCreateForm) {
    return (
      <div className="p-6">
        <CreatePostForm
          onSubmit={handleCreatePost}
          onCancel={() => setShowCreateForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
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

      {user && (
        <Button 
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={() => setShowCreateForm(true)}
        >
          <Users size={20} className="mr-2" />
          Create New Activity
        </Button>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Discover Activities</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading activities...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No activities found. Be the first to create one!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant={post.activity_type === 'study' ? 'default' : 
                                post.activity_type === 'sports' ? 'destructive' :
                                post.activity_type === 'social' ? 'secondary' : 'outline'}
                      >
                        {post.activity_type}
                      </Badge>
                      {user && user.id === post.user_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePost(post.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {post.description && (
                    <p className="text-gray-600 text-sm">{post.description}</p>
                  )}
                  
                  {post.interest_tags && post.interest_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.interest_tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-2" />
                      Created {formatDate(post.created_at)}
                    </div>
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <Button className="flex-1" size="sm">
                      Join Activity
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleStartChat(post.id)}
                    >
                      <MessageCircle size={16} className="mr-2" />
                      Message Creator
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {activeChat && (
        <ChatDialog
          threadId={activeChat}
          open={!!activeChat}
          onOpenChange={(open) => !open && setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default Community;