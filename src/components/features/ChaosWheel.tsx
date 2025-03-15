
import React, { useState } from 'react';
import Button from '../shared/Button';
import { Zap } from 'lucide-react';
import ChaosWheelModal from './ChaosWheelModal';

const ChaosWheel = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleSpin = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      setIsModalOpen(true);
    }, 1500);
  };
  
  return (
    <>
      <div className="rounded-xl bg-black p-6 text-center space-y-4">
        <h2 className="text-xl font-bold">Spin the Chaos Wheel</h2>
        <p className="text-sm text-muted-foreground">
          Not sure what to bet on? Let the wheel decide your fate!
        </p>
        
        <div className="relative w-48 h-48 mx-auto my-6">
          <div className={`absolute inset-0 rounded-full bg-black border-4 border-transparent ${isSpinning ? 'animate-spin' : ''}`}
            style={{ 
              borderImage: 'linear-gradient(to right, #9333ea, #3b82f6) 1',
              boxShadow: '0 0 20px rgba(147, 51, 234, 0.5)'
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse">
              CHAOS
            </div>
          </div>
        </div>
        
        <Button 
          onClick={handleSpin}
          leadingIcon={<Zap className="h-4 w-4" />}
          variant="premium"
          fullWidth
          className="mt-4"
        >
          Generate Random Bet
        </Button>
      </div>
      
      <ChaosWheelModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default ChaosWheel;
