
import { addDays, addHours } from 'date-fns';

export const trendingBets = [
  {
    id: '1',
    title: 'Will the project be delivered on time?',
    description: 'Our team has been working on this project for months. Will we hit the deadline?',
    created_by: {
      name: 'Alex Johnson',
      initials: 'AJ',
    },
    participants: 12,
    expiresAt: addDays(new Date(), 3),
    stake: {
      type: 'money' as const,
      value: 20,
    },
    isTrending: true,
    commentCount: 8,
    options: [
      { id: '1-1', label: 'Yes', color: 'green' },
      { id: '1-2', label: 'No', color: 'red' },
    ],
  },
  {
    id: '2',
    title: 'Who will win the hackathon?',
    created_by: {
      name: 'Morgan Lee',
      initials: 'ML',
    },
    participants: 24,
    expiresAt: addHours(new Date(), 36),
    stake: {
      type: 'points' as const,
      value: 500,
    },
    isTrending: true,
    commentCount: 15,
    options: [
      { id: '2-1', label: 'Team Alpha' },
      { id: '2-2', label: 'Team Beta' },
      { id: '2-3', label: 'Team Gamma' },
      { id: '2-4', label: 'Team Delta' },
    ],
  },
  {
    id: '3',
    title: 'Will Sarah be late to the meeting?',
    created_by: {
      name: 'David Chen',
      initials: 'DC',
    },
    participants: 8,
    expiresAt: addHours(new Date(), 1),
    stake: {
      type: 'dare' as const,
      value: 'Buy coffee for everyone',
    },
    isTrending: false,
    commentCount: 23,
    options: [
      { id: '3-1', label: 'Yes, as usual', color: 'orange' },
      { id: '3-2', label: 'No, she\'ll be on time', color: 'blue' },
    ],
  },
  {
    id: '4',
    title: 'How long will the movie night last?',
    description: 'We\'re watching the entire trilogy. Place your bets on how long we\'ll last before someone falls asleep.',
    created_by: {
      name: 'Jamie Smith',
      initials: 'JS',
    },
    participants: 16,
    expiresAt: addDays(new Date(), 1),
    stake: {
      type: 'money' as const,
      value: 10,
    },
    isTrending: true,
    commentCount: 7,
    options: [
      { id: '4-1', label: 'Less than 3 hours' },
      { id: '4-2', label: '3-5 hours' },
      { id: '4-3', label: 'The whole trilogy!' },
    ],
  },
  {
    id: '5',
    title: 'Will it rain this weekend?',
    created_by: {
      name: 'Taylor Lopez',
      initials: 'TL',
    },
    participants: 32,
    expiresAt: addDays(new Date(), 2),
    stake: {
      type: 'points' as const,
      value: 200,
    },
    isTrending: true,
    commentCount: 18,
    options: [
      { id: '5-1', label: 'Yes', color: 'blue' },
      { id: '5-2', label: 'No', color: 'yellow' },
    ],
  },
];

export const recentBets = [
  {
    id: '6',
    title: 'Who will score the first goal?',
    created_by: {
      name: 'Jordan Williams',
      initials: 'JW',
    },
    participants: 45,
    expiresAt: addHours(new Date(), 3),
    stake: {
      type: 'money' as const,
      value: 15,
    },
    isTrending: false,
    commentCount: 32,
    options: [
      { id: '6-1', label: 'Player A' },
      { id: '6-2', label: 'Player B' },
      { id: '6-3', label: 'Player C' },
      { id: '6-4', label: 'No goals' },
    ],
  },
  {
    id: '7',
    title: 'Will the new feature be approved?',
    description: 'The team has been working on this new feature for weeks. Will the stakeholders approve it?',
    created_by: {
      name: 'Riley Parker',
      initials: 'RP',
    },
    participants: 19,
    expiresAt: addDays(new Date(), 4),
    stake: {
      type: 'dare' as const,
      value: 'Presentation in a funny costume',
    },
    isTrending: false,
    commentCount: 14,
    options: [
      { id: '7-1', label: 'Approved', color: 'green' },
      { id: '7-2', label: 'Rejected', color: 'red' },
      { id: '7-3', label: 'More revisions needed', color: 'yellow' },
    ],
  },
];

export const userStats = {
  totalBets: 47,
  wonBets: 32,
  lostBets: 15,
  pointsEarned: 2450,
  currentStreak: 5,
  achievements: [
    { id: 'a1', name: 'Risk Taker', description: 'Place 10 bets', completed: true },
    { id: 'a2', name: 'Winning Streak', description: 'Win 5 bets in a row', completed: true },
    { id: 'a3', name: 'Big Spender', description: 'Place a bet with $50+', completed: false },
    { id: 'a4', name: 'Social Butterfly', description: 'Invite 10 friends', completed: false },
  ],
};
