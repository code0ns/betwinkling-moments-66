
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import TrendingBets from '@/components/bet/TrendingBets';
import BetCard from '@/components/bet/BetCard';
import Button from '@/components/shared/Button';
import CreateBetModal from '@/components/bet/CreateBetModal';
import QuickGroupBet from '@/components/features/QuickGroupBet';
import ChaosWheel from '@/components/features/ChaosWheel';
import BestLoss from '@/components/features/BestLoss';
import BetDetail from '@/components/bet/BetDetail';
import { trendingBets, recentBets } from '@/lib/data';
import { Plus, Flame, ChevronRight, Clock, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

const Index = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  return (
    <AppLayout>
      <div className="container px-4">
        {/* Hero section */}
        <section className="py-8 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left space-y-4 animate-fade-in">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
                Bet on anything, instantly
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Social betting for
                <div className="text-gradient"> everyday moments</div>
              </h1>
              <p className="text-lg text-muted-foreground">
                Create bets with friends, coworkers, or the world in seconds. No complicated setup, just pure fun.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button 
                  size="lg" 
                  variant="premium"
                  leadingIcon={<Plus className="h-5 w-5" />}
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  Create a Bet
                </Button>
                <Link to="/leaderboard">
                  <Button 
                    size="lg" 
                    variant="outline"
                    leadingIcon={<Flame className="h-5 w-5 text-orange-400" />}
                  >
                    Browse Trending
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl blur-xl opacity-20 animate-pulse"></div>
              <div className="relative overflow-hidden rounded-xl premium-card p-4">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>
                
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">B</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold">BetMoment</h3>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>Just now</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-full px-2.5 py-1 text-xs font-medium bg-primary/10 text-primary">
                    $20 Bet
                  </div>
                </div>
                
                <div className="text-left mb-4">
                  <h2 className="text-xl font-semibold mb-2">Will the project launch on time?</h2>
                  <p className="text-muted-foreground">Our team has been working hard on this for months. Will we hit the deadline?</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <button className="py-3 px-4 rounded-lg text-left transition-all duration-200 bg-green-500/10 hover:bg-green-500/20 text-green-500 font-medium">
                    Yes, we'll make it!
                  </button>
                  <button className="py-3 px-4 rounded-lg text-left transition-all duration-200 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-medium">
                    No chance
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex -space-x-2">
                    <div className="h-8 w-8 rounded-full bg-blue-500 border-2 border-background flex items-center justify-center text-white">A</div>
                    <div className="h-8 w-8 rounded-full bg-purple-500 border-2 border-background flex items-center justify-center text-white">B</div>
                    <div className="h-8 w-8 rounded-full bg-green-500 border-2 border-background flex items-center justify-center text-white">C</div>
                    <div className="h-8 w-8 rounded-full bg-secondary border-2 border-background flex items-center justify-center">+9</div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <RefreshCcw className="h-3 w-3" />
                    <span>Updates live</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured bet */}
        <section className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-6">Featured Bet</h2>
                <Link to="/bet/featured-bet-1" className="block hover:opacity-95 transition-opacity">
                  <BetDetail 
                    id="featured-bet-1"
                    title="Will Alex actually show up to the party?"
                    description="Alex always says he'll come but never shows up. Let's see if tonight is different!"
                    participants={12}
                    timeLeft="2h left"
                    pool="$600"
                    options={[
                      { id: "opt-1", label: "Yes", percentage: 67, votes: 8 },
                      { id: "opt-2", label: "No", percentage: 33, votes: 4 }
                    ]}
                    insights="Looks like everyone's confident Alex will actually show up for once!"
                    isPreview={true}
                  />
                </Link>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Recent Bets</h2>
                  <Link to="/leaderboard">
                    <Button variant="ghost" size="sm" trailingIcon={<ChevronRight className="h-4 w-4" />}>
                      View all
                    </Button>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentBets.map((bet) => (
                    <BetCard key={bet.id} bet={bet} />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <QuickGroupBet />
              <ChaosWheel />
              <BestLoss />
            </div>
          </div>
        </section>
        
        {/* Trending bets section */}
        <section className="py-8">
          <TrendingBets bets={trendingBets} />
        </section>
      </div>
      
      <CreateBetModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </AppLayout>
  );
};

export default Index;
