import { addDays, addHours, formatDistanceToNow } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

// Types
export interface Bet {
  id: string;
  title: string;
  description?: string;
  created_by: {
    name: string;
    initials: string;
  };
  participants: number;
  expiresAt: Date;
  stake: {
    type: 'money' | 'points' | 'dare';
    value: number | string;
  };
  isTrending: boolean;
  commentCount: number;
  options: {
    id: string;
    label: string;
    color?: string;
    votes?: number;
    percentage?: number;
  }[];
  userVote?: string; // The option ID the user voted for
  comments?: {
    id: string;
    author: string;
    text: string;
    timestamp: Date;
  }[];
  userDoubledDown?: boolean;
  reactions?: {
    emoji: string;
    count: number;
  }[];
  userLiked?: boolean;
}

// Storage keys
const STORAGE_KEYS = {
  BETS: 'betapp_bets',
  USER_BETS: 'betapp_user_bets', // IDs of bets the user has joined
  USER_CREATED_BETS: 'betapp_user_created_bets', // IDs of bets the user has created
};

// Import mock data
import { trendingBets, recentBets } from '../lib/data';

class BetService {
  private bets: Map<string, Bet>;
  private userBets: Set<string>; // Bets the user has joined
  private userCreatedBets: Set<string>; // Bets the user has created

  constructor() {
    this.bets = new Map();
    this.userBets = new Set();
    this.userCreatedBets = new Set();
    this.loadFromStorage();
    this.initializeMockData();
    
    // Make sure we have the featured bet
    if (!this.bets.has('featured-bet-1')) {
      this.createFeaturedBet();
    }
  }

  private createFeaturedBet() {
    const featuredBet: Bet = {
      id: 'featured-bet-1',
      title: 'Will Alex actually show up to the party?',
      description: 'Alex always says he\'ll come but never shows up. Let\'s see if tonight is different!',
      created_by: {
        name: 'Party Host',
        initials: 'PH',
      },
      participants: 12,
      expiresAt: addHours(new Date(), 2),
      stake: {
        type: 'money',
        value: 50,
      },
      isTrending: true,
      commentCount: 8,
      options: [
        { id: 'opt-1', label: 'Yes', votes: 8, percentage: 67 },
        { id: 'opt-2', label: 'No', votes: 4, percentage: 33 },
      ],
      comments: [
        {
          id: uuidv4(),
          author: 'Jamie',
          text: 'He\'s always saying he\'ll come and then doesn\'t show up...',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
          id: uuidv4(),
          author: 'Alex\'s Friend',
          text: 'I texted him and he said he\'s definitely coming this time!',
          timestamp: new Date(Date.now() - 1000 * 60 * 15),
        },
      ],
      reactions: [
        { emoji: '😂', count: 7 },
        { emoji: '🤔', count: 5 },
        { emoji: '🙏', count: 3 },
      ],
    };
    
    this.bets.set(featuredBet.id, featuredBet);
    this.saveToStorage();
  }

  private loadFromStorage() {
    try {
      // Load bets
      const storedBets = localStorage.getItem(STORAGE_KEYS.BETS);
      if (storedBets) {
        const parsedBets = JSON.parse(storedBets);
        Object.entries(parsedBets).forEach(([id, bet]) => {
          // Convert string dates back to Date objects
          const typedBet = bet as Bet;
          typedBet.expiresAt = new Date(typedBet.expiresAt);
          if (typedBet.comments) {
            typedBet.comments = typedBet.comments.map(comment => ({
              ...comment,
              timestamp: new Date(comment.timestamp)
            }));
          }
          this.bets.set(id, typedBet);
        });
      }

      // Load user bets
      const storedUserBets = localStorage.getItem(STORAGE_KEYS.USER_BETS);
      if (storedUserBets) {
        const parsedUserBets = JSON.parse(storedUserBets);
        parsedUserBets.forEach((id: string) => this.userBets.add(id));
      }

      // Load user created bets
      const storedUserCreatedBets = localStorage.getItem(STORAGE_KEYS.USER_CREATED_BETS);
      if (storedUserCreatedBets) {
        const parsedUserCreatedBets = JSON.parse(storedUserCreatedBets);
        parsedUserCreatedBets.forEach((id: string) => this.userCreatedBets.add(id));
      }
    } catch (error) {
      console.error('Error loading bets from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      // Convert Map to object for storage
      const betsObject: Record<string, Bet> = {};
      this.bets.forEach((bet, id) => {
        betsObject[id] = bet;
      });

      localStorage.setItem(STORAGE_KEYS.BETS, JSON.stringify(betsObject));
      localStorage.setItem(STORAGE_KEYS.USER_BETS, JSON.stringify(Array.from(this.userBets)));
      localStorage.setItem(STORAGE_KEYS.USER_CREATED_BETS, JSON.stringify(Array.from(this.userCreatedBets)));
    } catch (error) {
      console.error('Error saving bets to storage:', error);
    }
  }

  private initializeMockData() {
    // Only initialize if we don't have data already
    if (this.bets.size === 0) {
      [...trendingBets, ...recentBets].forEach(bet => {
        // Generate some mock comments for each bet
        const mockComments = [
          {
            id: uuidv4(),
            author: 'User1',
            text: `I think ${bet.options && bet.options[0]?.label} is the most likely outcome.`,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          },
          {
            id: uuidv4(),
            author: 'User2',
            text: 'This is an interesting bet!',
            timestamp: new Date(Date.now() - 1000 * 60 * 30),
          },
          {
            id: uuidv4(),
            author: 'User3',
            text: 'I just placed my bet. Exciting!',
            timestamp: new Date(Date.now() - 1000 * 60 * 10),
          },
        ];
        
        // Generate mock reactions
        const mockReactions = [
          { emoji: "😂", count: Math.floor(Math.random() * 10) + 1 },
          { emoji: "🔥", count: Math.floor(Math.random() * 8) + 1 },
          { emoji: "😮", count: Math.floor(Math.random() * 5) + 1 },
          { emoji: "👍", count: Math.floor(Math.random() * 7) + 1 },
        ];
        
        this.bets.set(bet.id, {
          ...bet,
          options: bet.options?.map(option => ({
            ...option,
            votes: Math.floor(Math.random() * 10) + 1,
            percentage: 0, // Will be calculated
          })) || [],
          comments: mockComments,
          reactions: mockReactions,
          commentCount: mockComments.length,
        });

        // Calculate percentages
        this.recalculatePercentages(bet.id);
      });

      this.saveToStorage();
    }
  }

  private recalculatePercentages(betId: string) {
    const bet = this.bets.get(betId);
    if (!bet) return;

    const totalVotes = bet.options.reduce((sum, option) => sum + (option.votes || 0), 0);
    
    if (totalVotes > 0) {
      bet.options = bet.options.map(option => ({
        ...option,
        percentage: Math.round(((option.votes || 0) / totalVotes) * 100)
      }));
    } else {
      // Equal distribution if no votes
      const equalPercentage = Math.floor(100 / bet.options.length);
      bet.options = bet.options.map(option => ({
        ...option,
        percentage: equalPercentage
      }));
    }

    this.bets.set(betId, bet);
    this.saveToStorage();
  }

  getAllBets(): Bet[] {
    return Array.from(this.bets.values());
  }

  getTrendingBets(): Bet[] {
    return Array.from(this.bets.values()).filter(bet => bet.isTrending);
  }

  getRecentBets(): Bet[] {
    return Array.from(this.bets.values())
      .filter(bet => !bet.isTrending)
      .sort((a, b) => b.expiresAt.getTime() - a.expiresAt.getTime());
  }

  getUserBets(): Bet[] {
    return Array.from(this.userBets)
      .map(id => this.bets.get(id))
      .filter(Boolean) as Bet[];
  }

  getUserCreatedBets(): Bet[] {
    return Array.from(this.userCreatedBets)
      .map(id => this.bets.get(id))
      .filter(Boolean) as Bet[];
  }

  getBetById(id: string): Bet | undefined {
    return this.bets.get(id);
  }

  createBet(betData: Partial<Bet>): Bet {
    const id = uuidv4();
    
    // Default values
    const newBet: Bet = {
      id,
      title: betData.title || 'Untitled Bet',
      description: betData.description,
      created_by: betData.created_by || {
        name: 'You',
        initials: 'Y',
      },
      participants: 1,
      expiresAt: betData.expiresAt || addDays(new Date(), 1),
      stake: betData.stake || {
        type: 'points',
        value: 100,
      },
      isTrending: false,
      commentCount: 0,
      options: betData.options || [
        { id: `${id}-1`, label: 'Yes', votes: 0, percentage: 50 },
        { id: `${id}-2`, label: 'No', votes: 0, percentage: 50 },
      ],
      comments: [],
      reactions: [],
    };

    this.bets.set(id, newBet);
    this.userCreatedBets.add(id);
    this.saveToStorage();

    return newBet;
  }

  placeBet(betId: string, optionId: string): Bet | null {
    const bet = this.bets.get(betId);
    if (!bet) return null;

    // If user already voted, return without changes
    if (bet.userVote === optionId) return bet;

    // Update votes
    bet.options = bet.options.map(option => {
      if (option.id === optionId) {
        return {
          ...option,
          votes: (option.votes || 0) + 1
        };
      } else if (option.id === bet.userVote) {
        // If user changed their vote, decrement the previous option
        return {
          ...option,
          votes: Math.max((option.votes || 0) - 1, 0)
        };
      }
      return option;
    });

    bet.userVote = optionId;
    
    // User is now participating in this bet
    if (!this.userBets.has(betId)) {
      this.userBets.add(betId);
      bet.participants += 1;
    }

    this.recalculatePercentages(betId);
    this.bets.set(betId, bet);
    this.saveToStorage();

    return bet;
  }

  doubleDown(betId: string): Bet | null {
    const bet = this.bets.get(betId);
    if (!bet || !bet.userVote || bet.userDoubledDown) return null;

    // Double the user's vote
    bet.options = bet.options.map(option => {
      if (option.id === bet.userVote) {
        return {
          ...option,
          votes: (option.votes || 0) + 1
        };
      }
      return option;
    });

    bet.userDoubledDown = true;
    
    this.recalculatePercentages(betId);
    this.bets.set(betId, bet);
    this.saveToStorage();

    return bet;
  }

  addComment(betId: string, text: string): Bet | null {
    const bet = this.bets.get(betId);
    if (!bet) return null;

    const comment = {
      id: uuidv4(),
      author: 'You',
      text,
      timestamp: new Date()
    };

    bet.comments = [comment, ...(bet.comments || [])];
    bet.commentCount += 1;
    
    this.bets.set(betId, bet);
    this.saveToStorage();

    return bet;
  }

  addReaction(betId: string, emoji: string): Bet | null {
    const bet = this.bets.get(betId);
    if (!bet) return null;

    bet.reactions = bet.reactions || [];
    
    // Find if emoji already exists
    const existingReactionIndex = bet.reactions.findIndex(r => r.emoji === emoji);
    
    if (existingReactionIndex >= 0) {
      // Increment count
      bet.reactions[existingReactionIndex].count += 1;
    } else {
      // Add new reaction
      bet.reactions.push({ emoji, count: 1 });
    }
    
    this.bets.set(betId, bet);
    this.saveToStorage();

    return bet;
  }

  toggleLike(betId: string): Bet | null {
    const bet = this.bets.get(betId);
    if (!bet) return null;

    bet.userLiked = !bet.userLiked;
    
    this.bets.set(betId, bet);
    this.saveToStorage();

    return bet;
  }

  // Format the time left for display
  formatTimeLeft(date: Date): string {
    if (!date) return '';
    return formatDistanceToNow(date, { addSuffix: false }) + ' left';
  }

  // Generate invitation link/code
  generateInviteCode(betId: string): string {
    return `${window.location.origin}/bet/${betId}`;
  }

  // Clear all data (for testing)
  clearAll() {
    this.bets.clear();
    this.userBets.clear();
    this.userCreatedBets.clear();
    localStorage.removeItem(STORAGE_KEYS.BETS);
    localStorage.removeItem(STORAGE_KEYS.USER_BETS);
    localStorage.removeItem(STORAGE_KEYS.USER_CREATED_BETS);
  }
}

// Create a singleton instance
const betService = new BetService();

export default betService;
