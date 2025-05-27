
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type MarketplaceItem = Database['public']['Tables']['marketplace_items']['Row'];
type MarketplaceItemInsert = Database['public']['Tables']['marketplace_items']['Insert'];

export const useMarketplace = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('marketplace_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching marketplace items:', error);
      toast({
        title: "Error",
        description: "Failed to load marketplace items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData: Omit<MarketplaceItemInsert, 'seller_id'>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create items",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('marketplace_items')
        .insert({
          ...itemData,
          seller_id: user.id,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item created successfully",
      });

      await fetchItems();
    } catch (error) {
      console.error('Error creating item:', error);
      toast({
        title: "Error",
        description: "Failed to create item",
        variant: "destructive",
      });
    }
  };

  const updateItem = async (id: string, updates: Partial<MarketplaceItemInsert>) => {
    try {
      const { error } = await supabase
        .from('marketplace_items')
        .update(updates)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item updated successfully",
      });

      await fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
      toast({
        title: "Error",
        description: "Failed to update item",
        variant: "destructive",
      });
    }
  };

  const deleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('marketplace_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Item deleted successfully",
      });

      await fetchItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: "Failed to delete item",
        variant: "destructive",
      });
    }
  };

  return {
    items,
    loading,
    createItem,
    updateItem,
    deleteItem,
    refetch: fetchItems,
  };
};
