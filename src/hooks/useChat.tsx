import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Database } from '@/integrations/supabase/types';

type Message = Database['public']['Tables']['messages']['Row'];
type Thread = Database['public']['Tables']['chat_threads']['Row'];
type Participant = Database['public']['Tables']['chat_participants']['Row'];

export const useChat = (threadId?: string) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [typing, setTyping] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (threadId) {
      fetchMessages();
      fetchParticipants();
      subscribeToMessages();
      subscribeToTyping();
    }
    return () => {
      supabase.removeAllChannels();
    };
  }, [threadId]);

  const fetchMessages = async () => {
    if (!threadId) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = async () => {
    if (!threadId) return;

    try {
      const { data, error } = await supabase
        .from('chat_participants')
        .select('*')
        .eq('thread_id', threadId);

      if (error) throw error;
      setParticipants(data || []);
    } catch (error) {
      console.error('Error fetching participants:', error);
    }
  };

  const subscribeToMessages = () => {
    if (!threadId) return;

    const channel = supabase
      .channel(`thread:${threadId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `thread_id=eq.${threadId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
        markMessageAsSeen(payload.new.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const subscribeToTyping = () => {
    if (!threadId) return;

    const channel = supabase
      .channel(`typing:${threadId}`)
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        setTyping(prev => ({
          ...prev,
          [payload.userId]: payload.isTyping,
        }));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (content: string) => {
    if (!threadId || !user || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          thread_id: threadId,
          sender_id: user.id,
          content: content.trim(),
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const markMessageAsSeen = async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({
          is_seen: true,
          seen_at: new Date().toISOString(),
        })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as seen:', error);
    }
  };

  const createThread = async (itemId?: string, postId?: string) => {
    if (!user || (!itemId && !postId)) return null;

    try {
      // Create thread
      const { data: threadData, error: threadError } = await supabase
        .from('chat_threads')
        .insert({
          item_id: itemId,
          post_id: postId,
        })
        .select()
        .single();

      if (threadError) throw threadError;

      // Add participants
      const { error: participantError } = await supabase
        .from('chat_participants')
        .insert({
          thread_id: threadData.id,
          user_id: user.id,
        });

      if (participantError) throw participantError;

      return threadData.id;
    } catch (error) {
      console.error('Error creating chat thread:', error);
      toast({
        title: "Error",
        description: "Failed to create chat",
        variant: "destructive",
      });
      return null;
    }
  };

  const setUserTyping = async (isTyping: boolean) => {
    if (!threadId || !user) return;

    const channel = supabase.channel(`typing:${threadId}`);
    await channel.send({
      type: 'broadcast',
      event: 'typing',
      payload: {
        userId: user.id,
        isTyping,
      },
    });
  };

  return {
    messages,
    participants,
    loading,
    typing,
    sendMessage,
    createThread,
    setUserTyping,
  };
};