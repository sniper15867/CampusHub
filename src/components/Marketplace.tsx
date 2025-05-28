
import { useState } from 'react';
import { Search, Plus, CreditCard, Trash2, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMarketplace } from '@/hooks/useMarketplace';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { useMessaging } from '@/hooks/useMessaging';
import AddItemForm from './AddItemForm';
import ChatDialog from './ChatDialog';

const Marketplace = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { items, loading, createItem, deleteItem } = useMarketplace();
  const { createOrGetChat } = useMessaging();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeChat, setActiveChat] = useState<{
    chatId: string;
    title: string;
  } | null>(null);

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddItem = async (itemData: {
    title: string;
    description: string;
    price: number;
    image_urls: string[];
  }) => {
    await createItem(itemData);
    setShowAddForm(false);
  };

  const handleDeleteItem = async (itemId: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteItem(itemId);
    }
  };

  const handleStartChat = async (itemId: string, itemTitle: string, sellerId: string) => {
    if (!user || sellerId === user.id) return;
    
    const chatId = await createOrGetChat('marketplace_item', itemId, sellerId);
    if (chatId) {
      setActiveChat({
        chatId,
        title: `Chat about: ${itemTitle}`,
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getSellerName = (sellerId: string) => {
    if (sellerId === user?.id && profile) {
      return `${profile.first_name} ${profile.last_name}`;
    }
    return 'Unknown Seller';
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        <Input
          placeholder="Search marketplace..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border border-green-200">
        <div className="flex items-center space-x-3">
          <CreditCard className="text-green-600" size={24} />
          <div>
            <h3 className="font-semibold text-green-800">Secure Payments</h3>
            <p className="text-sm text-green-600">Safe transactions with built-in buyer protection</p>
          </div>
        </div>
      </div>

      {showAddForm ? (
        <AddItemForm
          onSubmit={handleAddItem}
          onCancel={() => setShowAddForm(false)}
        />
      ) : (
        <Button 
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => setShowAddForm(true)}
        >
          <Plus size={20} className="mr-2" />
          List New Item
        </Button>
      )}

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Available Items ({filteredItems.length})
        </h2>
        
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'No items match your search.' : 'No items available yet.'}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    {item.seller_id === user?.id && (
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {item.description && (
                    <p className="text-sm text-gray-600">{item.description}</p>
                  )}
                  
                  {item.image_urls && item.image_urls.length > 0 ? (
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={item.image_urls[0]}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">Image unavailable</span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400">No image</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      {formatPrice(Number(item.price))}
                    </span>
                    <span className="text-sm text-gray-600">
                      by {getSellerName(item.seller_id)}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    Listed {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </CardContent>
                <CardFooter>
                  {user && user.id !== item.seller_id ? (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => handleStartChat(item.id, item.title, item.seller_id)}
                    >
                      <MessageCircle size={16} className="mr-2" />
                      Message Seller
                    </Button>
                  ) : (
                    <div className="w-full text-center text-gray-500 text-sm">
                      Your listing
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {activeChat && (
        <ChatDialog
          chatId={activeChat.chatId}
          title={activeChat.title}
          open={!!activeChat}
          onOpenChange={(open) => !open && setActiveChat(null)}
        />
      )}
    </div>
  );
};

export default Marketplace;
