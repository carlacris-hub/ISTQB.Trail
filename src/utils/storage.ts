import { UserProfile, MockExamResult, LeaderboardUser } from '../types';
import { generateUniqueUsername, ALPHANUMERIC_REGEX } from './usernameUtils';
import { 
  saveUserProfileToFirestore, 
  saveUserProgressToFirestore, 
  saveMockExamResultToFirestore 
} from './firestoreService';

const STORAGE_KEY_USER = 'istqb_trail_user_profile_v1';
const STORAGE_KEY_EXAMS = 'istqb_trail_mock_exams_v1';


export const LEVEL_TITLES = [
  { level: 1, minXp: 0, title: 'Noviço em QA' },
  { level: 2, minXp: 100, title: 'Aprendiz ISTQB' },
  { level: 3, minXp: 250, title: 'Analista de Testes Jr.' },
  { level: 4, minXp: 500, title: 'Engenheiro de Qualidade' },
  { level: 5, minXp: 900, title: 'Especialista em CTFL' },
  { level: 6, minXp: 1500, title: 'Mestre ISTQB' },
];

export function calculateLevelInfo(xp: number) {
  let current = LEVEL_TITLES[0];
  for (const l of LEVEL_TITLES) {
    if (xp >= l.minXp) {
      current = l;
    } else {
      break;
    }
  }
  const nextLevel = LEVEL_TITLES.find(l => l.level === current.level + 1);
  const nextXpTarget = nextLevel ? nextLevel.minXp : current.minXp + 1000;
  const currentLevelMinXp = current.minXp;
  const progressInLevel = Math.min(100, Math.max(0, Math.round(((xp - currentLevelMinXp) / (nextXpTarget - currentLevelMinXp)) * 100)));

  return {
    level: current.level,
    title: current.title,
    nextXpTarget,
    progressInLevel
  };
}

export function getDefaultUser(): UserProfile {
  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonth = new Date().getMonth();

  return {
    id: 'usr_default',
    name: 'Candidato ISTQB',
    username: 'candidato123',
    email: 'candidato@sublime-se.com',
    plan: 'free',
    xpTotal: 120,
    level: 2,
    levelTitle: 'Aprendiz ISTQB',
    streakDays: 4,
    lastActiveDate: todayStr,
    livesCurrent: 5,
    livesMax: 5,
    lastLifeRechargeTime: Date.now(),
    mockExamsUsedThisMonth: 0,
    mockExamResetMonth: currentMonth,
    completedLessonIds: ['l1_1'],
    completedChapterIds: [],
    unlockedBadgeIds: [],
    league: 'Prata',
    language: 'pt',
    isLoggedIn: false,
    authProvider: 'guest',
    hasCompletedTutorial: false,
    hasChosenInitialAuth: false,
    country: 'BR',
    coins: 150, // 150 QA Coins welcome bonus
    extraMockExamTokens: 0,
  };
}

export function loadUserProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USER);
    if (raw) {
      const user: UserProfile = JSON.parse(raw);
      
      // Auto reset monthly mock exam count if month changed
      const currentMonth = new Date().getMonth();
      if (user.mockExamResetMonth !== currentMonth) {
        user.mockExamsUsedThisMonth = 0;
        user.mockExamResetMonth = currentMonth;
      }

      // Check life recharge for free user (1 life every 4 hours = 14400000 ms)
      if (user.plan === 'free' && user.livesCurrent < user.livesMax) {
        const now = Date.now();
        const elapsed = now - (user.lastLifeRechargeTime || now);
        const hoursPassed = Math.floor(elapsed / (4 * 3600 * 1000));
        if (hoursPassed >= 1) {
          user.livesCurrent = Math.min(user.livesMax, user.livesCurrent + hoursPassed);
          user.lastLifeRechargeTime = now;
        }
      }

      // Recalculate level title
      const lvlInfo = calculateLevelInfo(user.xpTotal);
      user.level = lvlInfo.level;
      user.levelTitle = lvlInfo.title;

      // Ensure economy and country defaults
      if (!user.country) user.country = 'BR';
      if (user.coins === undefined) user.coins = 150;
      if (user.extraMockExamTokens === undefined) user.extraMockExamTokens = 0;

      // Ensure valid username
      if (!user.username || !ALPHANUMERIC_REGEX.test(user.username)) {
        user.username = generateUniqueUsername(user.name || user.email || 'candidato');
      }

      return user;
    }
  } catch (e) {
    console.error('Error reading profile:', e);
  }
  const defaultUser = getDefaultUser();
  saveUserProfile(defaultUser);
  return defaultUser;
}

export function saveUserProfile(user: UserProfile) {
  try {
    const lvlInfo = calculateLevelInfo(user.xpTotal);
    user.level = lvlInfo.level;
    user.levelTitle = lvlInfo.title;
    localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
  } catch (e) {
    console.error('Error saving user profile to local storage:', e);
  }
}

export function getMockExamHistory(): MockExamResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_EXAMS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading mock exams:', e);
  }
  return [];
}

export function saveMockExamResult(result: MockExamResult) {
  const history = getMockExamHistory();
  history.unshift(result);
  localStorage.setItem(STORAGE_KEY_EXAMS, JSON.stringify(history));

  // Save to Firestore mock_exams collection
  if (result.userId && result.userId !== 'usr_default') {
    saveMockExamResultToFirestore(result);
  }
}

import { getStoredColleagues, calculateFollowersCount } from './socialStorage';
import { getLeagueFromXp } from './leagueUtils';

// Dynamic leaderboard standings using stored colleagues
export function getLeaderboard(
  currentUser: UserProfile, 
  filterMode: 'global' | 'following' = 'global'
): LeaderboardUser[] {
  const colleagues = getStoredColleagues();
  const followingIds = currentUser.followingIds || [];
  const currentUserId = currentUser.id || currentUser.uid || 'usr_default';

  const userLeagueObj = getLeagueFromXp(currentUser.xpTotal);
  const userLeagueName = userLeagueObj.currentTier.name;

  const currentUserItem: LeaderboardUser = {
    id: currentUserId,
    name: `${currentUser.name} (Você)`,
    username: currentUser.username || 'candidato123',
    email: currentUser.email,
    avatarUrl: currentUser.avatarUrl,
    weeklyXp: Math.max(120, currentUser.xpTotal),
    xpTotal: currentUser.xpTotal,
    rank: 1,
    isCurrentUser: true,
    league: userLeagueName,
    badgeCount: currentUser.unlockedBadgeIds?.length || 2,
    company: currentUser.company || 'QA Professional',
    bio: currentUser.bio || 'Preparando para o exame oficial ISTQB CTFL v4.0!',
    completedChapterCount: currentUser.completedChapterIds?.length || 0,
    followersCount: calculateFollowersCount(currentUserId),
    followingIds: currentUser.followingIds || [],
  };

  let list: LeaderboardUser[] = [currentUserItem];
  const seenIds = new Set<string>([currentUserId]);
  const userEmailLower = currentUser.email?.trim().toLowerCase();

  colleagues.forEach(c => {
    if (!c || !c.id) return;
    const cEmailLower = c.email?.trim().toLowerCase();

    if (!seenIds.has(c.id) && (!userEmailLower || !cEmailLower || cEmailLower !== userEmailLower)) {
      seenIds.add(c.id);
      const colleagueLeagueName = getLeagueFromXp(c.xpTotal || c.weeklyXp || 0).currentTier.name;
      list.push({
        ...c,
        league: colleagueLeagueName,
        isFollowing: followingIds.includes(c.id),
        followersCount: calculateFollowersCount(c.id, c.followersCount || 0),
      });
    }
  });

  if (filterMode === 'following') {
    list = list.filter(u => u.isCurrentUser || followingIds.includes(u.id));
  }

  // Sort by total/weekly XP descending
  list.sort((a, b) => (b.xpTotal || b.weeklyXp || 0) - (a.xpTotal || a.weeklyXp || 0));
  list.forEach((u, i) => { u.rank = i + 1; });

  return list;
}
