import { 
  UserProfile, LeaderboardUser, NotificationItem, ChallengeItem, Clan, ClanMember, ClanChallenge, ClanJoinRequest 
} from '../types';
import { saveUserProfile } from './storage';
import { 
  updateUserFollowersInFirestore, 
  sendNotificationToFirestore, 
  saveChallengeToFirestore, 
  createClanInFirestore, 
  updateClanInFirestore 
} from './firestoreService';
import { PRESET_AVATARS } from './avatarUtils';

export { PRESET_AVATARS };

const STORAGE_KEY_COLLEAGUES = 'istqb_trail_colleagues_v2';
const STORAGE_KEY_NOTIFS = 'istqb_trail_notifications_v2';
const STORAGE_KEY_CHALLENGES = 'istqb_trail_challenges_v2';
const STORAGE_KEY_CLANS = 'istqb_trail_clans_v2';

export const INITIAL_COLLEAGUES: LeaderboardUser[] = [
  {
    id: 'usr_ana_silva',
    name: 'Ana Silva',
    username: 'anasilva_qa',
    email: 'ana.silva@techqa.io',
    avatarUrl: PRESET_AVATARS[0].url,
    weeklyXp: 1850,
    xpTotal: 32500, // Ouro 3
    rank: 1,
    league: 'Ouro 3',
    badgeCount: 6,
    company: 'TechQA Solutions',
    bio: 'Líder de QA focada em certificação ISTQB CTFL v4.0 e automação de testes.',
    completedChapterCount: 5,
    followersCount: 12,
    followingIds: ['usr_default', 'usr_carlos_qa'],
  },
  {
    id: 'usr_carlos_qa',
    name: 'Carlos Eduardo',
    username: 'carloseduardo_test',
    email: 'carlos.eduardo@fintechlab.com',
    avatarUrl: PRESET_AVATARS[1].url,
    weeklyXp: 1420,
    xpTotal: 15400, // Prata 2
    rank: 2,
    league: 'Prata 2',
    badgeCount: 4,
    company: 'Fintech Quality Lab',
    bio: 'Engenheiro de Qualidade preparando para o exame ISTQB.',
    completedChapterCount: 4,
    followersCount: 8,
    followingIds: ['usr_ana_silva'],
  },
  {
    id: 'usr_mariana_tech',
    name: 'Mariana Costa',
    username: 'marianacosta_qa',
    email: 'mariana.costa@sublimetech.com',
    avatarUrl: PRESET_AVATARS[2].url,
    weeklyXp: 1100,
    xpTotal: 8200, // Prata 3
    rank: 3,
    league: 'Prata 3',
    badgeCount: 3,
    company: 'SublimeTech QA',
    bio: 'Agile QA Master & entusiasta de testes de regressão.',
    completedChapterCount: 3,
    followersCount: 5,
    followingIds: [],
  },
  {
    id: 'usr_lucas_ctfl',
    name: 'Lucas Santos',
    username: 'lucassantos_dev',
    email: 'lucas.santos@bankcode.com',
    avatarUrl: PRESET_AVATARS[3].url,
    weeklyXp: 890,
    xpTotal: 3400, // Bronze 1
    rank: 4,
    league: 'Bronze 1',
    badgeCount: 2,
    company: 'BankCode Devs',
    bio: 'Desenvolvedor expandindo conhecimentos em Engenharia de Software e ISTQB.',
    completedChapterCount: 2,
    followersCount: 3,
    followingIds: ['usr_default'],
  },
  {
    id: 'usr_beatriz_qa',
    name: 'Beatriz Lima',
    username: 'beatrizlima_qa',
    email: 'beatriz.lima@cloudqa.global',
    avatarUrl: PRESET_AVATARS[4].url,
    weeklyXp: 650,
    xpTotal: 1200, // Bronze 2
    rank: 5,
    league: 'Bronze 2',
    badgeCount: 1,
    company: 'Cloud QA Global',
    bio: 'Analista de testes em transição de carreira focada no CTFL.',
    completedChapterCount: 1,
    followersCount: 2,
    followingIds: [],
  },
  {
    id: 'usr_rafael_agile',
    name: 'Rafael Oliveira',
    username: 'rafaeloliveira_qa',
    email: 'rafael.oliveira@devops.com',
    avatarUrl: PRESET_AVATARS[5].url,
    weeklyXp: 510,
    xpTotal: 450, // Bronze 3
    rank: 6,
    league: 'Bronze 3',
    badgeCount: 1,
    company: 'DevOps & Testes',
    bio: 'Estudando diariamente para tirar a certificação ISTQB neste semestre.',
    completedChapterCount: 1,
    followersCount: 1,
    followingIds: [],
  },
];

export function deduplicateColleagues(colleagues: LeaderboardUser[]): LeaderboardUser[] {
  const seenIds = new Set<string>();
  const seenEmails = new Set<string>();
  const result: LeaderboardUser[] = [];

  for (const c of colleagues) {
    if (!c || !c.id) continue;
    const emailLower = c.email?.trim().toLowerCase();

    if (seenIds.has(c.id)) continue;
    if (emailLower && seenEmails.has(emailLower)) continue;

    seenIds.add(c.id);
    if (emailLower) seenEmails.add(emailLower);
    result.push(c);
  }

  return result;
}

export function calculateFollowersCount(targetUserId: string, fallbackCount: number = 0): number {
  if (!targetUserId) return fallbackCount;
  const rawColleagues = localStorage.getItem(STORAGE_KEY_COLLEAGUES);
  let colleagues: LeaderboardUser[] = [];
  try {
    if (rawColleagues) colleagues = JSON.parse(rawColleagues);
  } catch (e) {
    colleagues = [];
  }
  const cleanTarget = targetUserId.trim().toLowerCase();
  let count = 0;

  colleagues.forEach(c => {
    if (!c || !c.id) return;
    const isTarget = c.id.trim().toLowerCase() === cleanTarget || (c.username && c.username.trim().toLowerCase() === cleanTarget);
    if (!isTarget) {
      const following = (c.followingIds || []).map(f => f.trim().toLowerCase());
      if (following.includes(cleanTarget) || (c.username && following.includes(c.username.trim().toLowerCase()))) {
        count++;
      }
    }
  });

  return Math.max(count, fallbackCount);
}

export function syncFirestoreUsersToColleagues(firestoreUsers: LeaderboardUser[]) {
  if (!firestoreUsers || firestoreUsers.length === 0) return;
  const stored = getStoredColleagues();
  const storedMap = new Map<string, LeaderboardUser>();

  stored.forEach(u => {
    if (u && u.id) storedMap.set(u.id, u);
  });

  firestoreUsers.forEach(fu => {
    if (!fu || !fu.id) return;
    const existing = storedMap.get(fu.id);
    if (existing) {
      storedMap.set(fu.id, {
        ...existing,
        ...fu,
        followersCount: Math.max(existing.followersCount || 0, fu.followersCount || 0, calculateFollowersCount(fu.id)),
        followingIds: fu.followingIds || existing.followingIds || [],
      });
    } else {
      storedMap.set(fu.id, {
        ...fu,
        followersCount: Math.max(fu.followersCount || 0, calculateFollowersCount(fu.id)),
      });
    }
  });

  const mergedList = Array.from(storedMap.values());
  saveStoredColleagues(mergedList);
}

export function syncUserWithColleagues(user: UserProfile) {
  if (!user || (!user.id && !user.uid)) return;
  const targetId = user.id || user.uid || 'usr_default';
  const targetEmail = user.email?.trim().toLowerCase();

  const colleagues = getStoredColleagues();

  const filteredColleagues = colleagues.filter(c => {
    if (c.id === targetId || (user.uid && c.id === user.uid)) return false;
    if (targetEmail && c.email && c.email.trim().toLowerCase() === targetEmail) return false;
    return true;
  });

  const userColleagueItem: LeaderboardUser = {
    id: targetId,
    name: user.name || 'Candidato ISTQB',
    username: user.username,
    email: user.email,
    avatarUrl: user.avatarUrl,
    weeklyXp: user.xpTotal || 0,
    xpTotal: user.xpTotal || 0,
    rank: 1,
    league: user.league || 'Prata',
    badgeCount: user.unlockedBadgeIds?.length || 0,
    company: user.company,
    bio: user.bio,
    completedChapterCount: user.completedChapterIds?.length || 0,
    followingIds: user.followingIds || [],
    followersCount: calculateFollowersCount(targetId, user.followersCount || 0),
  };

  const updatedList = [userColleagueItem, ...filteredColleagues];
  saveStoredColleagues(updatedList);
}

export function getStoredColleagues(): LeaderboardUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COLLEAGUES);
    if (raw) {
      const parsed: LeaderboardUser[] = JSON.parse(raw);
      // Remove legacy mock users and deduplicate
      const clean = deduplicateColleagues(parsed.filter(u => u && u.id && !u.id.startsWith('col_')));
      if (clean.length > 0) {
        if (clean.length !== parsed.length) {
          localStorage.setItem(STORAGE_KEY_COLLEAGUES, JSON.stringify(clean));
        }
        return clean;
      }
    }
  } catch (e) {
    console.error('Error loading colleagues:', e);
  }
  const defaultList = deduplicateColleagues(INITIAL_COLLEAGUES);
  localStorage.setItem(STORAGE_KEY_COLLEAGUES, JSON.stringify(defaultList));
  return defaultList;
}

export function saveStoredColleagues(colleagues: LeaderboardUser[]) {
  try {
    const uniqueList = deduplicateColleagues(colleagues);
    localStorage.setItem(STORAGE_KEY_COLLEAGUES, JSON.stringify(uniqueList));
  } catch (e) {
    console.error('Error saving colleagues:', e);
  }
}

// Search colleagues by username, name, email, or company
export function searchColleagues(query: string, currentUserId: string, followingIds: string[] = []): LeaderboardUser[] {
  const all = deduplicateColleagues(getStoredColleagues());
  const rawQ = query.trim().toLowerCase();
  const q = rawQ.startsWith('@') ? rawQ.slice(1) : rawQ;

  const results = all
    .filter(u => u.id !== currentUserId)
    .filter(u => {
      if (!q) return true;
      return (
        (u.username && u.username.toLowerCase().includes(q)) ||
        u.name.toLowerCase().includes(q) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.company && u.company.toLowerCase().includes(q)) ||
        (u.bio && u.bio.toLowerCase().includes(q))
      );
    })
    .map(u => ({
      ...u,
      isFollowing: followingIds.includes(u.id),
      followersCount: calculateFollowersCount(u.id, u.followersCount || 0),
    }));

  return deduplicateColleagues(results);
}

// Toggle follow/unfollow colleague
export function toggleFollowColleague(
  currentUser: UserProfile, 
  targetUserId: string,
  targetUserObj?: LeaderboardUser
): UserProfile {
  const currentFollowing = currentUser.followingIds || [];
  const isCurrentlyFollowing = currentFollowing.includes(targetUserId);

  let newFollowing: string[];
  if (isCurrentlyFollowing) {
    newFollowing = currentFollowing.filter(id => id !== targetUserId);
  } else {
    newFollowing = [...currentFollowing, targetUserId];
  }

  const updatedUser: UserProfile = {
    ...currentUser,
    followingIds: newFollowing,
  };

  // 1. Sync updated current user into stored colleagues FIRST so calculateFollowersCount sees the new state
  syncUserWithColleagues(updatedUser);

  // 2. Recalculate followers for target user
  const newTargetFollowersCount = calculateFollowersCount(targetUserId);

  // 3. Update or add target colleague in local storage
  const colleagues = getStoredColleagues();
  let foundTarget = false;
  let updatedColleagues = colleagues.map(c => {
    if (c.id === targetUserId || (c.username && targetUserObj?.username && c.username === targetUserObj.username)) {
      foundTarget = true;
      return {
        ...c,
        followersCount: newTargetFollowersCount,
      };
    }
    return c;
  });

  if (!foundTarget && targetUserObj) {
    updatedColleagues.push({
      ...targetUserObj,
      followersCount: newTargetFollowersCount,
    });
  }

  saveStoredColleagues(updatedColleagues);

  // 4. Update Firestore for target user
  updateUserFollowersInFirestore(targetUserId, newTargetFollowersCount);

  // 5. Recalculate followers for current user
  updatedUser.followersCount = calculateFollowersCount(updatedUser.id);
  saveUserProfile(updatedUser);

  // 6. If newly following, create a social notification FOR THE TARGET USER
  if (!isCurrentlyFollowing) {
    addNotification({
      userId: targetUserId,
      userName: currentUser.name,
      userAvatar: currentUser.avatarUrl,
      type: 'badge_earned',
      title: currentUser.language === 'en' ? 'New Follower!' : 'Novo Seguidor!',
      message: currentUser.language === 'en'
        ? `${currentUser.name} (@${currentUser.username || 'candidato'}) started following you!`
        : `${currentUser.name} (@${currentUser.username || 'candidato'}) começou a te seguir!`,
    });
  }

  return updatedUser;
}

// --- Notifications System ---
export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export function getNotifications(currentUserId?: string): NotificationItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTIFS);
    if (raw) {
      const all: NotificationItem[] = JSON.parse(raw);
      // Filter out legacy mock notifications
      const clean = all.filter(n => !n.id.startsWith('notif_1') && !n.id.startsWith('notif_2') && !n.id.startsWith('notif_3') && !n.id.startsWith('notif_4') && (!n.userId || !n.userId.startsWith('col_')));
      if (clean.length !== all.length) {
        localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(clean));
      }
      if (currentUserId) {
        return clean.filter(n => !n.userId || n.userId === currentUserId || n.userId === 'usr_default');
      }
      return clean;
    }
  } catch (e) {
    console.error('Error loading notifications:', e);
  }
  localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify([]));
  return [];
}

export function saveNotifications(notifs: NotificationItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(notifs));
  } catch (e) {
    console.error('Error saving notifications:', e);
  }
}

export function addNotification(notifData: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) {
  const notifs = getNotifications();
  const newNotif: NotificationItem = {
    ...notifData,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    timestamp: 'Agora',
    isRead: false,
  };
  notifs.unshift(newNotif);
  saveNotifications(notifs);

  // Sync to Firestore
  if (newNotif.userId && newNotif.userId !== 'usr_default') {
    sendNotificationToFirestore(newNotif);
  }
}

export function markNotificationsAsRead() {
  const notifs = getNotifications().map(n => ({ ...n, isRead: true }));
  saveNotifications(notifs);
}

// --- 1v1 Challenges System ---
export const INITIAL_CHALLENGES: ChallengeItem[] = [];

export function getChallenges(): ChallengeItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CHALLENGES);
    if (raw) {
      const parsed: ChallengeItem[] = JSON.parse(raw);
      const clean = parsed.filter(c => !c.id.startsWith('chal_1') && !c.challengerId.startsWith('col_'));
      if (clean.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(clean));
      }
      return clean;
    }
  } catch (e) {
    console.error('Error loading challenges:', e);
  }
  localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify([]));
  return [];
}

export function saveChallenges(chals: ChallengeItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY_CHALLENGES, JSON.stringify(chals));
    // Sync latest challenges to Firestore
    chals.slice(0, 5).forEach(c => {
      if (c && c.id) {
        saveChallengeToFirestore(c);
      }
    });
  } catch (e) {
    console.error('Error saving challenges:', e);
  }
}

// --- Clans / Squads System ---
export const INITIAL_CLANS: Clan[] = [];

export function getClans(): Clan[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CLANS);
    if (raw) {
      const parsed: Clan[] = JSON.parse(raw);
      // Filter out legacy mock clans
      const clean = parsed.filter(c => !c.id.startsWith('clan_1') && !c.id.startsWith('clan_2') && !c.id.startsWith('clan_3'));
      if (clean.length !== parsed.length) {
        localStorage.setItem(STORAGE_KEY_CLANS, JSON.stringify(clean));
      }
      return clean;
    }
  } catch (e) {
    console.error('Error loading clans:', e);
  }
  localStorage.setItem(STORAGE_KEY_CLANS, JSON.stringify([]));
  return [];
}

export function saveClans(clans: Clan[]) {
  try {
    localStorage.setItem(STORAGE_KEY_CLANS, JSON.stringify(clans));
    // Sync to Firestore
    clans.forEach(c => {
      if (c && c.id) {
        createClanInFirestore(c);
      }
    });
  } catch (e) {
    console.error('Error saving clans:', e);
  }
}

/**
 * Checks if a clan name already exists (case-insensitive).
 */
export function checkClanNameExists(name: string, excludeClanId?: string): boolean {
  if (!name) return false;
  const clean = name.trim().toLowerCase();
  const clans = getClans();
  return clans.some(c => c.id !== excludeClanId && c.name.trim().toLowerCase() === clean);
}

/**
 * Searches clans by name or tag.
 */
export function searchClans(query: string): Clan[] {
  const clans = getClans();
  const q = query.trim().toLowerCase();
  if (!q) return clans;

  return clans.filter(c => 
    c.name.toLowerCase().includes(q) ||
    c.tag.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q)
  );
}

/**
 * Returns popular clans ordered by total XP or members count.
 */
export function getPopularClans(): Clan[] {
  const clans = getClans();
  return [...clans].sort((a, b) => b.totalXp - a.totalXp).slice(0, 5);
}

/**
 * Creates a new clan with unique name validation.
 */
export function createClan(
  user: UserProfile, 
  clanData: { name: string; tag: string; description: string; avatarUrl?: string; joinType?: 'open' | 'approval' }
): { success: boolean; clan?: Clan; error?: string } {
  if (checkClanNameExists(clanData.name)) {
    return {
      success: false,
      error: user.language === 'en' ? 'A clan with this name already exists.' : 'Já existe um clã com este nome. Escolha outro nome.',
    };
  }

  const newClan: Clan = {
    id: `clan_${Date.now()}`,
    name: clanData.name.trim(),
    tag: clanData.tag.trim().toUpperCase().slice(0, 5),
    description: clanData.description.trim() || 'Clã focado em aprovação no ISTQB CTFL.',
    avatarUrl: clanData.avatarUrl || PRESET_AVATARS[0].url,
    leaderId: user.id,
    leaderName: user.name,
    leaderUsername: user.username,
    totalXp: user.xpTotal || 0,
    level: 1,
    joinType: clanData.joinType || 'open',
    members: [
      {
        id: user.id,
        name: user.name,
        username: user.username,
        avatarUrl: user.avatarUrl,
        company: user.company || 'QA Professional',
        role: 'leader',
        xp: user.xpTotal || 0,
        level: user.level || 1,
        joinedAt: new Date().toISOString(),
      },
    ],
  };

  const clans = getClans();
  const updatedClans = [newClan, ...clans];
  saveClans(updatedClans);

  const updatedUser: UserProfile = { ...user, clanId: newClan.id };
  saveUserProfile(updatedUser);

  return { success: true, clan: newClan };
}

/**
 * Joins an open clan or requests to join an approval clan.
 */
export function joinOrRequestClan(user: UserProfile, clanId: string): { success: boolean; isPending?: boolean; message?: string } {
  const clans = getClans();
  const clan = clans.find(c => c.id === clanId);

  if (!clan) {
    return { success: false, message: 'Clã não encontrado.' };
  }

  if (clan.members.some(m => m.id === user.id)) {
    return { success: false, message: 'Você já faz parte deste clã.' };
  }

  if (clan.members.length >= 10) {
    return { success: false, message: 'Este clã atingiu o limite máximo de 10 membros.' };
  }

  // Approval required mode
  if (clan.joinType === 'approval') {
    const existingReqs = clan.pendingRequests || [];
    if (existingReqs.some(r => r.userId === user.id)) {
      return { success: false, message: 'Você já possui uma solicitação pendente para este clã.' };
    }

    const newReq: ClanJoinRequest = {
      id: `req_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userUsername: user.username,
      userAvatar: user.avatarUrl,
      userXp: user.xpTotal || 0,
      requestedAt: 'Agora',
    };

    const updatedClans = clans.map(c => {
      if (c.id === clanId) {
        return {
          ...c,
          pendingRequests: [...(c.pendingRequests || []), newReq],
        };
      }
      return c;
    });

    saveClans(updatedClans);

    // Notify clan leader
    addNotification({
      userId: clan.leaderId,
      userName: user.name,
      userAvatar: user.avatarUrl,
      type: 'clan_invite',
      title: 'Nova Solicitação de Clã!',
      message: `${user.name} (@${user.username || 'user'}) pediu para entrar no seu clã [${clan.tag}].`,
    });

    return { 
      success: true, 
      isPending: true, 
      message: user.language === 'en' ? 'Join request sent to clan leader!' : 'Solicitação enviada ao líder do clã!' 
    };
  }

  // Open mode -> Immediate join
  const newMember: ClanMember = {
    id: user.id,
    name: user.name,
    username: user.username,
    avatarUrl: user.avatarUrl,
    company: user.company,
    role: 'member',
    xp: user.xpTotal || 0,
    level: user.level || 1,
    joinedAt: new Date().toISOString(),
  };

  const updatedClans = clans.map(c => {
    if (c.id === clanId) {
      return {
        ...c,
        members: [...c.members, newMember],
        totalXp: c.totalXp + (user.xpTotal || 0),
      };
    }
    return c;
  });

  saveClans(updatedClans);

  const updatedUser: UserProfile = { ...user, clanId };
  saveUserProfile(updatedUser);

  return { 
    success: true, 
    isPending: false, 
    message: user.language === 'en' ? 'Welcome to the clan!' : 'Bem-vindo ao Clã!' 
  };
}

/**
 * Leader accepts a join request.
 */
export function acceptClanRequest(leaderUser: UserProfile, clanId: string, requestId: string): { success: boolean; clans: Clan[] } {
  const clans = getClans();
  let acceptedUserReq: ClanJoinRequest | undefined = undefined;

  const updatedClans = clans.map(c => {
    if (c.id === clanId && c.leaderId === leaderUser.id) {
      const reqs = c.pendingRequests || [];
      acceptedUserReq = reqs.find(r => r.id === requestId);
      if (!acceptedUserReq) return c;

      const newMember: ClanMember = {
        id: acceptedUserReq.userId,
        name: acceptedUserReq.userName,
        username: acceptedUserReq.userUsername,
        avatarUrl: acceptedUserReq.userAvatar,
        role: 'member',
        xp: acceptedUserReq.userXp,
        level: 1,
        joinedAt: new Date().toISOString(),
      };

      return {
        ...c,
        members: [...c.members, newMember],
        totalXp: c.totalXp + acceptedUserReq.userXp,
        pendingRequests: reqs.filter(r => r.id !== requestId),
      };
    }
    return c;
  });

  saveClans(updatedClans);

  if (acceptedUserReq) {
    addNotification({
      userId: acceptedUserReq.userId,
      userName: leaderUser.name,
      userAvatar: leaderUser.avatarUrl,
      type: 'clan_invite',
      title: 'Solicitação de Clã Aprovada!',
      message: `Sua solicitação para entrar no clã foi APROVADA pelo líder!`,
    });
  }

  return { success: true, clans: updatedClans };
}

/**
 * Leader rejects a join request.
 */
export function rejectClanRequest(leaderUser: UserProfile, clanId: string, requestId: string): { success: boolean; clans: Clan[] } {
  const clans = getClans();
  const updatedClans = clans.map(c => {
    if (c.id === clanId && c.leaderId === leaderUser.id) {
      return {
        ...c,
        pendingRequests: (c.pendingRequests || []).filter(r => r.id !== requestId),
      };
    }
    return c;
  });

  saveClans(updatedClans);
  return { success: true, clans: updatedClans };
}

/**
 * Leader removes/kicks a member from the clan.
 */
export function kickClanMember(leaderUser: UserProfile, clanId: string, memberId: string): { success: boolean; clans: Clan[] } {
  const clans = getClans();
  const targetClan = clans.find(c => c.id === clanId && c.leaderId === leaderUser.id);
  if (!targetClan || memberId === leaderUser.id) return { success: false, clans };

  const memberToKick = targetClan.members.find(m => m.id === memberId);
  const updatedClans = clans.map(c => {
    if (c.id === clanId) {
      const remaining = c.members.filter(m => m.id !== memberId);
      return {
        ...c,
        members: remaining,
        totalXp: Math.max(0, c.totalXp - (memberToKick?.xp || 0)),
      };
    }
    return c;
  });

  saveClans(updatedClans);

  if (memberToKick) {
    addNotification({
      userId: memberId,
      userName: leaderUser.name,
      userAvatar: leaderUser.avatarUrl,
      type: 'clan_invite',
      title: 'Removido do Clã',
      message: `Você foi removido do clã [${targetClan.tag}] pelo líder.`,
    });
  }

  return { success: true, clans: updatedClans };
}

/**
 * Leaves clan. If leader leaves, leadership transfers to the next member in sequence.
 * If no members remain, the clan is deleted completely from the database/storage.
 */
export function leaveClan(user: UserProfile, clanId: string): { 
  updatedClans: Clan[]; 
  updatedUser: UserProfile; 
  promotedLeaderName?: string; 
  isClanDeleted?: boolean 
} {
  const clans = getClans();
  const targetClan = clans.find(c => c.id === clanId);
  if (!targetClan) return { updatedClans: clans, updatedUser: { ...user, clanId: undefined } };

  const remainingMembers = targetClan.members.filter(m => m.id !== user.id);
  let updatedClans: Clan[];
  let promotedLeaderName: string | undefined = undefined;
  let isClanDeleted = false;

  if (remainingMembers.length === 0) {
    // No members remaining -> Clean/delete the clan completely from DB/storage
    updatedClans = clans.filter(c => c.id !== clanId);
    isClanDeleted = true;
  } else {
    // Transfer leadership to the next member who joined after the leader
    let newLeaderId = targetClan.leaderId;
    let newLeaderName = targetClan.leaderName;
    let newLeaderUsername = targetClan.leaderUsername;

    if (targetClan.leaderId === user.id) {
      const nextLeader = remainingMembers[0];
      nextLeader.role = 'leader';
      newLeaderId = nextLeader.id;
      newLeaderName = nextLeader.name;
      newLeaderUsername = nextLeader.username;
      promotedLeaderName = nextLeader.name;

      addNotification({
        userId: nextLeader.id,
        userName: nextLeader.name,
        userAvatar: nextLeader.avatarUrl,
        type: 'clan_invite',
        title: 'Nova Liderança de Clã!',
        message: `O líder do Clã [${targetClan.tag}] saiu. Você foi promovido a novo Líder do Clã!`,
      });
    }

    updatedClans = clans.map(c => {
      if (c.id === clanId) {
        return {
          ...c,
          leaderId: newLeaderId,
          leaderName: newLeaderName,
          leaderUsername: newLeaderUsername,
          members: remainingMembers,
          totalXp: Math.max(0, c.totalXp - (user.xpTotal || 0)),
        };
      }
      return c;
    });
  }

  saveClans(updatedClans);
  const updatedUser: UserProfile = { ...user, clanId: undefined };
  saveUserProfile(updatedUser);

  return { updatedClans, updatedUser, promotedLeaderName, isClanDeleted };
}

/**
 * Leader edits clan details with unique name check.
 */
export function editClanDetails(
  leaderUser: UserProfile, 
  clanId: string, 
  updates: { name: string; tag: string; description: string; avatarUrl?: string; joinType?: 'open' | 'approval' }
): { success: boolean; clans: Clan[]; error?: string } {
  const clans = getClans();
  const targetClan = clans.find(c => c.id === clanId && c.leaderId === leaderUser.id);
  
  if (!targetClan) {
    return { success: false, clans, error: 'Apenas o líder pode editar este clã.' };
  }

  if (checkClanNameExists(updates.name, clanId)) {
    return {
      success: false,
      clans,
      error: leaderUser.language === 'en' ? 'A clan with this name already exists.' : 'Já existe outro clã com este nome. Escolha um nome diferente.',
    };
  }

  const updatedClans = clans.map(c => {
    if (c.id === clanId) {
      return {
        ...c,
        name: updates.name.trim(),
        tag: updates.tag.trim().toUpperCase().slice(0, 5),
        description: updates.description.trim(),
        avatarUrl: updates.avatarUrl || c.avatarUrl,
        joinType: updates.joinType || c.joinType || 'open',
      };
    }
    return c;
  });

  saveClans(updatedClans);
  return { success: true, clans: updatedClans };
}

