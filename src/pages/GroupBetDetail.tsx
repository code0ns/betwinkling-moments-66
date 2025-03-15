
import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { 
  MessageSquare, 
  Send, 
  Share2, 
  Copy, 
  Edit2, 
  Check, 
  Users, 
  Clock, 
  Award, 
  X,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';
import groupBetService from '@/services/groupBetService';
import QRCode from '@/components/shared/QRCode';

const GroupBetDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [bet, setBet] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [copied, setCopied] = useState(false);
  const { toast: toastNotification } = useToast();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Edit mode states
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const betData = groupBetService.getGroupBetById(id);
      if (betData) {
        setBet(betData);
        setComments(betData.comments || []);
        setEditTitle(betData.title);
        setEditDescription(betData.description);
      }
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    // Scroll to bottom of messages
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSendComment = () => {
    if (!id) return;
    
    if (!newComment.trim()) {
      toastNotification({
        title: "Empty comment",
        description: "Please enter a comment first",
        variant: "destructive",
      });
      return;
    }

    const updatedBet = groupBetService.addCommentToGroupBet(id, newComment);
    if (updatedBet) {
      setComments(updatedBet.comments || []);
      setNewComment('');
      
      toastNotification({
        description: "Comment added successfully!",
        variant: "default",
      });
    }
  };

  const handleVote = (optionId: string) => {
    if (!id) return;
    
    const updatedBet = groupBetService.voteOnGroupBet(id, optionId);
    if (updatedBet) {
      setBet(updatedBet);
      
      toastNotification({
        description: "Vote registered!",
        variant: "default",
      });
    }
  };

  const handleSaveEdits = () => {
    if (!id) return;
    
    if (!editTitle.trim()) {
      toastNotification({
        title: "Invalid Title",
        description: "Please provide a title for the bet",
        variant: "destructive",
      });
      return;
    }

    const updatedBet = groupBetService.updateGroupBet(id, {
      title: editTitle,
      description: editDescription
    });
    
    if (updatedBet) {
      setBet(updatedBet);
      setIsEditing(false);
      
      toastNotification({
        description: "Bet updated successfully!",
        variant: "default",
      });
    }
  };

  const handleCopyLink = () => {
    const groupLink = `https://betmoment.app/group/${id}`;
    navigator.clipboard.writeText(groupLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleShare = async () => {
    const groupLink = `https://betmoment.app/group/${id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: bet?.title || 'Join my bet!',
          text: `Join my bet: ${bet?.title}`,
          url: groupLink,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        console.error("Error sharing:", err);
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="container px-4 py-8">
          <div className="max-w-3xl mx-auto">
            <div className="animate-pulse">
              <div className="h-10 bg-secondary/30 rounded-md mb-4 w-1/3"></div>
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
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Group Bet Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The group bet you're looking for doesn't exist or has been removed.
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
  const timeLeft = getTimeLeft(new Date(bet.expiresAt));

  // Format the pool value based on stake type
  const poolValue = bet.stake.type === 'money' 
    ? `$${bet.participants * Number(bet.stake.value)}`
    : bet.stake.type === 'points'
      ? `${bet.participants * Number(bet.stake.value)} pts`
      : bet.stake.value;

  return (
    <AppLayout>
      <div className="container px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home
          </button>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Main Bet Card */}
              <Card className="p-6 bg-secondary/30 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden">
                <div className="flex justify-between items-start">
                  {!isEditing ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-500 text-xs font-medium">
                          Group Bet
                        </div>
                        <div className="px-2.5 py-0.5 rounded-full bg-secondary/50 text-xs font-medium">
                          ID: {id}
                        </div>
                      </div>
                      
                      <h1 className="text-2xl font-bold mb-2">{bet.title}</h1>
                      <p className="text-muted-foreground">{bet.description}</p>
                    </div>
                  ) : (
                    <div className="w-full">
                      <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-background rounded-md border border-border"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-3 py-2 bg-background rounded-md border border-border"
                          rows={3}
                        />
                      </div>
                    </div>
                  )}
                  
                  {!isEditing ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setIsEditing(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={handleSaveEdits}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-3 gap-2 my-6 text-sm">
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-secondary/50">
                    <Users className="h-4 w-4 mb-1 text-blue-400" />
                    <span className="font-medium">{bet.participants}</span>
                    <span className="text-xs text-muted-foreground">Participants</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-secondary/50">
                    <Clock className="h-4 w-4 mb-1 text-orange-400" />
                    <span className="font-medium">{timeLeft}</span>
                    <span className="text-xs text-muted-foreground">Remaining</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-secondary/50">
                    <Award className="h-4 w-4 mb-1 text-purple-400" />
                    <span className="font-medium">{poolValue}</span>
                    <span className="text-xs text-muted-foreground">Pool</span>
                  </div>
                </div>
                
                <div className="space-y-3 mb-4">
                  {bet.options.map((option: any) => (
                    <div key={option.id} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{option.label}</span>
                        <span className="font-medium">{option.percentage}%</span>
                      </div>
                      <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary"
                          style={{ width: `${option.percentage}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{option.votes} votes</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleVote(option.id)}
                        >
                          Vote
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex gap-2 mt-6">
                  <Button 
                    className="flex-1"
                    variant="outline" 
                    size="sm" 
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? 'Copied' : 'Copy Link'}
                  </Button>
                  <Button 
                    className="flex-1"
                    variant="default" 
                    size="sm" 
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Invite Friends
                  </Button>
                </div>
              </Card>
              
              {/* Comments */}
              <div className="space-y-3">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Group Chat
                </h2>
                
                <Card className="p-4 bg-secondary/30 border-white/10 max-h-[400px] overflow-y-auto flex flex-col">
                  <div className="flex-1 overflow-y-auto mb-3">
                    {comments.length > 0 ? (
                      <div className="space-y-4">
                        {comments.map((comment: any) => (
                          <div key={comment.id} className="border-b border-white/10 pb-3 last:border-0 last:pb-0">
                            <div className="flex justify-between">
                              <span className="font-medium">{comment.author}</span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{comment.text}</p>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">
                        No messages yet. Be the first to comment!
                      </p>
                    )}
                  </div>
                </Card>
                
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type a message..."
                    className="resize-none bg-secondary/30 border-white/10"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendComment();
                      }
                    }}
                  />
                  <Button
                    className="flex-shrink-0"
                    onClick={handleSendComment}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 bg-secondary/30 border-white/10">
                <h3 className="font-bold mb-4">Share Group Bet</h3>
                <div className="flex justify-center mb-4">
                  <QRCode value={`https://betmoment.app/group/${id}`} size={180} />
                </div>
                <p className="text-sm text-center text-muted-foreground mb-4">
                  Scan this QR code to join the bet instantly or share the link below
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCopyLink}
                >
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? 'Copied' : 'Copy Invite Link'}
                </Button>
              </Card>
              
              <Card className="p-6 bg-secondary/30 border-white/10">
                <h3 className="font-bold mb-4">Bet Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created by</span>
                    <span>{bet.creator}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created on</span>
                    <span>{new Date(bet.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Expires on</span>
                    <span>{new Date(bet.expiresAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stake</span>
                    <span>
                      {bet.stake.type === 'money' ? '$' : ''}{bet.stake.value} {bet.stake.type}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

// Helper function to calculate time left
function getTimeLeft(expiryDate: Date): string {
  const now = new Date();
  const diff = expiryDate.getTime() - now.getTime();
  
  if (diff <= 0) return "Expired";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default GroupBetDetail;
