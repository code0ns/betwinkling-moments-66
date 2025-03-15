
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AppLayout from '@/components/layout/AppLayout';
import UserAvatar from '@/components/profile/UserAvatar';
import Button from '@/components/shared/Button';
import { Card } from '@/components/ui/card';
import { Trophy, ThumbsDown, Calendar, Download, User, Edit, Plus } from 'lucide-react';
import { userStats } from '@/lib/data';
import Achievement from '@/components/profile/Achievement';
import BetItem from '@/components/profile/BetItem';
import { cn } from '@/lib/utils';
import betService from '@/services/betService';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("active");
  const [userBets, setUserBets] = useState<any[]>([]);
  const [userCreatedBets, setUserCreatedBets] = useState<any[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Load user's bets
    const bets = betService.getUserBets();
    setUserBets(bets);
    
    // Load bets created by the user
    const createdBets = betService.getUserCreatedBets();
    setUserCreatedBets(createdBets);
  }, []);
  
  const handleBetClick = (betId: string) => {
    navigate(`/bet/${betId}`);
  };
  
  const getGradientForBet = (index: number) => {
    const gradients = ["orange", "blue", "green", "purple"] as const;
    return gradients[index % gradients.length];
  };
  
  const renderBetItems = (bets: any[]) => {
    if (bets.length === 0) {
      return (
        <div className="py-12 text-center">
          <div className="h-16 w-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plus className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">No bets yet</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven't {activeTab === "active" ? "joined" : "created"} any bets yet. 
            Create a new bet or join existing ones to see them here.
          </p>
          <Button onClick={() => navigate('/')}>
            Browse Bets
          </Button>
        </div>
      );
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bets.map((bet, index) => {
          // Format options for display
          const optionLabels = bet.options.map((opt: any) => opt.label);
          
          // Format value based on stake type
          let value = '';
          if (bet.stake.type === 'money') {
            value = `$${bet.stake.value}`;
          } else if (bet.stake.type === 'points') {
            value = `${bet.stake.value} pts`;
          } else {
            value = `Dare: ${bet.stake.value}`;
          }
          
          // Format time left
          const timeLeft = formatDistanceToNow(new Date(bet.expiresAt), { addSuffix: false });
          
          return (
            <div key={bet.id} onClick={() => handleBetClick(bet.id)} className="cursor-pointer">
              <BetItem 
                title={bet.title}
                type={optionLabels.length > 2 ? "Multiple Choice" : "Yes/No"}
                expiresIn={timeLeft}
                options={optionLabels}
                creator={bet.created_by.name}
                value={value}
                gradient={getGradientForBet(index)}
              />
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <AppLayout>
      <div className="container px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center gap-4">
              <UserAvatar 
                size="lg"
                src="/lovable-uploads/c401c374-948d-461a-8657-770b5108795a.png"
                alt="Your profile"
              />
              
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">You</h1>
                  <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">
                    Bet Master
                  </span>
                </div>
                
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span>{userStats.wonBets} wins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsDown className="h-4 w-4 text-red-400" />
                    <span>{userStats.lostBets} losses</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span>{userCreatedBets.length} bets created</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              leadingIcon={<Edit className="h-4 w-4" />}
            >
              Edit Profile
            </Button>
          </div>
          
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Win Rate</span>
              <span className="text-sm font-medium text-primary">{Math.round((userStats.wonBets / userStats.totalBets) * 100)}%</span>
            </div>
            <div className="h-2 bg-secondary/50 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-blue-400" 
                style={{ width: `${(userStats.wonBets / userStats.totalBets) * 100}%` }}
              />
            </div>
          </div>
        </div>
        
        <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 w-full mb-8 bg-secondary/20">
            <TabsTrigger value="active">Active Bets</TabsTrigger>
            <TabsTrigger value="created">Created Bets</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-0">
            {renderBetItems(userBets)}
          </TabsContent>
          
          <TabsContent value="created" className="mt-0">
            {renderBetItems(userCreatedBets)}
          </TabsContent>
          
          <TabsContent value="achievements" className="mt-0">
            {activeTab === "achievements" && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Achievement 
                  title="Bet Master"
                  icon={<Trophy />}
                  isUnlocked={true}
                  iconColor="bg-purple-500/20"
                  iconTextColor="text-purple-500"
                />
                <Achievement 
                  title="Risk Taker"
                  icon={<Trophy />} 
                  isUnlocked={true}
                  iconColor="bg-blue-500/20"
                  iconTextColor="text-blue-500"
                />
                <Achievement 
                  title="Lucky Streak"
                  icon={<Trophy />}
                  isUnlocked={true}
                  iconColor="bg-indigo-500/20"
                  iconTextColor="text-indigo-500"
                />
                <Achievement 
                  title="Creator"
                  icon={<Trophy />}
                  isUnlocked={userCreatedBets.length > 0}
                  iconColor={userCreatedBets.length > 0 ? "bg-green-500/20" : "bg-gray-500/20"}
                  iconTextColor={userCreatedBets.length > 0 ? "text-green-500" : "text-gray-500"}
                />
                <Achievement 
                  title="Big Winner"
                  icon={<Trophy />}
                  isUnlocked={false}
                  iconColor="bg-gray-500/20"
                  iconTextColor="text-gray-500"
                />
                <Achievement 
                  title="Dare Devil"
                  icon={<Trophy />}
                  isUnlocked={false}
                  iconColor="bg-gray-500/20"
                  iconTextColor="text-gray-500"
                />
                <Achievement 
                  title="Trend Setter"
                  icon={<Trophy />}
                  isUnlocked={false}
                  iconColor="bg-gray-500/20"
                  iconTextColor="text-gray-500"
                />
                <Achievement 
                  title="Quick Draw"
                  icon={<Trophy />}
                  isUnlocked={false}
                  iconColor="bg-gray-500/20"
                  iconTextColor="text-gray-500"
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Profile;
