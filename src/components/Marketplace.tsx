
import { useState } from 'react';
import { Search, Plus, Filter, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'books', label: 'Books' },
    { id: 'electronics', label: 'Electronics' },
    { id: 'clothes', label: 'Clothes' },
    { id: 'furniture', label: 'Furniture' },
  ];

  const mockItems = [
    {
      id: 1,
      title: 'Calculus Textbook',
      price: 45,
      category: 'books',
      image: '/placeholder.svg',
      seller: 'Sarah M.',
      condition: 'Good',
    },
    {
      id: 2,
      title: 'MacBook Air M1',
      price: 800,
      category: 'electronics',
      image: '/placeholder.svg',
      seller: 'Mike D.',
      condition: 'Excellent',
    },
    {
      id: 3,
      title: 'Winter Jacket',
      price: 30,
      category: 'clothes',
      image: '/placeholder.svg',
      seller: 'Emma L.',
      condition: 'Like New',
    },
    {
      id: 4,
      title: 'Desk Lamp',
      price: 15,
      category: 'furniture',
      image: '/placeholder.svg',
      seller: 'Alex K.',
      condition: 'Good',
    },
  ];

  const filteredItems = mockItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input
            placeholder="Search marketplace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="whitespace-nowrap"
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Payment Portal Banner */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg border border-green-200">
        <div className="flex items-center space-x-3">
          <CreditCard className="text-green-600" size={24} />
          <div>
            <h3 className="font-semibold text-green-800">Secure Payments</h3>
            <p className="text-sm text-green-600">Safe transactions with built-in buyer protection</p>
          </div>
        </div>
      </div>

      {/* Add Item Button */}
      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
        <Plus size={20} className="mr-2" />
        List New Item
      </Button>

      {/* Items Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Available Items</h2>
        <div className="grid gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <Badge variant="secondary">{item.condition}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">Image</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-green-600">${item.price}</span>
                  <span className="text-sm text-gray-600">by {item.seller}</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">
                  Contact Seller
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* API Integration Placeholder */}
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
        <h3 className="font-semibold text-yellow-800 mb-2">🔌 API Integration Ready</h3>
        <p className="text-sm text-yellow-700">
          Payment processing and inventory management APIs can be integrated here.
        </p>
      </div>
    </div>
  );
};

export default Marketplace;
