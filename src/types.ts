export type TaxonomyLevel = 'K1' | 'K2' | 'K3';

export interface Question {
  id: string;
  chapterId: number;
  chapterTitle: string;
  taxonomy: TaxonomyLevel; // K1: Lembrar, K2: Compreender, K3: Aplicar
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  chapterId: number;
  title: string;
  summary: string;
  content: {
    sectionTitle: string;
    text: string;
    bulletPoints?: string[];
    tip?: string;
    example?: string;
  }[];
  xpReward: number;
}

export interface Chapter {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  color: string;
  syllabusReference: string;
  lessons: Lesson[];
  quizQuestions: Question[];
  badge: {
    id: string;
    name: string;
    description: string;
    icon: string;
  };
}

export interface UserProfile {
  id: string;
  uid?: string;
  createdAt?: string;
  updatedAt?: string;
  name: string;
  email: string;
  plan: 'free' | 'premium';
  xpTotal: number;
  level: number;
  levelTitle: string;
  streakDays: number;
  lastActiveDate: string; // YYYY-MM-DD
  livesCurrent: number;
  livesMax: number;
  lastLifeRechargeTime: number; // Timestamp ms
  mockExamsUsedThisMonth: number;
  mockExamResetMonth: number; // 0-11
  completedLessonIds: string[];
  completedChapterIds: number[];
  unlockedBadgeIds: string[];
  league: 'Bronze' | 'Prata' | 'Ouro' | 'Platina' | 'Diamante';
  language: 'pt' | 'en';
  isLoggedIn: boolean;
  authProvider?: 'google' | 'email' | 'guest';
  hasCompletedTutorial: boolean;
  hasChosenInitialAuth?: boolean;
  dataConsentAccepted?: boolean;
  notificationsEnabled?: boolean;
  analyticsConsentAccepted?: boolean;

  // Country, Economy & Virtual Currency
  country?: string; // 'BR', 'PT', 'US', 'ES', 'GB', 'MX', 'CO'
  coins: number; // In-app QA Coins
  extraMockExamTokens?: number; // Additional mock exam tokens bought with coins or real money
  bio?: string;
  company?: string;
  avatarUrl?: string;
  username?: string;
  followingIds?: string[]; // User IDs that this user follows
  followersCount?: number;
  clanId?: string;
  doubleXpActiveUntil?: number; // Timestamp ms
}

export interface MockExamResult {
  id: string;
  userId?: string;
  date: string;
  timeSpentSeconds: number;
  score: number; // 0-40
  percentage: number;
  passed: boolean; // >= 65% (26/40)
  answers: {
    questionId: string;
    userSelectedIndex: number;
    correctIndex: number;
    isCorrect: boolean;
    chapterId: number;
  }[];
}

export interface LeaderboardUser {
  id: string;
  name: string;
  username?: string;
  email?: string;
  avatarUrl?: string;
  weeklyXp: number;
  xpTotal?: number;
  rank: number;
  isCurrentUser?: boolean;
  league: string;
  badgeCount: number;
  company?: string;
  bio?: string;
  completedChapterCount?: number;
  mockExamPassedCount?: number;
  followingIds?: string[];
  followersCount?: number;
  isFollowing?: boolean;
  clanName?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  type: 'chapter_completed' | 'mock_passed' | 'badge_earned' | 'challenge_received' | 'challenge_result' | 'clan_invite';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  challengeId?: string;
  clanId?: string;
}

export interface ChallengeItem {
  id: string;
  challengerId: string;
  challengerName: string;
  challengerAvatar?: string;
  opponentId: string;
  opponentName: string;
  opponentAvatar?: string;
  questionCount: number;
  difficulty: 'K1' | 'K2' | 'K3' | 'mixed';
  status: 'pending_opponent' | 'completed';
  challengerScore: number;
  challengerTimeSec: number;
  opponentScore?: number;
  opponentTimeSec?: number;
  winnerId?: string;
  rewardXp: number;
  createdAt: string;
  questionIds: string[];
}

export interface ClanMember {
  id: string;
  name: string;
  username?: string;
  avatarUrl?: string;
  company?: string;
  role: 'leader' | 'member';
  xp: number;
  level: number;
  joinedAt?: string;
}

export interface ClanJoinRequest {
  id: string;
  userId: string;
  userName: string;
  userUsername?: string;
  userAvatar?: string;
  userXp: number;
  requestedAt: string;
}

export interface Clan {
  id: string;
  name: string;
  tag: string;
  description: string;
  avatarUrl?: string;
  leaderId: string;
  leaderName: string;
  leaderUsername?: string;
  members: ClanMember[];
  totalXp: number;
  level: number;
  joinType?: 'open' | 'approval'; // 'open' = free direct entry; 'approval' = requires leader approval
  pendingRequests?: ClanJoinRequest[];
  isPopular?: boolean;
}

export interface ClanChallenge {
  id: string;
  challengerClanId: string;
  challengerClanName: string;
  challengerClanTag: string;
  defenderClanId: string;
  defenderClanName: string;
  defenderClanTag: string;
  memberCount: number;
  status: 'pending' | 'completed';
  winnerClanId?: string;
  questionCount: number;
  createdAt: string;
}
