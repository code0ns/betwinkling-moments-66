
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Zap, X, ShieldCheck, Dice5, Users, Trophy, Check } from 'lucide-react';
import Button from '../shared/Button';
import { cn } from '@/lib/utils';

interface ChaosWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const BET_TYPES = [
  { label: 'Yes/No', value: 'yesno', icon: <Check className="h-4 w-4" /> },
  { label: 'Multiple Choice', value: 'multiplechoice', icon: <Dice5 className="h-4 w-4" /> },
  { label: 'Time-based', value: 'timebased', icon: <Users className="h-4 w-4" /> },
];

const STAKE_TYPES = [
  { label: 'Money', value: 'money', icon: <Trophy className="h-4 w-4 text-yellow-500" /> },
  { label: 'Points', value: 'points', icon: <ShieldCheck className="h-4 w-4 text-blue-500" /> },
  { label: 'Dare', value: 'dare', icon: <Zap className="h-4 w-4 text-purple-500" /> },
];

const RANDOM_TOPICS = [
  "Will it rain tomorrow?",
  "Who's paying for lunch?",
  "How long will the meeting last?",
  "First person to leave the party?",
  "Will the project launch on time?",
  "Who's getting the next promotion?",
  "Last one to arrive at the event?",
  "Next person to get a date?",
];

const ChaosWheelModal = ({ isOpen, onClose }: ChaosWheelModalProps) => {
  const [betTitle, setBetTitle] = useState('');
  const [betType, setBetType] = useState('yesno');
  const [stakeType, setStakeType] = useState('points');
  const [stakeValue, setStakeValue] = useState('100');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const generateRandomBet = () => {
    setIsGenerating(true);
    
    // Simulate a short delay for the generating animation
    setTimeout(() => {
      setBetTitle(RANDOM_TOPICS[Math.floor(Math.random() * RANDOM_TOPICS.length)]);
      setBetType(BET_TYPES[Math.floor(Math.random() * BET_TYPES.length)].value);
      setStakeType(STAKE_TYPES[Math.floor(Math.random() * STAKE_TYPES.length)].value);
      setStakeValue(Math.floor(Math.random() * 20 + 5) * 10 + '');
      setIsGenerating(false);
    }, 1000);
  };
  
  const handleCreateBet = () => {
    // In a real app, this would create the bet
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md border-none bg-black p-6 rounded-xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-500" />
              Chaos Wheel Random Bet
            </DialogTitle>
            <button 
              onClick={onClose} 
              className="rounded-full p-1 hover:bg-muted/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Bet Topic</label>
            <input 
              type="text" 
              className="w-full bg-muted/20 border border-border rounded-lg px-3 py-2"
              placeholder="What are we betting on?"
              value={betTitle}
              onChange={(e) => setBetTitle(e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Bet Type</label>
              <div className="space-y-1">
                {BET_TYPES.map((type) => (
                  <button
                    key={type.value}
                    className={cn(
                      "w-full text-left flex items-center gap-2 py-1.5 px-3 rounded-md text-sm transition-colors",
                      betType === type.value 
                        ? "bg-primary/20 text-primary" 
                        : "hover:bg-muted/20"
                    )}
                    onClick={() => setBetType(type.value)}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Stake Type</label>
              <div className="space-y-1">
                {STAKE_TYPES.map((type) => (
                  <button
                    key={type.value}
                    className={cn(
                      "w-full text-left flex items-center gap-2 py-1.5 px-3 rounded-md text-sm transition-colors",
                      stakeType === type.value 
                        ? "bg-primary/20 text-primary" 
                        : "hover:bg-muted/20"
                    )}
                    onClick={() => setStakeType(type.value)}
                  >
                    {type.icon}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">
              {stakeType === 'money' ? 'Amount ($)' : stakeType === 'points' ? 'Points' : 'Dare Intensity (1-10)'}
            </label>
            <input 
              type="text" 
              className="w-full bg-muted/20 border border-border rounded-lg px-3 py-2"
              value={stakeValue}
              onChange={(e) => setStakeValue(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 pt-2">
            <Button 
              variant="outline" 
              fullWidth
              onClick={generateRandomBet}
              isLoading={isGenerating}
              leadingIcon={<Zap className="h-4 w-4" />}
            >
              {isGenerating ? 'Generating...' : 'Randomize'}
            </Button>
            
            <Button 
              variant="premium" 
              fullWidth
              onClick={handleCreateBet}
              disabled={!betTitle.trim()}
            >
              Create Bet
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChaosWheelModal;
