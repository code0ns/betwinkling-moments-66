
import React from 'react';
import { QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickGroupBetProps {
  className?: string;
}

const QuickGroupBet = ({ className }: QuickGroupBetProps) => {
  return (
    <div className={cn("rounded-xl bg-black p-6", className)}>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1 bg-purple-500/20 rounded">
          <QrCode className="h-5 w-5 text-purple-500" />
        </div>
        <h2 className="font-bold">Quick Group Bet</h2>
      </div>
      
      <button className="w-full py-3 mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-500 text-white font-medium hover:brightness-110 transition-all">
        Generate QR Code
      </button>
      
      <p className="text-xs text-center text-muted-foreground mt-2">
        Create an instant betting group with one tap
      </p>
    </div>
  );
};

export default QuickGroupBet;
