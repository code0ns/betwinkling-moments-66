
import React, { ReactNode } from 'react';
import Header from './Header';
import { Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  className?: string;
}

const AppLayout = ({ children, hideHeader = false, className }: AppLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {!hideHeader && <Header />}
      
      <main className={cn("pt-24 pb-24", className)}>
        {children}
      </main>
      
      {/* Mobile Create Button (Floating Action Button) */}
      <div className="fixed bottom-6 right-6 md:hidden">
        <button 
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center shadow-premium transition-all duration-300 hover:shadow-premium-hover hover:scale-105"
        >
          <Plus className="h-7 w-7 text-white" />
        </button>
      </div>
    </div>
  );
};

export default AppLayout;
