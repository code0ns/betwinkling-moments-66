
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { User, Clock, Award, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';
import Button from '../shared/Button';

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
  options,
  insights,
  reactions = [
    { emoji: "😂", count: 5 },
    { emoji: "🔥", count: 3 },
    { emoji: "😮", count: 2 }
  ]
}: BetDetailProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
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
                className="h-full bg-primary" 
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
          <Button onClick={() => setSelectedOption("Yes")}>
            Bet on Yes
          </Button>
          <Button variant="outline" onClick={() => setSelectedOption("No")}>
            Bet on No
          </Button>
        </div>
        
        <Button variant="ghost" fullWidth className="border border-white/10 mt-4">
          Double Down
        </Button>
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2 mb-4">
          {reactions.map((reaction, index) => (
            <div key={index} className="px-2 py-1 rounded-full bg-secondary/50 text-sm flex items-center gap-1">
              <span>{reaction.emoji}</span>
              <span className="text-xs">{reaction.count}</span>
            </div>
          ))}
          <button className="px-2 py-1 rounded-full bg-secondary/50 text-sm">
            + Add Reaction
          </button>
        </div>
        
        <h4 className="text-sm font-medium mb-2">Quick Reactions</h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {["😂", "🔥", "😮", "🎯", "😊", "🤔", "😍", "😎", "🙏", "💰", "👍", "👎"].map((emoji, index) => (
            <button key={index} className="p-1.5 bg-secondary/50 rounded-md hover:bg-secondary/80 transition-colors">
              {emoji}
            </button>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" leadingIcon={<ThumbsUp className="h-4 w-4" />}>
            Like
          </Button>
          <Button variant="ghost" size="sm" leadingIcon={<MessageSquare className="h-4 w-4" />}>
            Comment
          </Button>
          <Button variant="ghost" size="sm" leadingIcon={<Share2 className="h-4 w-4" />}>
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BetDetail;
