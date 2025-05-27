
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type CommunityPost = Database['public']['Tables']['community_posts']['Row'];
type CommunityPostInsert = Database['public']['Tables']['community_posts']['Insert'];

export const useCommunity = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching community posts:', error);
      toast({
        title: "Error",
        description: "Failed to load community posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: Omit<CommunityPostInsert, 'user_id'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create posts",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          ...postData,
          user_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully",
      });

      await fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { error } = await supabase
        .from('community_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post deleted successfully",
      });

      await fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: "Error",
        description: "Failed to delete post",
        variant: "destructive",
      });
    }
  };

  return {
    posts,
    loading,
    createPost,
    deletePost,
    refetch: fetchPosts,
  };
};
