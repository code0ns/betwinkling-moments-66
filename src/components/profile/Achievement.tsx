
import React from 'react';
import { Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AchievementProps {
  title: string;
  icon: React.ReactNode;
  isUnlocked: boolean;
  iconColor?: string;
  iconTextColor?: string;
}

const Achievement = ({ 
  title, 
  icon, 
  isUnlocked, 
  iconColor = "bg-primary/20",
  iconTextColor = "text-primary"
}: AchievementProps) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-2">
        <div className={cn(
          "h-16 w-16 rounded-full flex items-center justify-center", 
          isUnlocked ? iconColor : "bg-gray-500/20"
        )}>
          <div className={cn(
            "h-6 w-6",
            isUnlocked ? iconTextColor : "text-gray-400"
          )}>
            {icon}
          </div>
        </div>
        {!isUnlocked && (
          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-background flex items-center justify-center">
            <Lock className="h-3 w-3 text-gray-400" />
          </div>
        )}
      </div>
      
      <h3 className="font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground">
        {isUnlocked ? "Unlocked" : "Locked"}
      </p>
    </div>
  );
};

export default Achievement;
