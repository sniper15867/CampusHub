import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useChat } from '@/hooks/useChat';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';
import { Send, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

interface ChatDialogProps {
  threadId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChatDialog = ({ threadId, open, onOpenChange }: ChatDialogProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [message, setMessage] = useState('');
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    participants,
    loading,
    typing,
    sendMessage,
    setUserTyping,
  } = useChat(threadId);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!message.trim()) return;
    await sendMessage(message);
    setMessage('');
  };

  const handleTyping = () => {
    setUserTyping(true);
    
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    const timeout = setTimeout(() => {
      setUserTyping(false);
    }, 2000);
    
    setTypingTimeout(timeout);
  };

  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  if (!user || !profile) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col h-[80vh] max-h-[600px]">
          <ScrollArea className="flex-1 p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => {
                  const isSender = msg.sender_id === user.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          isSender
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <div className="flex items-center justify-end mt-1 space-x-1">
                          <span className="text-xs opacity-70">
                            {formatTime(msg.created_at)}
                          </span>
                          {isSender && msg.is_seen && (
                            <span className="text-xs">✓✓</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {Object.entries(typing).map(([userId, isTyping]) => {
                  if (userId !== user.id && isTyping) {
                    return (
                      <div key={userId} className="flex items-center space-x-2 text-sm text-gray-500">
                        <div className="animate-pulse">...</div>
                        <span>typing</span>
                      </div>
                    );
                  }
                  return null;
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center space-x-2"
            >
              <Input
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                  handleTyping();
                }}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!message.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatDialog;