
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Clock, Award, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';
import Button from '../shared/Button';
import { useToast } from '@/hooks/use-toast';

interface BetDetailProps {
  title: string;
  description?: string;
  participants: number;
  timeLeft: string;
  pool: string;
  options: {
    label: string;
    percentage: number;
    votes: number;
  }[];
  insights?: string;
  reactions?: {
    emoji: string;
    count: number;
  }[];
}

const BetDetail = ({
  title,
  description,
  participants,
  timeLeft,
  pool,
  options: initialOptions,
  insights,
  reactions: initialReactions = [
    { emoji: "😂", count: 5 },
    { emoji: "🔥", count: 3 },
    { emoji: "😮", count: 2 }
  ]
}: BetDetailProps) => {
  // State management
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [options, setOptions] = useState(initialOptions);
  const [reactions, setReactions] = useState(initialReactions);
  const [hasDoubledDown, setHasDoubledDown] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const { toast } = useToast();

  // Handle betting on an option
  const handleBet = (optionLabel: string) => {
    if (selectedOption === optionLabel) {
      toast({
        title: "Already selected",
        description: `You've already bet on ${optionLabel}`,
        variant: "default",
      });
      return;
    }

    // Update options with new vote
    const updatedOptions = options.map(option => {
      if (option.label === optionLabel) {
        return { ...option, votes: option.votes + 1 };
      }
      return option;
    });

    // Recalculate percentages
    const totalVotes = updatedOptions.reduce((sum, option) => sum + option.votes, 0);
    const finalOptions = updatedOptions.map(option => ({
      ...option,
      percentage: Math.round((option.votes / totalVotes) * 100)
    }));

    setOptions(finalOptions);
    setSelectedOption(optionLabel);

    toast({
      title: "Bet placed!",
      description: `You bet on ${optionLabel}. Good luck!`,
      variant: "default",
    });
  };

  // Handle double down
  const handleDoubleDown = () => {
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

    // Update options with additional vote on selected option
    const updatedOptions = options.map(option => {
      if (option.label === selectedOption) {
        return { ...option, votes: option.votes + 1 };
      }
      return option;
    });

    // Recalculate percentages
    const totalVotes = updatedOptions.reduce((sum, option) => sum + option.votes, 0);
    const finalOptions = updatedOptions.map(option => ({
      ...option,
      percentage: Math.round((option.votes / totalVotes) * 100)
    }));

    setOptions(finalOptions);
    setHasDoubledDown(true);
    
    toast({
      title: "Doubled down!",
      description: `You've increased your bet on ${selectedOption}`,
      variant: "default",
    });
  };

  // Handle reactions
  const handleReaction = (emoji: string) => {
    // Check if the emoji already exists in reactions
    const existingReactionIndex = reactions.findIndex(r => r.emoji === emoji);
    
    if (existingReactionIndex >= 0) {
      // Update existing reaction count
      const updatedReactions = [...reactions];
      updatedReactions[existingReactionIndex] = {
        ...updatedReactions[existingReactionIndex],
        count: updatedReactions[existingReactionIndex].count + 1
      };
      setReactions(updatedReactions);
    } else {
      // Add new reaction
      setReactions([...reactions, { emoji, count: 1 }]);
    }

    toast({
      description: `You reacted with ${emoji}`,
      variant: "default",
    });
  };

  // Handle like
  const handleLike = () => {
    setHasLiked(!hasLiked);
    
    toast({
      description: hasLiked ? "You unliked this bet" : "You liked this bet",
      variant: "default",
    });
  };

  // Handle comment
  const handleComment = () => {
    toast({
      title: "Comments",
      description: "Comment functionality is coming soon!",
      variant: "default",
    });
  };

  // Handle share
  const handleShare = async () => {
    // Try to use the Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this bet: ${title}`,
          url: window.location.href,
        });
        toast({
          description: "Shared successfully!",
          variant: "default",
        });
      } catch (error) {
        console.error("Error sharing:", error);
        toast({
          description: "Could not share, try copying the URL manually",
          variant: "destructive",
        });
      }
    } else {
      // Fallback to clipboard copy
      try {
        await navigator.clipboard.writeText(window.location.href);
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
  
  return (
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
              <span>{timeLeft} left</span>
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
        {options.map((option, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span>{option.label}</span>
              <span className="font-medium">{option.percentage}%</span>
            </div>
            <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full", 
                  selectedOption === option.label ? "bg-purple-500" : "bg-primary",
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
          <Button 
            onClick={() => handleBet("Yes")}
            disabled={selectedOption === "Yes"}
            className={selectedOption === "Yes" ? "bg-purple-500 hover:bg-purple-500/90" : ""}
          >
            {selectedOption === "Yes" ? "Bet Placed!" : "Bet on Yes"}
          </Button>
          <Button 
            variant="outline" 
            onClick={() => handleBet("No")}
            disabled={selectedOption === "No"}
            className={selectedOption === "No" ? "bg-purple-500 hover:bg-purple-500/90 text-white" : ""}
          >
            {selectedOption === "No" ? "Bet Placed!" : "Bet on No"}
          </Button>
        </div>
        
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
          <button className="px-2 py-1 rounded-full bg-secondary/50 text-sm hover:bg-secondary/80 transition-colors">
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
            onClick={handleComment}
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
  );
};

export default BetDetail;
