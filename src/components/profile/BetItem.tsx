
import React from 'react';
import { cn } from '@/lib/utils';
import UserAvatar from './UserAvatar';

interface BetItemProps {
  title: string;
  type: string;
  expiresIn: string;
  options: string[];
  creator: string;
  value: string;
  gradient: "orange" | "blue" | "green" | "purple";
  onClick?: () => void;
}

const BetItem = ({ 
  title, 
  type, 
  expiresIn, 
  options, 
  creator,
  value,
  gradient,
  onClick
}: BetItemProps) => {
  const gradientClasses = {
    orange: "bg-gradient-to-r from-orange-500 to-amber-500",
    blue: "bg-gradient-to-r from-blue-500 to-indigo-500",
    green: "bg-gradient-to-r from-green-500 to-emerald-500",
    purple: "bg-gradient-to-r from-purple-500 to-pink-500",
  };
  
  return (
    <div 
      className={cn(
        "rounded-xl p-5 text-white overflow-hidden relative transition-transform duration-200 hover:scale-[1.02]",
        gradientClasses[gradient],
        onClick ? "cursor-pointer" : ""
      )}
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 px-3 py-1.5 text-xs font-medium bg-white/20 backdrop-blur-sm rounded-bl-xl">
        {type} • in {expiresIn}
      </div>
      
      <h3 className="text-xl font-bold mb-4 mt-6">{title}</h3>
      
      <div className={cn(
        "grid gap-2 mb-4",
        options.length <= 2 ? "grid-cols-2" : options.length <= 4 ? "grid-cols-2" : "grid-cols-3"
      )}>
        {options.map((option, index) => (
          <button
            key={index}
            className="py-2 px-3 rounded-lg text-left transition-all duration-200 bg-white/10 hover:bg-white/20 text-white font-medium truncate"
            onClick={(e) => e.stopPropagation()}
          >
            {option}
          </button>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <UserAvatar size="sm" initials={creator.charAt(0)} />
          <span className="text-sm">by {creator}</span>
        </div>
        
        <div className="text-sm font-medium">
          {value}
        </div>
      </div>
    </div>
  );
};

export default BetItem;
