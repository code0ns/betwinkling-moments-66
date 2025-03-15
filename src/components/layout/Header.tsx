
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Home, Trophy, Plus, User, Bell } from 'lucide-react';
import Button from '../shared/Button';
import UserAvatar from '../profile/UserAvatar';
import { cn } from '@/lib/utils';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    // Close menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);
  
  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="h-5 w-5" /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <Trophy className="h-5 w-5" /> },
    { name: 'Profile', path: '/profile', icon: <User className="h-5 w-5" /> },
  ];
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/80 backdrop-blur-lg shadow-lg" : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-premium">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500"></div>
            </div>
          </div>
          <span className="font-bold text-lg text-foreground">BetMoment</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "px-4 py-2 rounded-md flex items-center space-x-2 transition-all duration-200",
                location.pathname === item.path
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button 
            variant="premium" 
            size="sm" 
            className="hidden md:flex"
            leadingIcon={<Plus className="h-4 w-4" />}
          >
            Create Bet
          </Button>
          
          <button className="relative p-2 text-muted-foreground hover:text-foreground transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 flex h-2 w-2 items-center justify-center rounded-full bg-primary"></span>
          </button>
          
          <div className="hidden md:block">
            <UserAvatar size="sm" initials="JS" />
          </div>
          
          <button 
            className="md:hidden p-2 rounded-md text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-all"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-background z-40 pt-20 px-4 transition-transform duration-300 md:hidden overflow-auto",
          isMenuOpen ? "transform-none" : "translate-x-full"
        )}
      >
        <div className="space-y-6 py-6">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "px-4 py-3 rounded-md flex items-center space-x-3 transition-all duration-200",
                  location.pathname === item.path
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                {item.icon}
                <span className="text-lg">{item.name}</span>
              </Link>
            ))}
          </div>
          
          <div className="border-t border-border pt-6">
            <Button 
              variant="premium" 
              fullWidth
              leadingIcon={<Plus className="h-5 w-5" />}
            >
              Create New Bet
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
