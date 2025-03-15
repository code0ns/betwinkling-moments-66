
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import BetDetailComponent from '@/components/bet/BetDetail';
import { Card } from '@/components/ui/card';
import { MessageSquare, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'react-router-dom';
import betService from '@/services/betService';

const BetDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [bet, setBet] = useState<any>(null);
  const [comments, setComments] = useState<{ author: string; text: string; timestamp: Date }[]>([]);
  const [newComment, setNewComment] = useState('');
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const betData = betService.getBetById(id);
      if (betData) {
        setBet(betData);
        setComments(betData.comments || []);
      }
      setLoading(false);
    }
  }, [id]);

  const handleAddComment = () => {
    if (!id) return;
    
    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment first",
        variant: "destructive",
      });
      return;
    }

    const updatedBet = betService.addComment(id, newComment);
    if (updatedBet) {
      setComments(updatedBet.comments || []);
      setNewComment('');
      
      toast({
        description: "Comment added successfully!",
        variant: "default",
      });
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse">
              <div className="h-64 bg-secondary/30 rounded-xl mb-6"></div>
              <div className="h-12 bg-secondary/30 rounded-md mb-4"></div>
              <div className="h-32 bg-secondary/30 rounded-md"></div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!bet) {
    return (
      <AppLayout>
        <div className="container px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Bet Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The bet you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <a href="/">Go Back Home</a>
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  // Format the time left
  const timeLeft = betService.formatTimeLeft(new Date(bet.expiresAt));

  // Format the pool value based on stake type
  const poolValue = bet.stake.type === 'money' 
    ? `$${bet.participants * Number(bet.stake.value)}`
    : bet.stake.type === 'points'
      ? `${bet.participants * Number(bet.stake.value)} pts`
      : bet.stake.value;

  return (
    <AppLayout>
      <div className="container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <BetDetailComponent 
            id={id}
            title={bet.title}
            description={bet.description}
            participants={bet.participants}
            timeLeft={timeLeft}
            pool={poolValue}
            options={bet.options.map((option: any) => ({
              id: option.id,
              label: option.label,
              percentage: option.percentage || 0,
              votes: option.votes || 0
            }))}
            insights="Looks like everyone's placing their bets! Check back for updates as the deadline approaches."
            reactions={bet.reactions}
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
                          {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
