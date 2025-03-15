
import React, { useState } from 'react';
import { QrCode, Copy, Check, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import QRCode from '../shared/QRCode';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { toast } from 'sonner';

interface QuickGroupBetProps {
  className?: string;
}

const QuickGroupBet = ({ className }: QuickGroupBetProps) => {
  const [qrGenerated, setQrGenerated] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const groupId = "BETXYZ123";
  const groupLink = `https://betmoment.app/join/${groupId}`;
  
  const handleGenerateQR = () => {
    setQrGenerated(true);
    toast.success("QR code generated! Share with friends to join your bet instantly");
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(groupLink);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my bet!',
          text: 'Join my bet on BetMoment!',
          url: groupLink,
        });
        toast.success("Shared successfully!");
      } catch (err) {
        toast.error("Error sharing");
      }
    } else {
      handleCopyLink();
    }
  };
  
  return (
    <div className={cn("rounded-xl bg-black p-6", className)}>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1 bg-purple-500/20 rounded">
          <QrCode className="h-5 w-5 text-purple-500" />
        </div>
        <h2 className="font-bold">Quick Group Bet</h2>
      </div>
      
      {!qrGenerated ? (
        <>
          <p className="text-sm text-muted-foreground mb-4">
            Create an instant betting group and invite friends with one tap
          </p>
          
          <button 
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-500 text-white font-medium hover:brightness-110 transition-all"
            onClick={handleGenerateQR}
          >
            Generate QR Code
          </button>
          
          <p className="text-xs text-center text-muted-foreground mt-2">
            No setup needed - just share and bet!
          </p>
        </>
      ) : (
        <div className="animate-fade-in">
          <div className="flex justify-center my-3">
            <QRCode value={groupLink} size={150} className="mx-auto" />
          </div>
          
          <div className="text-center mb-3">
            <span className="text-sm font-medium bg-muted/30 px-3 py-1 rounded-full">
              Group ID: {groupId}
            </span>
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors text-sm"
              onClick={handleCopyLink}
            >
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy Link'}
            </button>
            
            <button
              className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-500 text-white hover:brightness-110 transition-all text-sm"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Share
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuickGroupBet;
