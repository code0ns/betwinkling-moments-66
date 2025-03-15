
import { v4 as uuidv4 } from 'uuid';

interface GroupBet {
  id: string;
  title: string;
  description: string;
  creator: string;
  createdAt: string;
  participants: number;
  options: {
    id: string;
    label: string;
    percentage: number;
    votes: number;
  }[];
  comments: {
    id: string;
    author: string;
    text: string;
    timestamp: string;
  }[];
  stake: {
    type: 'money' | 'points' | 'dare';
    value: number | string;
  };
  expiresAt: string;
  image?: string;
}

const getGroupBets = (): GroupBet[] => {
  return JSON.parse(localStorage.getItem('groupBets') || '[]');
};

const getGroupBetById = (id: string): GroupBet | undefined => {
  const groupBets = getGroupBets();
  return groupBets.find(bet => bet.id === id);
};

const saveGroupBets = (groupBets: GroupBet[]) => {
  localStorage.setItem('groupBets', JSON.stringify(groupBets));
};

const updateGroupBet = (id: string, updates: Partial<GroupBet>): GroupBet | undefined => {
  const groupBets = getGroupBets();
  const betIndex = groupBets.findIndex(bet => bet.id === id);
  
  if (betIndex !== -1) {
    const updatedBet = { ...groupBets[betIndex], ...updates };
    groupBets[betIndex] = updatedBet;
    saveGroupBets(groupBets);
    return updatedBet;
  }
  
  return undefined;
};

const addCommentToGroupBet = (groupId: string, text: string): GroupBet | undefined => {
  const comment = {
    id: uuidv4(),
    author: "You",
    text,
    timestamp: new Date().toISOString(),
  };
  
  const groupBets = getGroupBets();
  const betIndex = groupBets.findIndex(bet => bet.id === groupId);
  
  if (betIndex !== -1) {
    const bet = groupBets[betIndex];
    const updatedComments = [...(bet.comments || []), comment];
    const updatedBet = { ...bet, comments: updatedComments };
    
    groupBets[betIndex] = updatedBet;
    saveGroupBets(groupBets);
    return updatedBet;
  }
  
  return undefined;
};

const joinGroupBet = (groupId: string): GroupBet | undefined => {
  const groupBets = getGroupBets();
  const betIndex = groupBets.findIndex(bet => bet.id === groupId);
  
  if (betIndex !== -1) {
    const bet = groupBets[betIndex];
    const updatedBet = { ...bet, participants: bet.participants + 1 };
    
    groupBets[betIndex] = updatedBet;
    saveGroupBets(groupBets);
    return updatedBet;
  }
  
  return undefined;
};

const voteOnGroupBet = (groupId: string, optionId: string): GroupBet | undefined => {
  const groupBets = getGroupBets();
  const betIndex = groupBets.findIndex(bet => bet.id === groupId);
  
  if (betIndex !== -1) {
    const bet = groupBets[betIndex];
    const updatedOptions = bet.options.map(option => {
      if (option.id === optionId) {
        return { ...option, votes: option.votes + 1 };
      }
      return option;
    });
    
    // Recalculate percentages
    const totalVotes = updatedOptions.reduce((sum, option) => sum + option.votes, 0);
    const optionsWithPercentages = updatedOptions.map(option => ({
      ...option,
      percentage: totalVotes > 0 ? Math.round((option.votes / totalVotes) * 100) : 0
    }));
    
    const updatedBet = { ...bet, options: optionsWithPercentages };
    groupBets[betIndex] = updatedBet;
    saveGroupBets(groupBets);
    return updatedBet;
  }
  
  return undefined;
};

const groupBetService = {
  getGroupBets,
  getGroupBetById,
  updateGroupBet,
  addCommentToGroupBet,
  joinGroupBet,
  voteOnGroupBet
};

export default groupBetService;
