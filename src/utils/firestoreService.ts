import { supabase } from '../lib/supabase';
import { 
  UserProfile, 
  LeaderboardUser, 
  MockExamResult, 
  Clan, 
  ClanMember, 
  ChallengeItem, 
  NotificationItem
} from '../types';

export const USERS_COLLECTION = 'users';

// Helper to convert UserProfile to DB format
function toDbUser(user: UserProfile) {
  return {
    id: user.uid || user.id,
    name: user.name || 'Candidato ISTQB',
    username: (user.username || 'candidato').toLowerCase().trim(),
    email: user.email || '',
    avatar_url: user.avatarUrl || '',
    company: user.company || '',
    bio: user.bio || '',
    country: user.country || 'BR',
    language: user.language || 'pt',
    plan: user.plan || 'free',
    xp_total: Math.max(0, user.xpTotal || 0),
    level: Math.max(1, user.level || 1),
    streak_days: Math.max(0, user.streakDays || 0),
    coins: Math.max(0, user.coins !== undefined ? user.coins : 150),
    extra_mock_exam_tokens: Math.max(0, user.extraMockExamTokens || 0),
    lives_current: Math.min(10, Math.max(0, user.livesCurrent !== undefined ? user.livesCurrent : 5)),
    lives_max: Math.max(5, user.livesMax || 5),
    clan_id: user.clanId || '',
    followers_count: user.followersCount || 0,
    following_ids: user.followingIds || [],
    updated_at: new Date().toISOString()
  };
}

function toDbAdvances(user: UserProfile) {
  return {
    user_id: user.uid || user.id,
    completed_lesson_ids: user.completedLessonIds || [],
    completed_chapter_ids: user.completedChapterIds || [],
    unlocked_badge_ids: user.unlockedBadgeIds || [],
    updated_at: new Date().toISOString()
  };
}

// Convert DB format to UserProfile
function fromDbUser(dbUser: any, dbAdvances: any): UserProfile {
  return {
    uid: dbUser.id,
    id: dbUser.id,
    name: dbUser.name,
    username: dbUser.username,
    email: dbUser.email,
    avatarUrl: dbUser.avatar_url,
    company: dbUser.company,
    bio: dbUser.bio,
    country: dbUser.country,
    language: dbUser.language || 'pt',
    plan: dbUser.plan,
    xpTotal: dbUser.xp_total,
    level: dbUser.level,
    streakDays: dbUser.streak_days,
    coins: dbUser.coins,
    extraMockExamTokens: dbUser.extra_mock_exam_tokens,
    livesCurrent: dbUser.lives_current,
    livesMax: dbUser.lives_max,
    clanId: dbUser.clan_id,
    followersCount: dbUser.followers_count,
    followingIds: dbUser.following_ids,
    completedLessonIds: dbAdvances?.completed_lesson_ids || [],
    completedChapterIds: dbAdvances?.completed_chapter_ids || [],
    unlockedBadgeIds: dbAdvances?.unlocked_badge_ids || [],
    mockExamsUsedThisMonth: 0
  } as UserProfile;
}

export async function saveUserProfileToFirestore(user: UserProfile): Promise<void> {
  const uid = user.uid || user.id;
  if (!uid || uid === 'usr_default') return;

  try {
    const { error: err1 } = await supabase.from('users').upsert(toDbUser(user));
    if (err1) console.error('Error saving user to Supabase:', err1);

    const { error: err2 } = await supabase.from('user_advances').upsert(toDbAdvances(user));
    if (err2) console.error('Error saving advances to Supabase:', err2);
  } catch (error) {
    console.error('Error saving user profile to Supabase:', error);
  }
}

export async function saveUserProgressToFirestore(uid: string, data: any): Promise<void> {}

export async function loadUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  if (!uid || uid === 'usr_default') return null;
  
  try {
    const { data: dbUser, error: err1 } = await supabase.from('users').select('*').eq('id', uid).single();
    if (err1 || !dbUser) return null;

    const { data: dbAdvances } = await supabase.from('user_advances').select('*').eq('user_id', uid).single();

    return fromDbUser(dbUser, dbAdvances);
  } catch (error) {
    console.error('Error loading user profile from Supabase:', error);
    return null;
  }
}

export function subscribeToUserProfile(uid: string, onUpdate: (user: UserProfile) => void): () => void {
  if (!uid || uid === 'usr_default') return () => {};

  const channel = supabase.channel(`user_${uid}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users', filter: `id=eq.${uid}` }, async (payload) => {
      const user = await loadUserProfileFromFirestore(uid);
      if (user) onUpdate(user);
    })
    .on('postgres_changes', { event: '*', schema: 'public', table: 'user_advances', filter: `user_id=eq.${uid}` }, async (payload) => {
      const user = await loadUserProfileFromFirestore(uid);
      if (user) onUpdate(user);
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

export async function checkUsernameTakenInFirestore(username: string): Promise<boolean> {
  try {
    const { data, error } = await supabase.from('users').select('id').eq('username', username.toLowerCase()).single();
    if (error && error.code !== 'PGRST116') return false; 
    return !!data;
  } catch (err) {
    return false;
  }
}

export async function fetchAllUsersFromFirestore(): Promise<LeaderboardUser[]> {
  try {
    const { data: users, error } = await supabase.from('users').select('id, name, username, avatar_url, xp_total, level, company, followers_count');
    if (error) throw error;
    
    return users.map(u => ({
      weeklyXp: u.xp_total || 0,
      rank: 0,
      league: 'Bronze',
      badgeCount: 0,
      id: u.id,
      name: u.name,
      username: u.username,
      avatarUrl: u.avatar_url,
      xpTotal: u.xp_total,
      level: u.level,
      company: u.company,
      followersCount: u.followers_count
    }));
  } catch (err) {
    console.warn('Error fetching all users from Supabase:', err);
    return [];
  }
}

export function subscribeToAllUsers(onUpdate: (users: LeaderboardUser[]) => void): () => void {
  const fetchAndEmit = async () => {
    const users = await fetchAllUsersFromFirestore();
    users.sort((a, b) => (b.xpTotal || 0) - (a.xpTotal || 0));
    onUpdate(users);
  };
  
  fetchAndEmit();
  
  const channel = supabase.channel('users_all')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
      fetchAndEmit();
    })
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
}

export async function searchFirestoreUsers(queryStr: string): Promise<LeaderboardUser[]> {
  const allUsers = await fetchAllUsersFromFirestore();
  const q = queryStr.toLowerCase().trim();
  return allUsers.filter(u => 
    u.name?.toLowerCase().includes(q) || 
    u.username?.toLowerCase().includes(q) || 
    u.company?.toLowerCase().includes(q)
  );
}

// MOCK EXAMS
export async function saveMockExamResultToFirestore(result: MockExamResult): Promise<void> {
  try {
    const dbExam = {
      id: result.id,
      user_id: result.userId,
      date: result.date || new Date().toISOString(),
      score: result.score,
      total_questions: 40,
      passed: result.passed,
      time_spent_seconds: result.timeSpentSeconds
    };
    await supabase.from('mock_exams').insert(dbExam);
  } catch (err) {
    console.error('Error saving exam to Supabase:', err);
  }
}

export function subscribeToMockExams(userId: string, onUpdate: (exams: MockExamResult[]) => void): () => void {
  if (!userId || userId === 'usr_default') return () => {};

  const fetchAndEmit = async () => {
    const { data, error } = await supabase.from('mock_exams').select('*').eq('user_id', userId).order('date', { ascending: false }).limit(50);
    if (!error && data) {
      onUpdate(data.map(d => ({
        id: d.id,
        userId: d.user_id,
        date: d.date,
        score: d.score,
        totalQuestions: d.total_questions,
        passed: d.passed,
        timeSpentSeconds: d.time_spent_seconds,
        percentage: Math.round((d.score / (d.total_questions || 40)) * 100),
        answers: []
      })));
    }
  };
  fetchAndEmit();

  const channel = supabase.channel(`exams_${userId}`)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'mock_exams', filter: `user_id=eq.${userId}` }, () => {
      fetchAndEmit();
    })
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

// CLANS
export async function fetchAllClansFromFirestore(): Promise<Clan[]> {
  const { data, error } = await supabase.from('clans').select('*');
  if (error || !data) return [];
  return data.map(c => ({
    id: c.id,
    name: c.name,
    tag: c.tag || '',
    description: c.description,
    avatarUrl: c.avatar_url,
    leaderId: c.leader_id,
    leaderName: c.leader_name || 'Leader',
    members: [], 
    totalXp: c.total_xp,
    level: c.level || 1,
    joinType: c.join_type || 'open'
  }));
}

export function subscribeToAllClans(onUpdate: (clans: Clan[]) => void): () => void {
  const fetchAndEmit = async () => {
    const clans = await fetchAllClansFromFirestore();
    clans.sort((a, b) => (b.totalXp || 0) - (a.totalXp || 0));
    onUpdate(clans);
  };
  fetchAndEmit();

  const channel = supabase.channel('clans_all')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'clans' }, () => {
      fetchAndEmit();
    })
    .subscribe();
  return () => {
    supabase.removeChannel(channel);
  };
}

export async function createClanInFirestore(clan: Clan): Promise<boolean> {
  const { error } = await supabase.from('clans').insert({
    id: clan.id,
    name: clan.name,
    tag: clan.tag,
    description: clan.description,
    avatar_url: clan.avatarUrl,
    leader_id: clan.leaderId,
    leader_name: clan.leaderName,
    total_xp: clan.totalXp || 0,
    level: clan.level || 1,
    join_type: clan.joinType || 'open'
  });
  return !error;
}

export async function updateClanInFirestore(clanId: string, updates: Partial<Clan>): Promise<void> {
  const dbUpdates: any = {};
  if (updates.name !== undefined) dbUpdates.name = updates.name;
  if (updates.tag !== undefined) dbUpdates.tag = updates.tag;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.avatarUrl !== undefined) dbUpdates.avatar_url = updates.avatarUrl;
  if (updates.totalXp !== undefined) dbUpdates.total_xp = updates.totalXp;
  if (updates.level !== undefined) dbUpdates.level = updates.level;
  if (updates.joinType !== undefined) dbUpdates.join_type = updates.joinType;
  
  await supabase.from('clans').update(dbUpdates).eq('id', clanId);
}

export async function joinClanInFirestore(clanId: string, user: UserProfile): Promise<boolean> {
  const { data: clan } = await supabase.from('clans').select('member_ids, members_count').eq('id', clanId).single();
  if (!clan) return false;
  
  if (!clan.member_ids.includes(user.id)) {
    const updatedMembers = [...clan.member_ids, user.id];
    await supabase.from('clans').update({
      member_ids: updatedMembers,
      members_count: updatedMembers.length
    }).eq('id', clanId);
    
    // Also update user profile
    await supabase.from('users').update({ clan_id: clanId }).eq('id', user.id);
  }
  return true;
}

export async function leaveClanInFirestore(clanId: string, userId: string): Promise<boolean> {
  const { data: clan } = await supabase.from('clans').select('member_ids, members_count').eq('id', clanId).single();
  if (!clan) return false;
  
  const updatedMembers = clan.member_ids.filter((id: string) => id !== userId);
  if (updatedMembers.length === 0) {
    await supabase.from('clans').delete().eq('id', clanId);
  } else {
    await supabase.from('clans').update({
      member_ids: updatedMembers,
      members_count: updatedMembers.length
    }).eq('id', clanId);
  }
  await supabase.from('users').update({ clan_id: null }).eq('id', userId);
  return true;
}

// STUBS for CHALLENGES & NOTIFICATIONS (Can be fully implemented if needed)
export async function saveChallengeToFirestore(challenge: ChallengeItem): Promise<boolean> { return true; }
export function subscribeToUserChallenges(userId: string, onUpdate: (c: ChallengeItem[]) => void) { return () => {}; }
export async function sendNotificationToFirestore(n: NotificationItem): Promise<void> {}
export async function markNotificationsAsReadInFirestore(userId: string): Promise<void> {}
export function subscribeToUserNotifications(userId: string, onUpdate: (n: NotificationItem[]) => void) { return () => {}; }

export async function updateUserFollowersInFirestore(userId: string, newFollowersCount: number, followingIds: string[]): Promise<void> {
  try {
    await supabase.from('users').update({
      followers_count: newFollowersCount,
      following_ids: followingIds
    }).eq('id', userId);
  } catch (err) {
    console.error('Error updating followers:', err);
  }
}

export async function syncFirestoreUsersToColleagues(uids: string[]): Promise<LeaderboardUser[]> {
  if (!uids || uids.length === 0) return [];
  try {
    const { data, error } = await supabase.from('users').select('id, name, username, avatar_url, xp_total, level, company, followers_count').in('id', uids);
    if (error) throw error;
    
    return data.map(u => ({
      weeklyXp: u.xp_total || 0,
      rank: 0,
      league: 'Bronze',
      badgeCount: 0,
      id: u.id,
      name: u.name,
      username: u.username,
      avatarUrl: u.avatar_url,
      xpTotal: u.xp_total,
      level: u.level,
      company: u.company,
      followersCount: u.followers_count
    }));
  } catch (err) {
    console.warn('Error syncing colleagues:', err);
    return [];
  }
}

export async function loadUserProgressFromFirestore(userId: string) {
  return null; // Not needed separately in the new model since it's grouped in loadUserProfileFromFirestore
}

export function subscribeToUserProgress(userId: string, onUpdate: (a: any) => void) {
  return () => {};
}

export async function loadMockExamHistoryFromFirestore(userId: string) {
  return [];
}
export const fetchAllFirestoreUsers = fetchAllUsersFromFirestore;
