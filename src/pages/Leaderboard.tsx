
import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TrendingBets from '@/components/bet/TrendingBets';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trendingBets } from '@/lib/data';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import UserAvatar from '@/components/profile/UserAvatar';
import { Trophy, TrendingUp, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_USERS = [
  { id: 1, name: 'Alex Johnson', avatar: null, initials: 'AJ', points: 2450, wins: 42, winRate: '78%' },
  { id: 2, name: 'Sarah Williams', avatar: null, initials: 'SW', points: 2180, wins: 37, winRate: '72%' },
  { id: 3, name: 'Marcus Lee', avatar: null, initials: 'ML', points: 1950, wins: 35, winRate: '65%' },
  { id: 4, name: 'Jessica Chen', avatar: null, initials: 'JC', points: 1820, wins: 33, winRate: '68%' },
  { id: 5, name: 'Daniel Kim', avatar: null, initials: 'DK', points: 1720, wins: 31, winRate: '62%' },
  { id: 6, name: 'Rachel Patel', avatar: null, initials: 'RP', points: 1650, wins: 30, winRate: '60%' },
  { id: 7, name: 'Michael Brown', avatar: null, initials: 'MB', points: 1530, wins: 28, winRate: '55%' },
  { id: 8, name: 'Olivia Smith', avatar: null, initials: 'OS', points: 1480, wins: 27, winRate: '58%' },
  { id: 9, name: 'Kevin Jones', avatar: null, initials: 'KJ', points: 1350, wins: 25, winRate: '50%' },
  { id: 10, name: 'Emily Davis', avatar: null, initials: 'ED', points: 1290, wins: 24, winRate: '53%' },
];

const LeaderboardPage = () => {
  const [currentTab, setCurrentTab] = useState('trending');

  return (
    <AppLayout>
      <div className="container px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <h1 className="text-3xl font-bold">Leaderboard & Trending</h1>
        </div>

        <Tabs
          defaultValue="trending" 
          className="w-full"
          onValueChange={setCurrentTab}
        >
          <TabsList className="w-full max-w-md mb-8">
            <TabsTrigger value="trending" className="flex-1">
              <TrendingUp className="mr-2 h-4 w-4" />
              Trending Bets
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1">
              <Users className="mr-2 h-4 w-4" />
              Top Players
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex-1">
              <Calendar className="mr-2 h-4 w-4" />
              This Week
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="space-y-6 animate-fade-in">
            <TrendingBets bets={trendingBets} />
          </TabsContent>

          <TabsContent value="users" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Top Players</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rank</TableHead>
                      <TableHead>Player</TableHead>
                      <TableHead className="text-right">Points</TableHead>
                      <TableHead className="text-right">Wins</TableHead>
                      <TableHead className="text-right">Win Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_USERS.map((user, index) => (
                      <TableRow key={user.id} className={index < 3 ? "font-medium" : ""}>
                        <TableCell className="font-medium">
                          <div className={cn(
                            "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white",
                            index === 0 ? "bg-yellow-500" : 
                            index === 1 ? "bg-gray-400" : 
                            index === 2 ? "bg-amber-700" : "bg-muted text-muted-foreground"
                          )}>
                            {index + 1}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <UserAvatar src={user.avatar} initials={user.initials} size="sm" />
                            <span className="ml-2">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{user.points.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{user.wins}</TableCell>
                        <TableCell className="text-right">{user.winRate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">4</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">5</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6 animate-fade-in">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Highlights</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Top Bettor
                    </h3>
                    <div className="flex items-center space-x-4 p-4 rounded-xl bg-muted/50">
                      <UserAvatar size="lg" initials="AJ" />
                      <div>
                        <h4 className="font-bold">Alex Johnson</h4>
                        <p className="text-sm text-muted-foreground">15 wins this week</p>
                        <p className="text-xs text-muted-foreground">85% success rate</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Most Popular Bet
                    </h3>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <h4 className="font-bold">Will the project launch on time?</h4>
                      <p className="text-sm text-muted-foreground">243 participants</p>
                      <p className="text-xs text-muted-foreground">$1,250 total pool</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-bold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      Upcoming Event
                    </h3>
                    <div className="p-4 rounded-xl bg-muted/50">
                      <h4 className="font-bold">Weekend Tournament</h4>
                      <p className="text-sm text-muted-foreground">Starts in 2 days</p>
                      <p className="text-xs text-muted-foreground">$500 prize pool</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default LeaderboardPage;
