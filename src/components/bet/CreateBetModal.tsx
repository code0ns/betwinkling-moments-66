import React, { useState } from 'react';
import { X, Plus, Clock, DollarSign, Award, Flame, Share2 } from 'lucide-react';
import Button from '../shared/Button';
import QRCode from '../shared/QRCode';
import { cn } from '@/lib/utils';
import betService from '@/services/betService';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface CreateBetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateBetModal = ({ isOpen, onClose }: CreateBetModalProps) => {
  const [step, setStep] = useState<'type' | 'details' | 'stakes' | 'share'>('type');
  const [selectedType, setSelectedType] = useState<'yesno' | 'multiple' | 'time' | null>(null);
  const [betDetails, setBetDetails] = useState({
    title: '',
    description: '',
    options: ['Yes', 'No'],
    stakeType: 'points' as 'points' | 'money' | 'dare',
    stakeValue: 100,
    stakeText: '',
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const [createdBetId, setCreatedBetId] = useState<string | null>(null);
  
  if (!isOpen) return null;
  
  const handleNextStep = () => {
    switch (step) {
      case 'type':
        setStep('details');
        break;
      case 'details':
        setStep('stakes');
        break;
      case 'stakes':
        const formattedOptions = selectedType === 'multiple' 
          ? betDetails.options.map((label, index) => ({ id: `new-${index}`, label }))
          : [{ id: 'yes', label: 'Yes' }, { id: 'no', label: 'No' }];
          
        const newBet = betService.createBet({
          title: betDetails.title,
          description: betDetails.description || undefined,
          stake: {
            type: betDetails.stakeType,
            value: betDetails.stakeType === 'dare' ? betDetails.stakeText : betDetails.stakeValue,
          },
          options: formattedOptions,
        });
        
        setCreatedBetId(newBet.id);
        toast({
          description: "Bet created successfully!",
          variant: "default",
        });
        
        setStep('share');
        break;
      default:
        navigate('/profile');
        onClose();
    }
  };
  
  const handlePrevStep = () => {
    switch (step) {
      case 'details':
        setStep('type');
        break;
      case 'stakes':
        setStep('details');
        break;
      case 'share':
        setStep('stakes');
        break;
      default:
        onClose();
    }
  };
  
  const inviteUrl = createdBetId ? betService.generateInviteCode(createdBetId) : '';
  
  const handleCopyLink = async () => {
    if (!inviteUrl) return;
    
    try {
      await navigator.clipboard.writeText(inviteUrl);
      toast({
        description: "Link copied to clipboard!",
        variant: "default",
      });
    } catch (error) {
      toast({
        description: "Failed to copy link",
        variant: "destructive",
      });
    }
  };
  
  const handleShare = async () => {
    if (!inviteUrl) return;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: betDetails.title,
          text: `Join my bet: ${betDetails.title}`,
          url: inviteUrl,
        });
        toast({
          description: "Shared successfully!",
          variant: "default",
        });
      } catch (error) {
        console.error("Error sharing:", error);
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 'type':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold mb-6">What type of bet do you want to create?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                className={cn(
                  "flex flex-col items-center p-6 rounded-xl border transition-all duration-200 text-left",
                  selectedType === 'yesno' 
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                    : "border-border hover:border-primary/20 hover:bg-secondary/30"
                )}
                onClick={() => setSelectedType('yesno')}
              >
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <span className="text-blue-500 text-xl font-bold">Y/N</span>
                </div>
                <h3 className="font-medium text-lg mb-1">Yes/No</h3>
                <p className="text-sm text-muted-foreground">
                  Simple bets with only two options
                </p>
              </button>
              
              <button 
                className={cn(
                  "flex flex-col items-center p-6 rounded-xl border transition-all duration-200 text-left",
                  selectedType === 'multiple' 
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                    : "border-border hover:border-primary/20 hover:bg-secondary/30"
                )}
                onClick={() => setSelectedType('multiple')}
              >
                <div className="h-12 w-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="font-medium text-lg mb-1">Multiple Choice</h3>
                <p className="text-sm text-muted-foreground">
                  Bets with multiple options
                </p>
              </button>
              
              <button 
                className={cn(
                  "flex flex-col items-center p-6 rounded-xl border transition-all duration-200 text-left",
                  selectedType === 'time' 
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                    : "border-border hover:border-primary/20 hover:bg-secondary/30"
                )}
                onClick={() => setSelectedType('time')}
              >
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-medium text-lg mb-1">Time-based</h3>
                <p className="text-sm text-muted-foreground">
                  Bets about when something will happen
                </p>
              </button>
            </div>
            
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">AI Suggestions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  "Who will arrive late to the meeting?",
                  "Will it rain tomorrow?",
                  "Who will win the game tonight?",
                  "How long will this project take?"
                ].map((suggestion, i) => (
                  <button 
                    key={i}
                    className="py-2 px-3 rounded-md bg-secondary/30 text-sm text-left hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground flex items-center"
                    onClick={() => {
                      setSelectedType('yesno');
                      setBetDetails({
                        ...betDetails,
                        title: suggestion
                      });
                      setStep('details');
                    }}
                  >
                    <Flame className="h-3.5 w-3.5 text-orange-400 mr-2 flex-shrink-0" />
                    <span className="truncate">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'details':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6">Define your bet</h2>
            
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                Question or title
              </label>
              <input
                id="title"
                type="text"
                className="w-full px-4 py-2.5 rounded-lg bg-secondary/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                placeholder="What are you betting on?"
                value={betDetails.title}
                onChange={(e) => setBetDetails({...betDetails, title: e.target.value})}
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Description (optional)
              </label>
              <textarea
                id="description"
                className="w-full px-4 py-2.5 rounded-lg bg-secondary/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all min-h-[100px]"
                placeholder="Add more details about the bet..."
                value={betDetails.description}
                onChange={(e) => setBetDetails({...betDetails, description: e.target.value})}
              />
            </div>
            
            {selectedType === 'multiple' && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Options
                </label>
                <div className="space-y-2">
                  {betDetails.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-4 py-2 rounded-lg bg-secondary/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...betDetails.options];
                          newOptions[index] = e.target.value;
                          setBetDetails({...betDetails, options: newOptions});
                        }}
                      />
                      {betDetails.options.length > 2 && (
                        <button 
                          className="p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          onClick={() => {
                            const newOptions = betDetails.options.filter((_, i) => i !== index);
                            setBetDetails({...betDetails, options: newOptions});
                          }}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  {betDetails.options.length < 6 && (
                    <button 
                      className="w-full px-4 py-2 rounded-lg border border-dashed border-muted-foreground/50 text-muted-foreground hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
                      onClick={() => {
                        const newOptions = [...betDetails.options, `Option ${betDetails.options.length + 1}`];
                        setBetDetails({...betDetails, options: newOptions});
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        );
        
      case 'stakes':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold mb-6">What are the stakes?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                className={cn(
                  "flex flex-col items-center p-6 rounded-xl border transition-all duration-200 text-left",
                  betDetails.stakeType === 'points' 
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                    : "border-border hover:border-primary/20 hover:bg-secondary/30"
                )}
                onClick={() => setBetDetails({...betDetails, stakeType: 'points'})}
              >
                <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <Award className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="font-medium text-lg mb-1">Points</h3>
                <p className="text-sm text-muted-foreground">
                  Bet with app points
                </p>
              </button>
              
              <button 
                className={cn(
                  "flex flex-col items-center p-6 rounded-xl border transition-all duration-200 text-left",
                  betDetails.stakeType === 'money' 
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                    : "border-border hover:border-primary/20 hover:bg-secondary/30"
                )}
                onClick={() => setBetDetails({...betDetails, stakeType: 'money'})}
              >
                <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="font-medium text-lg mb-1">Money</h3>
                <p className="text-sm text-muted-foreground">
                  Bet with real money
                </p>
              </button>
              
              <button 
                className={cn(
                  "flex flex-col items-center p-6 rounded-xl border transition-all duration-200 text-left",
                  betDetails.stakeType === 'dare' 
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                    : "border-border hover:border-primary/20 hover:bg-secondary/30"
                )}
                onClick={() => setBetDetails({...betDetails, stakeType: 'dare'})}
              >
                <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center mb-4">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <h3 className="font-medium text-lg mb-1">Dare</h3>
                <p className="text-sm text-muted-foreground">
                  Loser completes a dare
                </p>
              </button>
            </div>
            
            <div>
              <label htmlFor="stakeValue" className="block text-sm font-medium mb-1">
                {betDetails.stakeType === 'money' ? 'Amount ($)' : betDetails.stakeType === 'points' ? 'Points' : 'Describe the dare'}
              </label>
              {betDetails.stakeType === 'dare' ? (
                <textarea
                  id="stakeValue"
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all min-h-[100px]"
                  placeholder="Describe what the loser has to do..."
                  value={betDetails.stakeText}
                  onChange={(e) => setBetDetails({...betDetails, stakeText: e.target.value})}
                />
              ) : (
                <input
                  id="stakeValue"
                  type="number"
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary/30 border border-border focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
                  placeholder={betDetails.stakeType === 'money' ? "5" : "100"}
                  value={betDetails.stakeValue}
                  onChange={(e) => setBetDetails({...betDetails, stakeValue: Number(e.target.value)})}
                />
              )}
            </div>
          </div>
        );
        
      case 'share':
        return (
          <div className="space-y-6 flex flex-col items-center text-center">
            <h2 className="text-xl font-bold">Your bet is ready to share!</h2>
            <p className="text-muted-foreground mb-4">
              Share this QR code with friends to invite them to the bet
            </p>
            
            <div className="py-6">
              <QRCode 
                value={`https://betapp.com/bets/new-${Date.now()}`} 
                size={200}
              />
            </div>
            
            <div className="w-full max-w-md bg-secondary/30 rounded-lg p-4 border border-border">
              <h3 className="font-semibold text-lg mb-1">{betDetails.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {betDetails.stakeType === 'money' ? '$' : ''}{betDetails.stakeType === 'dare' ? betDetails.stakeText : betDetails.stakeValue} {betDetails.stakeType !== 'dare' ? betDetails.stakeType : ''}
              </p>
              
              <div className="flex justify-center space-x-2 mt-4">
                <Button size="sm">
                  Copy Link
                </Button>
                <Button variant="outline" size="sm" leadingIcon={<Share2 className="h-4 w-4" />}>
                  Share
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="animate-scale-in w-full max-w-2xl max-h-[90vh] bg-background rounded-xl shadow-premium border border-border overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-medium text-sm">{
                step === 'type' ? '1' : 
                step === 'details' ? '2' : 
                step === 'stakes' ? '3' : '4'
              }</span>
            </div>
            <h2 className="font-medium">
              {step === 'type' ? 'Select Bet Type' : 
               step === 'details' ? 'Bet Details' : 
               step === 'stakes' ? 'Set Stakes' : 'Share Bet'}
            </h2>
          </div>
          <button 
            className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-secondary/50 transition-colors"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {renderStepContent()}
        </div>
        
        <div className="flex justify-between items-center p-4 border-t border-border">
          <Button
            variant="ghost"
            onClick={step === 'type' ? onClose : handlePrevStep}
          >
            {step === 'type' ? 'Cancel' : 'Back'}
          </Button>
          
          <Button
            disabled={
              (step === 'type' && !selectedType) ||
              (step === 'details' && !betDetails.title) ||
              (step === 'stakes' && (
                (betDetails.stakeType === 'money' && betDetails.stakeValue <= 0) ||
                (betDetails.stakeType === 'points' && betDetails.stakeValue <= 0) ||
                (betDetails.stakeType === 'dare' && !betDetails.stakeText)
              ))
            }
            onClick={step === 'share' ? onClose : handleNextStep}
          >
            {step === 'share' ? 'Done' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateBetModal;
