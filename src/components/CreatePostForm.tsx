
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface CreatePostFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    activity_type: string;
    interest_tags: string[];
  }) => void;
  onCancel: () => void;
}

const CreatePostForm = ({ onSubmit, onCancel }: CreatePostFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [activityType, setActivityType] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !activityType) {
      return;
    }

    onSubmit({
      title,
      description,
      activity_type: activityType,
      interest_tags: tags,
    });

    // Reset form
    setTitle('');
    setDescription('');
    setActivityType('');
    setTagInput('');
    setTags([]);
  };

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Create New Activity
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
              placeholder="Activity title"
              required
            />
          </div>

          <div>
            <Label htmlFor="activityType">Activity Type *</Label>
            <Input
              id="activityType"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value)}
              placeholder="e.g., study, social, sports, events"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your activity"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="tagInput">Add Interest Tags</Label>
            <div className="flex space-x-2">
              <Input
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g., Math, Basketball, Programming"
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
          </div>

          {tags.length > 0 && (
            <div>
              <Label>Tags ({tags.length})</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag, index) => (
                  <div key={index} className="flex items-center bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    <span>{tag}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-1 h-4 w-4 p-0"
                      onClick={() => removeTag(tag)}
                    >
                      <X size={12} />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button type="submit" className="flex-1">
              Create Activity
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

export default CreatePostForm;
