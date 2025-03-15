
import React from 'react';
import { Share2 } from 'lucide-react';
import UserAvatar from '../profile/UserAvatar';

const BestLoss = () => {
  return (
    <div className="rounded-xl bg-black p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-red-500 text-xs">L</span>
          </div>
          <h2 className="font-bold">Biggest L of the Day</h2>
        </div>
        
        <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-secondary/50 transition-colors">
          <Share2 className="h-4 w-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-3 mb-3">
        <UserAvatar 
          size="lg" 
          src="/lovable-uploads/f0fc05eb-f991-4caa-a7e7-da66a93ec87f.png"
        />
        <div>
          <h3 className="font-medium">DareDevilDan</h3>
          <p className="text-xs text-muted-foreground">
            Bet: Would skip finals week to attend Coachella
          </p>
        </div>
      </div>
      
      <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 mb-3">
        <p className="text-sm italic">
          "Congrats on choosing Coachella over your future! Hope those Instagram pics are worth living in your parents' basement until you're 40! 📸🏠"
        </p>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>AI-generated roast</span>
          <span>42 reactions</span>
        </div>
      </div>
      
      <div className="text-sm text-red-500 font-bold text-right">
        -$5120
      </div>
    </div>
  );
};

export default BestLoss;
