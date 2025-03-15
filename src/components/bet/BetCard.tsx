
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Share2, MessageCircle, ArrowRight, Clock } from 'lucide-react';
import Button from '../shared/Button';
import UserAvatar from '../profile/UserAvatar';
import { cn } from '@/lib/utils';

interface BetCardProps {
  bet: {
    id: string;
    title: string;
    description?: string;
    created_by: {
      name: string;
      avatar?: string;
      initials?: string;
    };
    participants: number;
    expiresAt?: Date;
    stake: {
      type: 'money' | 'points' | 'dare';
      value: string | number;
    };
    isTrending?: boolean;
    commentCount: number;
    options?: {
      id: string;
      label: string;
      color?: string;
    }[];
  };
  className?: string;
  variant?: 'default' | 'premium';
}

const BetCard = ({ bet, className, variant = 'default' }: BetCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Calculate time remaining before bet expires
  const getTimeRemaining = () => {
    if (!bet.expiresAt) return null;
    
    const now = new Date();
    const diffMs = bet.expiresAt.getTime() - now.getTime();
    
    if (diffMs <= 0) return 'Ended';
    
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHrs > 24) {
      const days = Math.floor(diffHrs / 24);
      return `${days}d left`;
    }
    
    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m left`;
    }
    
    return `${diffMins}m left`;
  };
  
  const timeRemaining = getTimeRemaining();
  
  return (
    <Link 
      to={`/bet/${bet.id}`}
      className={cn(
        "block w-full transform transition-all duration-300 hover:-translate-y-1 focus:outline-none",
        isHovered ? "z-10" : "z-0",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={cn(
          "relative overflow-hidden rounded-xl transition-all duration-300",
          variant === 'premium' ? "premium-card" : "glass-card",
          isHovered ? "shadow-premium-hover" : ""
        )}
      >
        {bet.isTrending && (
          <div className="absolute top-3 right-3 flex items-center space-x-1 bg-background/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs text-orange-400">
            <Flame className="h-3 w-3" />
            <span>Trending</span>
          </div>
        )}
        
        <div className="p-5">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-3">
              <UserAvatar 
                src={bet.created_by.avatar}
                initials={bet.created_by.initials} 
                size="md"
              />
              <div className="text-left">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {bet.created_by.name}
                </h3>
                {timeRemaining && (
                  <div className="flex items-center text-xs text-muted-foreground/70 mt-0.5">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{timeRemaining}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="rounded-full px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary">
              {bet.stake.type === 'money' ? '$' : ''}{bet.stake.value} {bet.stake.type === 'dare' ? 'Dare' : bet.stake.type === 'points' ? 'Points' : ''}
            </div>
          </div>
          
          <div className="mb-4 text-left">
            <h2 className="text-lg font-semibold mb-1 text-foreground">{bet.title}</h2>
            {bet.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">{bet.description}</p>
            )}
          </div>
          
          {bet.options && bet.options.length > 0 && (
            <div className="mb-4 grid grid-cols-2 gap-2">
              {bet.options.slice(0, 2).map((option) => (
                <div 
                  key={option.id} 
                  className={cn(
                    "py-2 px-3 rounded-md text-sm font-medium text-left",
                    option.color ? `bg-${option.color}-500/10 text-${option.color}-500` : "bg-secondary/70 text-foreground"
                  )}
                >
                  {option.label}
                </div>
              ))}
              {bet.options.length > 2 && (
                <div className="py-2 px-3 rounded-md text-sm font-medium bg-secondary/50 text-muted-foreground text-center">
                  +{bet.options.length - 2} more
                </div>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-between text-muted-foreground">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="flex -space-x-2">
                  {/* This would show actual participants in a real app */}
                  <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-xs text-white border-2 border-background">A</div>
                  <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-xs text-white border-2 border-background">B</div>
                  {bet.participants > 2 && (
                    <div className="h-6 w-6 rounded-full bg-secondary flex items-center justify-center text-xs text-foreground border-2 border-background">+{bet.participants - 2}</div>
                  )}
                </div>
                <span className="ml-2 text-xs">
                  {bet.participants} {bet.participants === 1 ? 'player' : 'players'}
                </span>
              </div>
              
              <div className="flex items-center text-xs">
                <MessageCircle className="h-3.5 w-3.5 mr-1" />
                {bet.commentCount}
              </div>
            </div>
            
            <div className={cn("flex items-center text-sm font-medium", isHovered ? "text-primary" : "text-muted-foreground")}>
              <span className="mr-1">Join</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BetCard;
