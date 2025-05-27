
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface AddItemFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    price: number;
    image_urls: string[];
  }) => void;
  onCancel: () => void;
}

const AddItemForm = ({ onSubmit, onCancel }: AddItemFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !price) {
      return;
    }

    onSubmit({
      title,
      description,
      price: parseFloat(price),
      image_urls: imageUrls,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    setImageUrls([]);
  };

  const addImageUrl = () => {
    if (imageUrl && !imageUrls.includes(imageUrl)) {
      setImageUrls([...imageUrls, imageUrl]);
      setImageUrl('');
    }
  };

  const removeImageUrl = (urlToRemove: string) => {
    setImageUrls(imageUrls.filter(url => url !== urlToRemove));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Add New Item
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X size={20} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Item title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your item"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="price">Price ($) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label htmlFor="imageUrl">Add Image URL</Label>
            <div className="flex space-x-2">
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              <Button type="button" onClick={addImageUrl} variant="outline">
                Add
              </Button>
            </div>
          </div>

          {imageUrls.length > 0 && (
            <div>
              <Label>Images ({imageUrls.length})</Label>
              <div className="space-y-2">
                {imageUrls.map((url, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                    <span className="text-sm truncate flex-1">{url}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeImageUrl(url)}
                    >
                      <X size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              Add Item
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddItemForm;
