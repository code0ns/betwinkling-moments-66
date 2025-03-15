
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import BetDetailComponent from '@/components/bet/BetDetail';
import { Card } from '@/components/ui/card';
import { MessageSquare, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const BetDetailPage = () => {
  const [comments, setComments] = useState<{ author: string; text: string; timestamp: Date }[]>([]);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment first",
        variant: "destructive",
      });
      return;
    }

    const comment = {
      author: "You",
      text: newComment,
      timestamp: new Date()
    };

    setComments([comment, ...comments]);
    setNewComment('');
    
    toast({
      description: "Comment added successfully!",
      variant: "default",
    });
  };

  return (
    <AppLayout>
      <div className="container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <BetDetailComponent 
            title="Will Alex actually show up to the party?"
            description="Alex always says he'll come but never shows up. Let's see if tonight is different!"
            participants={12}
            timeLeft="2h left"
            pool="$600"
            options={[
              { label: "Yes", percentage: 67, votes: 8 },
              { label: "No", percentage: 33, votes: 4 }
            ]}
            insights="Looks like everyone's confident Alex will actually show up for once!"
          />
          
          <div className="mt-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5" />
              Comments
            </h3>
            
            <div className="flex items-center gap-2 mb-4">
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-secondary/30 border-white/10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment();
                  }
                }}
              />
              <Button size="icon" onClick={handleAddComment}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            <Card className="p-4 bg-secondary/30 border-white/10">
              {comments.length > 0 ? (
                <div className="space-y-4">
                  {comments.map((comment, index) => (
                    <div key={index} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                      <div className="flex justify-between">
                        <span className="font-medium">{comment.author}</span>
                        <span className="text-xs text-muted-foreground">
                          {comment.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{comment.text}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No comments yet. Be the first to comment!
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default BetDetailPage;
