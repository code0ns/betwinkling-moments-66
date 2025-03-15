
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AppLayout from '@/components/layout/AppLayout';
import UserAvatar from '@/components/profile/UserAvatar';
import Button from '@/components/shared/Button';
import { Card } from '@/components/ui/card';
import { Trophy, ThumbsDown, Calendar, Download, User, Edit } from 'lucide-react';
import { userStats } from '@/lib/data';
import Achievement from '@/components/profile/Achievement';
import BetItem from '@/components/profile/BetItem';
import { cn } from '@/lib/utils';

const Profile = () => {
  const [activeTab, setActiveTab] = useState("active");
  
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
                    <span>{userStats.totalBets} bets created</span>
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
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <BetItem 
                title="Will Alex actually go to the gym this week?"
                type="Yes/No"
                expiresIn="3 days"
                options={["Yes", "No"]}
                creator="Emily"
                value="10 pts"
                gradient="orange"
              />
              <BetItem 
                title="Which hackathon project will win first place?"
                type="Multiple Choice"
                expiresIn="2 days"
                options={["Team Alpha", "Team Beta", "Team Gamma", "Team Delta"]}
                creator="Jake"
                value="80 ₿"
                gradient="blue"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            {activeTab === "history" && (
              <div className="flex flex-col items-center justify-center py-8 space-y-6">
                <div className="h-24 w-24 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
                  <Calendar className="h-12 w-12 text-blue-400" />
                </div>
                <h2 className="text-2xl font-bold">Your Bet History</h2>
                <p className="text-muted-foreground text-center max-w-md">
                  Track your past bets, see what you've won and lost, and learn from your betting patterns.
                </p>
                <div className="flex flex-col w-full max-w-md gap-3">
                  <Button>View All Settled Bets</Button>
                  <Button variant="outline" leadingIcon={<Download className="h-4 w-4" />}>
                    Download Betting Stats
                  </Button>
                </div>
              </div>
            )}
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
                  isUnlocked={false}
                  iconColor="bg-gray-500/20"
                  iconTextColor="text-gray-500"
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
