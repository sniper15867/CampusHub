
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Database } from '@/integrations/supabase/types';

type Chat = Database['public']['Tables']['chats']['Row'];
type Message = Database['public']['Tables']['messages']['Row'];
type TypingIndicator = Database['public']['Tables']['typing_indicators']['Row'];

interface UseMessagingProps {
  chatId?: string;
}

export const useMessaging = ({ chatId }: UseMessagingProps = {}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (chatId) {
      fetchMessages();
      subscribeToMessages();
      subscribeToTyping();
    }
    return () => {
      supabase.removeAllChannels();
    };
  }, [chatId]);

  const fetchMessages = async () => {
    if (!chatId) return;
    
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', chatId)
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

  const subscribeToMessages = () => {
    if (!chatId) return;

    const channel = supabase
      .channel(`messages:${chatId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
        // Auto-mark as read if it's not from current user
        if (payload.new.sender_id !== user?.id) {
          markMessageAsRead(payload.new.id);
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'messages',
        filter: `chat_id=eq.${chatId}`,
      }, (payload) => {
        setMessages(prev => prev.map(msg => 
          msg.id === payload.new.id ? payload.new as Message : msg
        ));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const subscribeToTyping = () => {
    if (!chatId) return;

    const channel = supabase
      .channel(`typing:${chatId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'typing_indicators',
        filter: `chat_id=eq.${chatId}`,
      }, (payload) => {
        console.log('Typing payload:', payload);
        
        if (payload.eventType === 'DELETE') {
          const oldRecord = payload.old as TypingIndicator;
          if (oldRecord?.user_id) {
            setTypingUsers(prev => {
              const updated = { ...prev };
              delete updated[oldRecord.user_id];
              return updated;
            });
          }
        } else if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const newRecord = payload.new as TypingIndicator;
          if (newRecord?.user_id && newRecord.user_id !== user?.id) {
            setTypingUsers(prev => ({
              ...prev,
              [newRecord.user_id]: newRecord.is_typing,
            }));
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (content: string) => {
    if (!chatId || !user || !content.trim()) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
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

  const markMessageAsRead = async (messageId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('messages')
        .update({
          is_read: true,
          read_at: new Date().toISOString(),
        })
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const setTyping = async (isTyping: boolean) => {
    if (!chatId || !user) return;

    try {
      if (isTyping) {
        const { error } = await supabase
          .from('typing_indicators')
          .upsert({
            chat_id: chatId,
            user_id: user.id,
            is_typing: true,
            updated_at: new Date().toISOString(),
          });

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('typing_indicators')
          .delete()
          .eq('chat_id', chatId)
          .eq('user_id', user.id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  const createOrGetChat = async (
    type: 'community_post' | 'marketplace_item',
    referenceId: string,
    participantId: string
  ) => {
    if (!user) return null;

    try {
      // Try to find existing chat
      const { data: existingChat, error: fetchError } = await supabase
        .from('chats')
        .select('*')
        .eq('type', type)
        .eq('reference_id', referenceId)
        .or(`and(creator_id.eq.${user.id},participant_id.eq.${participantId}),and(creator_id.eq.${participantId},participant_id.eq.${user.id})`)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

      if (existingChat) {
        return existingChat.id;
      }

      // Create new chat
      const { data: newChat, error: createError } = await supabase
        .from('chats')
        .insert({
          type,
          reference_id: referenceId,
          creator_id: user.id,
          participant_id: participantId,
        })
        .select()
        .single();

      if (createError) throw createError;

      return newChat.id;
    } catch (error) {
      console.error('Error creating/getting chat:', error);
      toast({
        title: "Error",
        description: "Failed to start chat",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    messages,
    typingUsers,
    loading,
    sendMessage,
    setTyping,
    createOrGetChat,
    markMessageAsRead,
  };
};
