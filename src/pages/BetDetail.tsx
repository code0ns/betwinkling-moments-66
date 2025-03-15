
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import BetDetailComponent from '@/components/bet/BetDetail';
import { Card } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

const BetDetailPage = () => {
  return (
    <AppLayout>
      <div className="container px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <BetDetailComponent 
            title="Will Alex actually show up to the party?"
            description="Alex always says he'll come but never shows up. Let's see if tonight is different!"
            participants={12}
            timeLeft="2h left"
            pool="$600"
            options={[
              { label: "Yes", percentage: 67, votes: 8 },
              { label: "No", percentage: 33, votes: 4 }
            ]}
            insights="Looks like everyone's confident Alex will actually show up for once!"
          />
          
          <div className="mt-6">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5" />
              Comments
            </h3>
            
            <Card className="p-4 bg-secondary/30 border-white/10">
              <p className="text-muted-foreground text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default BetDetailPage;
