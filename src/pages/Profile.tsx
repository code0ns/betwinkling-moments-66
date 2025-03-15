
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import UserAvatar from '@/components/profile/UserAvatar';
import Button from '@/components/shared/Button';
import { userStats, trendingBets, recentBets } from '@/lib/data';
import { Settings, Award, ChevronRight, Trophy, ArrowUp, Check, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const Profile = () => {
  const allBets = [...trendingBets, ...recentBets].slice(0, 5);
  
  return (
    <AppLayout>
      <div className="container px-4">
        <div className="py-8 md:py-12 animate-fade-in">
          {/* Profile header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-md opacity-70 animate-pulse"></div>
                <UserAvatar 
                  size="lg" 
                  initials="JS" 
                  className="h-20 w-20 ring-4 ring-background"
                />
              </div>
              
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">John Smith</h1>
                  <div className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    Premium
                  </div>
                </div>
                <p className="text-muted-foreground">@johnsmith</p>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center">
                    <Trophy className="h-4 w-4 mr-1 text-yellow-500" />
                    <span className="text-sm font-medium">{userStats.wonBets} wins</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-blue-500" />
                    <span className="text-sm font-medium">Since Jan 2023</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              leadingIcon={<Settings className="h-4 w-4" />}
            >
              Edit Profile
            </Button>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="glass-card p-5 rounded-xl">
              <h3 className="text-sm text-muted-foreground mb-1">Total Bets</h3>
              <p className="text-2xl font-bold">{userStats.totalBets}</p>
            </div>
            
            <div className="glass-card p-5 rounded-xl">
              <h3 className="text-sm text-muted-foreground mb-1">Won Bets</h3>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold">{userStats.wonBets}</p>
                <div className="flex items-center text-green-500 text-xs font-medium pb-1">
                  <ArrowUp className="h-3 w-3 mr-0.5" />
                  <span>68%</span>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-5 rounded-xl">
              <h3 className="text-sm text-muted-foreground mb-1">Current Streak</h3>
              <p className="text-2xl font-bold">{userStats.currentStreak}🔥</p>
            </div>
            
            <div className="glass-card p-5 rounded-xl">
              <h3 className="text-sm text-muted-foreground mb-1">Points</h3>
              <p className="text-2xl font-bold">{userStats.pointsEarned}</p>
            </div>
          </div>
          
          {/* Achievements */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <h2 className="text-xl font-bold">Achievements</h2>
              </div>
              <Button variant="ghost" size="sm" trailingIcon={<ChevronRight className="h-4 w-4" />}>
                View all
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {userStats.achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={cn(
                    "relative rounded-xl p-5 transition-all duration-300 glass-card overflow-hidden",
                    achievement.completed ? "opacity-100" : "opacity-60"
                  )}
                >
                  {achievement.completed && (
                    <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-green-500/10 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    </div>
                  )}
                  
                  <div className="mb-4">
                    <div className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center",
                      achievement.completed ? "bg-yellow-500/10 text-yellow-500" : "bg-secondary/50 text-muted-foreground"
                    )}>
                      <Trophy className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <h3 className="font-semibold mb-1">{achievement.name}</h3>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Recent activity */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Activity</h2>
              <Button variant="ghost" size="sm" trailingIcon={<ChevronRight className="h-4 w-4" />}>
                View all
              </Button>
            </div>
            
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Bet</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Stake</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {allBets.map((bet) => (
                      <tr key={bet.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            <div className={`h-8 w-8 rounded-full ${
                              bet.stake.type === 'money' ? 'bg-green-500/10 text-green-500' : 
                              bet.stake.type === 'points' ? 'bg-blue-500/10 text-blue-500' : 
                              'bg-orange-500/10 text-orange-500'
                            } flex items-center justify-center`}>
                              {bet.stake.type === 'money' ? '$' : 
                               bet.stake.type === 'points' ? 'P' : 'D'}
                            </div>
                            <span className="truncate max-w-[200px]">{bet.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {bet.options && bet.options.length === 2 && bet.options[0].label === 'Yes' ? 'Yes/No' : 
                           bet.options && bet.options.length > 2 ? 'Multiple Choice' : 'Time-based'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {bet.stake.type === 'money' && <span>${bet.stake.value}</span>}
                          {bet.stake.type === 'points' && <span>{bet.stake.value} pts</span>}
                          {bet.stake.type === 'dare' && <span>Dare</span>}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-500">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {bet.expiresAt?.toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
