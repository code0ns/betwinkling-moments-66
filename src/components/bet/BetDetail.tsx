import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { User, Clock, Award, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';
import Button from '../shared/Button';
import { useToast } from '@/hooks/use-toast';
import betService from '@/services/betService';

interface BetOption {
  id: string;
  label: string;
  percentage: number;
  votes: number;
}

interface BetDetailProps {
  id?: string;
  title: string;
  description?: string;
  participants: number;
  timeLeft: string;
  pool: string;
  options: BetOption[];
  insights?: string;
  reactions?: {
    emoji: string;
    count: number;
  }[];
  isPreview?: boolean;
}

const BetDetail = ({
  id,
  title,
  description,
  participants,
  timeLeft,
  pool,
  options: initialOptions,
  insights,
  reactions: initialReactions,
  isPreview = false
}: BetDetailProps) => {
  // State management
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [options, setOptions] = useState<BetOption[]>(initialOptions);
  const [reactions, setReactions] = useState(initialReactions || [
    { emoji: "😂", count: 5 },
    { emoji: "🔥", count: 3 },
    { emoji: "😮", count: 2 }
  ]);
  const [hasDoubledDown, setHasDoubledDown] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const { toast } = useToast();

  // Load bet data from service if we have an ID
  useEffect(() => {
    if (id && !isPreview) {
      const bet = betService.getBetById(id);
      if (bet) {
        // Update options with the latest data
        setOptions(bet.options.map(option => ({
          id: option.id,
          label: option.label,
          percentage: option.percentage || 0,
          votes: option.votes || 0
        })));
        
        // Set user's selected option if they voted
        if (bet.userVote) {
          setSelectedOption(bet.userVote);
        }
        
        // Set reactions
        if (bet.reactions) {
          setReactions(bet.reactions);
        }
        
        // Set doubled down status
        setHasDoubledDown(bet.userDoubledDown || false);
        
        // Set liked status
        setHasLiked(bet.userLiked || false);
      }
    }
  }, [id, isPreview]);

  // Handle betting on an option
  const handleBet = (optionId: string) => {
    if (isPreview) {
      toast({
        title: "This is just a preview",
        description: "In a real bet, your vote would be recorded",
        variant: "default",
      });
      return;
    }
    
    if (!id) {
      toast({
        title: "Error",
        description: "Could not identify this bet",
        variant: "destructive",
      });
      return;
    }

    if (selectedOption === optionId) {
      toast({
        title: "Already selected",
        description: `You've already bet on this option`,
        variant: "default",
      });
      return;
    }

    // Use betService to update the bet
    const updatedBet = betService.placeBet(id, optionId);
    
    if (updatedBet) {
      // Update local state
      setOptions(updatedBet.options.map(option => ({
        id: option.id,
        label: option.label,
        percentage: option.percentage || 0,
        votes: option.votes || 0
      })));
      
      setSelectedOption(optionId);
      
      toast({
        title: "Bet placed!",
        description: `You bet on ${updatedBet.options.find(o => o.id === optionId)?.label}. Good luck!`,
        variant: "default",
      });
    }
  };

  // Handle double down
  const handleDoubleDown = () => {
    if (isPreview) {
      toast({
        title: "This is just a preview",
        description: "In a real bet, you would double down on your selection",
        variant: "default",
      });
      return;
    }
    
    if (!id) {
      toast({
        title: "Error",
        description: "Could not identify this bet",
        variant: "destructive",
      });
      return;
    }

    if (!selectedOption) {
      toast({
        title: "Can't double down",
        description: "You need to place a bet first!",
        variant: "destructive",
      });
      return;
    }

    if (hasDoubledDown) {
      toast({
        title: "Already doubled down",
        description: "You can only double down once per bet",
        variant: "default",
      });
      return;
    }

    // Use betService to double down
    const updatedBet = betService.doubleDown(id);
    
    if (updatedBet) {
      // Update local state
      setOptions(updatedBet.options.map(option => ({
        id: option.id,
        label: option.label,
        percentage: option.percentage || 0,
        votes: option.votes || 0
      })));
      
      setHasDoubledDown(true);
      
      toast({
        title: "Doubled down!",
        description: `You've increased your bet on ${updatedBet.options.find(o => o.id === selectedOption)?.label}`,
        variant: "default",
      });
    }
  };

  // Handle reactions
  const handleReaction = (emoji: string) => {
    if (isPreview) {
      toast({
        description: `You reacted with ${emoji} (preview only)`,
        variant: "default",
      });
      return;
    }
    
    if (!id) {
      toast({
        title: "Error",
        description: "Could not identify this bet",
        variant: "destructive",
      });
      return;
    }
    
    // Use betService to add reaction
    const updatedBet = betService.addReaction(id, emoji);
    
    if (updatedBet && updatedBet.reactions) {
      // Update local state
      setReactions(updatedBet.reactions);
      
      toast({
        description: `You reacted with ${emoji}`,
        variant: "default",
      });
    }
  };

  // Handle like
  const handleLike = () => {
    if (isPreview) {
      toast({
        description: hasLiked ? "You unliked this bet (preview only)" : "You liked this bet (preview only)",
        variant: "default",
      });
      setHasLiked(!hasLiked);
      return;
    }
    
    if (!id) {
      toast({
        title: "Error",
        description: "Could not identify this bet",
        variant: "destructive",
      });
      return;
    }
    
    // Use betService to toggle like
    const updatedBet = betService.toggleLike(id);
    
    if (updatedBet) {
      // Update local state
      setHasLiked(updatedBet.userLiked || false);
      
      toast({
        description: updatedBet.userLiked ? "You liked this bet" : "You unliked this bet",
        variant: "default",
      });
    }
  };

  // Handle share
  const handleShare = async () => {
    if (!id) {
      toast({
        title: "Error",
        description: "Could not identify this bet",
        variant: "destructive",
      });
      return;
    }

    const shareUrl = betService.generateInviteCode(id);
    
    // Try to use the Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this bet: ${title}`,
          url: shareUrl,
        });
        toast({
          description: "Shared successfully!",
          variant: "default",
        });
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback to clipboard copy
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast({
            description: "Link copied to clipboard!",
            variant: "default",
          });
        } catch (clipboardError) {
          console.error("Error copying:", clipboardError);
          toast({
            description: "Could not copy link",
            variant: "destructive",
          });
        }
      }
    } else {
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          description: "Link copied to clipboard!",
          variant: "default",
        });
      } catch (error) {
        console.error("Error copying:", error);
        toast({
          description: "Could not copy link",
          variant: "destructive",
        });
      }
    }
  };

  // Sort reactions by count (descending)
  const sortedReactions = [...reactions].sort((a, b) => b.count - a.count);
  
  // Use different wrapper based on isPreview
  const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
    if (isPreview) {
      return <div className="cursor-pointer">{children}</div>;
    }
    return <>{children}</>;
  };
  
  return (
    <ContentWrapper>
      <div className="rounded-xl bg-secondary/30 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <div className="inline-block px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-500 text-xs font-medium mb-2">
            Featured Bet
          </div>
          
          <h2 className="text-xl font-bold mb-1">{title}</h2>
          {description && (
            <p className="text-sm text-muted-foreground mb-2">{description}</p>
          )}
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{participants} participants</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{timeLeft}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              <Award className="h-4 w-4 text-purple-400" />
              <span>Pool: {pool}</span>
            </div>
          </div>
        </div>
        
        {insights && (
          <div className="p-4 bg-primary/5 border-b border-white/10">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12.5V6.5C21 5.4 20.1 4.5 19 4.5H5C3.9 4.5 3 5.4 3 6.5V18.5C3 19.6 3.9 20.5 5 20.5H19C20.1 20.5 21 19.6 21 18.5V16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2.5V6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 2.5V6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 10.5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium">AI Insights</h4>
                <p className="text-xs text-muted-foreground">{insights}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="p-4 space-y-3">
          {options.map((option) => (
            <div key={option.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{option.label}</span>
                <span className="font-medium">{option.percentage}%</span>
              </div>
              <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
                <div 
                  className={cn(
                    "h-full", 
                    selectedOption === option.id ? "bg-purple-500" : "bg-primary",
                    { "transition-all duration-500": true }
                  )}
                  style={{ width: `${option.percentage}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{option.votes} votes</span>
                <span>{option.percentage}% odds</span>
              </div>
            </div>
          ))}
          
          <div className="grid grid-cols-2 gap-3 mt-6">
            {options.slice(0, 2).map((option) => (
              <Button 
                key={option.id}
                variant={option.id === options[0].id ? "default" : "outline"}
                onClick={() => handleBet(option.id)}
                disabled={selectedOption === option.id}
                className={selectedOption === option.id ? "bg-purple-500 hover:bg-purple-500/90" : ""}
              >
                {selectedOption === option.id ? "Bet Placed!" : `Bet on ${option.label}`}
              </Button>
            ))}
          </div>
          
          {options.length > 2 && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {options.slice(2, 4).map((option) => (
                <Button 
                  key={option.id}
                  variant="outline"
                  onClick={() => handleBet(option.id)}
                  disabled={selectedOption === option.id}
                  className={selectedOption === option.id ? "bg-purple-500 hover:bg-purple-500/90 text-white" : ""}
                >
                  {selectedOption === option.id ? "Bet Placed!" : `Bet on ${option.label}`}
                </Button>
              ))}
            </div>
          )}
          
          <Button 
            variant={hasDoubledDown ? "premium" : "ghost"} 
            fullWidth 
            className={cn("border border-white/10 mt-4", hasDoubledDown ? "" : "")}
            onClick={handleDoubleDown}
            disabled={!selectedOption || hasDoubledDown}
          >
            {hasDoubledDown ? "Doubled Down! 🔥" : "Double Down"}
          </Button>
        </div>
        
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            {sortedReactions.map((reaction, index) => (
              <div key={index} className="px-2 py-1 rounded-full bg-secondary/50 text-sm flex items-center gap-1">
                <span>{reaction.emoji}</span>
                <span className="text-xs">{reaction.count}</span>
              </div>
            ))}
            <button 
              className="px-2 py-1 rounded-full bg-secondary/50 text-sm hover:bg-secondary/80 transition-colors"
              onClick={() => handleReaction("😂")}
            >
              + Add Reaction
            </button>
          </div>
          
          <h4 className="text-sm font-medium mb-2">Quick Reactions</h4>
          <div className="flex flex-wrap gap-2 mb-4">
            {["😂", "🔥", "😮", "🎯", "😊", "🤔", "😍", "😎", "🙏", "💰", "👍", "👎"].map((emoji, index) => (
              <button 
                key={index} 
                className="p-1.5 bg-secondary/50 rounded-md hover:bg-secondary/80 transition-colors"
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <Button 
              variant={hasLiked ? "premium" : "ghost"} 
              size="sm" 
              leadingIcon={<ThumbsUp className={cn("h-4 w-4", hasLiked ? "fill-current" : "")} />}
              onClick={handleLike}
            >
              {hasLiked ? "Liked" : "Like"}
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              leadingIcon={<MessageSquare className="h-4 w-4" />}
            >
              Comment
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              leadingIcon={<Share2 className="h-4 w-4" />}
              onClick={handleShare}
            >
              Share
            </Button>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
};

export default BetDetail;
