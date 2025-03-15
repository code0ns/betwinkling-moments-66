
import React, { useRef, useState } from 'react';
import BetCard from './BetCard';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendingBetsProps {
  bets: any[];
  className?: string;
}

const TrendingBets = ({ bets, className }: TrendingBetsProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  const checkScrollButtons = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // 10px buffer
  };
  
  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    const newPosition = direction === 'left' 
      ? scrollRef.current.scrollLeft - scrollAmount 
      : scrollRef.current.scrollLeft + scrollAmount;
      
    scrollRef.current.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
  };
  
  return (
    <div className={cn("relative", className)}>
      <div className="flex items-center mb-4">
        <div className="flex items-center space-x-2 text-foreground">
          <Flame className="h-5 w-5 text-orange-400" />
          <h2 className="text-xl font-bold">Trending Bets</h2>
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-none pb-4 -mx-4 px-4"
          onScroll={checkScrollButtons}
        >
          {bets.map((bet) => (
            <div key={bet.id} className="min-w-[300px] md:min-w-[350px] flex-shrink-0">
              <BetCard bet={bet} variant={bet.stake.type === 'money' ? 'premium' : 'default'} />
            </div>
          ))}
        </div>
        
        {/* Scroll buttons */}
        {canScrollLeft && (
          <button 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg z-10 transition-opacity"
            onClick={() => scroll('left')}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}
        
        {canScrollRight && (
          <button 
            className="absolute right-0 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg z-10 transition-opacity"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TrendingBets;
