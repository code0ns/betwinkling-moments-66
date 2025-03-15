
import React from 'react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  online?: boolean;
  initials?: string;
}

const UserAvatar = ({ 
  src, 
  alt = 'User', 
  size = 'md', 
  className, 
  online = false,
  initials,
}: UserAvatarProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-14 w-14',
  };
  
  const renderContent = () => {
    if (src) {
      return (
        <img 
          src={src} 
          alt={alt} 
          className="h-full w-full object-cover rounded-full"
        />
      );
    }
    
    if (initials) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-primary/20 font-medium text-primary-foreground">
          {initials}
        </div>
      );
    }
    
    return (
      <div className="flex h-full w-full items-center justify-center bg-primary/20 font-medium text-primary-foreground">
        <svg 
          className="h-1/2 w-1/2 text-primary-foreground/70" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
          />
        </svg>
      </div>
    );
  };
  
  return (
    <div className={cn("relative inline-block rounded-full overflow-hidden", sizeClasses[size], className)}>
      <div className="h-full w-full rounded-full overflow-hidden ring-2 ring-background">
        {renderContent()}
      </div>
      
      {online && (
        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-background" />
      )}
    </div>
  );
};

export default UserAvatar;
