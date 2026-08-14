import { 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs, 
  addDoc, 
  onSnapshot, 
  runTransaction 
} from '../lib/firebase';
import { 
  UserProfile, 
  LeaderboardUser, 
  MockExamResult, 
  Clan, 
  ClanMember, 
  ChallengeItem, 
  NotificationItem
} from '../types';

// Collection Names in Firestore
export const USERS_COLLECTION = 'users';
export const ADVANCES_COLLECTION = 'advances';
export const MOCK_EXAMS_COLLECTION = 'mock_exams';
export const CLANS_COLLECTION = 'clans';
export const CHALLENGES_COLLECTION = 'challenges';
export const NOTIFICATIONS_COLLECTION = 'notifications';
export const TRANSACTIONS_COLLECTION = 'transactions';

// ==========================================
// 1. USERS & ACCOUNT SECURITY
// ==========================================

// In-memory cache for all users to prevent excessive reads
let cachedAllUsers: { timestamp: number; data: LeaderboardUser[] } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function saveUserProfileToFirestore(user: UserProfile): Promise<void> {
  const uid = user.uid || user.id;
  if (!uid || uid === 'usr_default') return;

  const userRef = doc(db, USERS_COLLECTION, uid);
  const cleanData: Record<string, any> = {
    uid,
    name: user.name || 'Candidato ISTQB',
    username: (user.username || 'candidato').toLowerCase().trim(),
    email: user.email || '',
    avatarUrl: user.avatarUrl || '',
    company: user.company || '',
    bio: user.bio || '',
    country: user.country || 'BR',
    language: user.language || 'pt',
    plan: user.plan || 'free',
    xpTotal: Math.max(0, user.xpTotal || 0),
    level: Math.max(1, user.level || 1),
    streakDays: Math.max(0, user.streakDays || 0),
    coins: Math.max(0, user.coins !== undefined ? user.coins : 150),
    extraMockExamTokens: Math.max(0, user.extraMockExamTokens || 0),
    livesCurrent: Math.min(10, Math.max(0, user.livesCurrent !== undefined ? user.livesCurrent : 5)),
    livesMax: Math.max(5, user.livesMax || 5),
    completedChapterIds: user.completedChapterIds || [],
    completedLessonIds: user.completedLessonIds || [],
    unlockedBadgeIds: user.unlockedBadgeIds || [],
    mockExamsUsedThisMonth: user.mockExamsUsedThisMonth || 0,
    clanId: user.clanId || '',
    followersCount: user.followersCount || 0,
    followingIds: user.followingIds || [],
    updatedAt: new Date().toISOString(),
  };

  try {
    // Use setDoc with merge: true directly to avoid an extra getDoc read operation
    await setDoc(userRef, cleanData, { merge: true });
  } catch (error: any) {
    if (error?.code === 'resource-exhausted') {
      console.warn('Firestore daily quota reached. Operating in local offline mode.');
    } else {
      console.warn('Error saving user profile to Firestore:', error);
    }
  }
}

export async function loadUserProfileFromFirestore(uid: string): Promise<UserProfile | null> {
  if (!uid || uid === 'usr_default') return null;
  const userRef = doc(db, USERS_COLLECTION, uid);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
  } catch (error: any) {
    if (error?.code === 'resource-exhausted') {
      console.warn('Firestore quota reached when loading profile.');
    } else {
      console.warn('Error loading user profile from Firestore:', error);
    }
  }
  return null;
}

export function subscribeToUserProfile(uid: string, onUpdate: (user: UserProfile) => void): () => void {
  if (!uid || uid === 'usr_default') return () => {};
  const userRef = doc(db, USERS_COLLECTION, uid);
  try {
    return onSnapshot(userRef, (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as UserProfile);
      }
    }, (err) => {
      if (err?.code === 'resource-exhausted') { console.warn('Firestore quota reached (Profile). Using offline mode.'); } else { console.warn('Firestore user profile snapshot error:', err); }
    });
  } catch (e) {
    return () => {};
  }
}

/**
 * Secure transaction to prevent client-side tampering of coins, lives, and XP.
 */
export async function secureModifyUserBalance(
  uid: string, 
  changes: { 
    coinsDelta?: number; 
    livesDelta?: number; 
    xpDelta?: number; 
    tokensDelta?: number;
    source: string;
  }
): Promise<boolean> {
  if (!uid || uid === 'usr_default') return false;
  const userRef = doc(db, USERS_COLLECTION, uid);

  try {
    await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error('User does not exist in Firestore');
      }

      const userData = userDoc.data() as UserProfile;
      const currentCoins = userData.coins || 0;
      const currentLives = userData.livesCurrent || 5;
      const currentXp = userData.xpTotal || 0;
      const currentTokens = userData.extraMockExamTokens || 0;

      // Validate deductions
      if (changes.coinsDelta && changes.coinsDelta < 0 && (currentCoins + changes.coinsDelta < 0)) {
        throw new Error('Insufficient coins balance.');
      }

      const newCoins = Math.max(0, currentCoins + (changes.coinsDelta || 0));
      const newLives = Math.min(userData.livesMax || 5, Math.max(0, currentLives + (changes.livesDelta || 0)));
      const newXp = Math.max(0, currentXp + (changes.xpDelta || 0));
      const newTokens = Math.max(0, currentTokens + (changes.tokensDelta || 0));

      transaction.update(userRef, {
        coins: newCoins,
        livesCurrent: newLives,
        xpTotal: newXp,
        extraMockExamTokens: newTokens,
        updatedAt: new Date().toISOString(),
      });

      // Write transaction audit log
      const txRef = doc(collection(db, TRANSACTIONS_COLLECTION));
      transaction.set(txRef, {
        id: txRef.id,
        userId: uid,
        coinsDelta: changes.coinsDelta || 0,
        livesDelta: changes.livesDelta || 0,
        xpDelta: changes.xpDelta || 0,
        tokensDelta: changes.tokensDelta || 0,
        source: changes.source,
        createdAt: new Date().toISOString(),
      });
    });

    return true;
  } catch (err) {
    console.error('Secure balance modification transaction error:', err);
    return false;
  }
}

export async function checkUsernameTakenInFirestore(username: string, excludeUid?: string): Promise<boolean> {
  if (!username) return false;
  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('username', '==', username.toLowerCase().trim()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return false;
    for (const docSnap of snapshot.docs) {
      if (docSnap.id !== excludeUid) {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.warn('Error checking username in Firestore:', err);
    return false;
  }
}

export async function searchFirestoreUsers(searchTerm: string, currentUserId: string): Promise<LeaderboardUser[]> {
  const cleanTerm = searchTerm.trim().toLowerCase().replace(/^@/, '');
  if (!cleanTerm) return [];

  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const q = query(usersRef, where('username', '>=', cleanTerm), where('username', '<=', cleanTerm + '\uf8ff'));
    const snapshot = await getDocs(q);

    const results: LeaderboardUser[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data() as UserProfile;
      if (data.uid !== currentUserId) {
        results.push({
          id: data.uid || docSnap.id,
          name: data.name || 'Usuário ISTQB',
          username: data.username,
          email: data.email,
          avatarUrl: data.avatarUrl,
          weeklyXp: data.xpTotal || 0,
          xpTotal: data.xpTotal || 0,
          rank: 1,
          league: data.league || 'Bronze',
          badgeCount: data.unlockedBadgeIds?.length || 0,
          company: data.company,
          bio: data.bio,
          completedChapterCount: data.completedChapterIds?.length || 0,
          followersCount: data.followersCount || 0,
        });
      }
    });

    return results;
  } catch (err) {
    console.warn('Error searching users in Firestore:', err);
    return [];
  }
}

export async function fetchAllFirestoreUsers(): Promise<LeaderboardUser[]> {
  // Check memory cache first
  if (cachedAllUsers && (Date.now() - cachedAllUsers.timestamp < CACHE_TTL_MS)) {
    return cachedAllUsers.data;
  }

  try {
    const usersRef = collection(db, USERS_COLLECTION);
    const snapshot = await getDocs(usersRef);

    const results: LeaderboardUser[] = [];
    snapshot.forEach(docSnap => {
      const data = docSnap.data() as UserProfile;
      const uid = data.uid || docSnap.id;
      if (uid) {
        results.push({
          id: uid,
          name: data.name || 'Candidato ISTQB',
          username: data.username,
          email: data.email,
          avatarUrl: data.avatarUrl,
          weeklyXp: data.xpTotal || 0,
          xpTotal: data.xpTotal || 0,
          rank: 1,
          league: data.league || 'Bronze',
          badgeCount: data.unlockedBadgeIds?.length || 0,
          company: data.company,
          bio: data.bio,
          completedChapterCount: data.completedChapterIds?.length || 0,
          followersCount: data.followersCount || 0,
          followingIds: data.followingIds || [],
        });
      }
    });

    cachedAllUsers = {
      timestamp: Date.now(),
      data: results,
    };

    return results;
  } catch (err: any) {
    if (err?.code === 'resource-exhausted') {
      console.warn('Firestore quota reached for fetching users.');
    } else {
      console.warn('Error fetching all Firestore users:', err);
    }
    return cachedAllUsers?.data || [];
  }
}

export async function updateUserFollowersInFirestore(uid: string, followersCount: number): Promise<void> {
  if (!uid || uid === 'usr_default') return;
  try {
    const userRef = doc(db, USERS_COLLECTION, uid);
    await setDoc(userRef, {
      followersCount,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn('Error updating user followers in Firestore:', err);
  }
}

// ==========================================
// 2. ADVANCES / PROGRESS (Granular Tracking)
// ==========================================

export interface UserAdvancesData {
  userId: string;
  completedLessonIds: string[];
  completedChapterIds: (number | string)[];
  unlockedBadgeIds: string[];
  chapterQuizScores?: Record<string, number>;
  lastActiveDate: string;
  updatedAt: string;
}

export async function saveUserProgressToFirestore(
  userId: string, 
  progress: Partial<UserAdvancesData>
): Promise<void> {
  if (!userId || userId === 'usr_default') return;
  const advRef = doc(db, ADVANCES_COLLECTION, userId);

  try {
    const data: Record<string, any> = {
      userId,
      completedLessonIds: progress.completedLessonIds || [],
      completedChapterIds: progress.completedChapterIds || [],
      unlockedBadgeIds: progress.unlockedBadgeIds || [],
      lastActiveDate: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };
    if (progress.chapterQuizScores) {
      data.chapterQuizScores = progress.chapterQuizScores;
    }

    await setDoc(advRef, data, { merge: true });
  } catch (error: any) {
    if (error?.code === 'resource-exhausted') {
      console.warn('Firestore quota reached for progress.');
    } else {
      console.warn('Error saving progress to Firestore:', error);
    }
  }
}

export async function loadUserProgressFromFirestore(userId: string): Promise<UserAdvancesData | null> {
  if (!userId || userId === 'usr_default') return null;
  const advRef = doc(db, ADVANCES_COLLECTION, userId);
  try {
    const docSnap = await getDoc(advRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserAdvancesData;
    }
  } catch (error: any) {
    if (error?.code === 'resource-exhausted') {
      console.warn('Firestore quota reached when loading progress.');
    } else {
      console.warn('Error loading user progress from Firestore:', error);
    }
  }
  return null;
}

export function subscribeToUserProgress(userId: string, onUpdate: (advances: UserAdvancesData) => void): () => void {
  if (!userId || userId === 'usr_default') return () => {};
  const advRef = doc(db, ADVANCES_COLLECTION, userId);
  try {
    return onSnapshot(advRef, (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.data() as UserAdvancesData);
      }
    }, (err) => {
      if (err?.code === 'resource-exhausted') { console.warn('Firestore quota reached (Progress). Using offline mode.'); } else { console.warn('Error subscribing to progress:', err); }
    });
  } catch (e) {
    return () => {};
  }
}

// ==========================================
// 3. OFFICIAL MOCK EXAMS (Audit Log)
// ==========================================

export async function saveMockExamResultToFirestore(result: MockExamResult): Promise<void> {
  const userId = result.userId || 'usr_default';
  const examId = result.id || `mock_${Date.now()}`;
  const examRef = doc(db, MOCK_EXAMS_COLLECTION, examId);

  const cleanExamData = {
    ...result,
    id: examId,
    userId,
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(examRef, cleanExamData);
  } catch (error) {
    console.error('Error saving mock exam result to Firestore:', error);
  }
}

export async function loadMockExamHistoryFromFirestore(userId: string): Promise<MockExamResult[]> {
  if (!userId || userId === 'usr_default') return [];
  try {
    const q = query(
      collection(db, MOCK_EXAMS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    const snapshot = await getDocs(q);
    const results: MockExamResult[] = [];
    snapshot.forEach(docSnap => {
      results.push(docSnap.data() as MockExamResult);
    });
    return results;
  } catch (error) {
    console.warn('Error loading mock exam history from Firestore:', error);
    return [];
  }
}

export function subscribeToMockExams(userId: string, onUpdate: (exams: MockExamResult[]) => void): () => void {
  if (!userId || userId === 'usr_default') return () => {};
  try {
    const q = query(
      collection(db, MOCK_EXAMS_COLLECTION),
      where('userId', '==', userId),
      limit(50)
    );
    return onSnapshot(q, (snapshot) => {
      const list: MockExamResult[] = [];
      snapshot.forEach(docSnap => list.push(docSnap.data() as MockExamResult));
      list.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
      onUpdate(list);
    }, (err) => {
      if (err?.code === 'resource-exhausted') { console.warn('Firestore quota reached (Exams). Using offline mode.'); } else { console.warn('Error subscribing to mock exams:', err); }
    });
  } catch (e) {
    return () => {};
  }
}

// ==========================================
// 4. CLANS & QA SQUADS
// ==========================================

export async function fetchAllClansFromFirestore(): Promise<Clan[]> {
  try {
    const clansRef = collection(db, CLANS_COLLECTION);
    const snapshot = await getDocs(clansRef);
    const clans: Clan[] = [];
    snapshot.forEach(docSnap => {
      clans.push(docSnap.data() as Clan);
    });
    return clans;
  } catch (err) {
    console.warn('Error fetching clans from Firestore:', err);
    return [];
  }
}

export function subscribeToAllClans(onUpdate: (clans: Clan[]) => void): () => void {
  const clansRef = collection(db, CLANS_COLLECTION);
  return onSnapshot(clansRef, (snapshot) => {
    const list: Clan[] = [];
    snapshot.forEach(docSnap => list.push(docSnap.data() as Clan));
    list.sort((a, b) => (b.totalXp || 0) - (a.totalXp || 0));
    onUpdate(list);
  }, (err) => {
    if (err?.code === 'resource-exhausted') { console.warn('Firestore quota reached (Clans). Using offline mode.'); } else { console.warn('Error subscribing to clans:', err); }
  });
}

export async function createClanInFirestore(clan: Clan): Promise<boolean> {
  if (!clan.id || !clan.leaderId) return false;
  const clanRef = doc(db, CLANS_COLLECTION, clan.id);
  try {
    await setDoc(clanRef, {
      ...clan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error('Error creating clan in Firestore:', err);
    return false;
  }
}

export async function updateClanInFirestore(clanId: string, updates: Partial<Clan>): Promise<void> {
  if (!clanId) return;
  const clanRef = doc(db, CLANS_COLLECTION, clanId);
  try {
    await updateDoc(clanRef, {
      ...updates,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error updating clan in Firestore:', err);
  }
}

export async function joinClanInFirestore(clanId: string, user: UserProfile): Promise<boolean> {
  if (!clanId || !user.id) return false;
  const clanRef = doc(db, CLANS_COLLECTION, clanId);

  try {
    await runTransaction(db, async (transaction) => {
      const clanDoc = await transaction.get(clanRef);
      if (!clanDoc.exists()) throw new Error('Clan does not exist');

      const clanData = clanDoc.data() as Clan;
      const members = clanData.members || [];
      const isAlreadyMember = members.some(m => m.id === user.id || (user.uid && m.id === user.uid));

      if (!isAlreadyMember) {
        const newMember: ClanMember = {
          id: user.id || user.uid || '',
          name: user.name || 'Candidato ISTQB',
          username: user.username,
          avatarUrl: user.avatarUrl,
          role: 'member',
          xp: user.xpTotal || 0,
          level: user.level || 1,
          joinedAt: new Date().toISOString().split('T')[0],
        };

        const updatedMembers = [...members, newMember];
        transaction.update(clanRef, {
          members: updatedMembers,
          memberCount: updatedMembers.length,
          updatedAt: new Date().toISOString(),
        });
      }
    });

    return true;
  } catch (err) {
    console.error('Error joining clan in Firestore:', err);
    return false;
  }
}

export async function leaveClanInFirestore(clanId: string, userId: string): Promise<boolean> {
  if (!clanId || !userId) return false;
  const clanRef = doc(db, CLANS_COLLECTION, clanId);

  try {
    await runTransaction(db, async (transaction) => {
      const clanDoc = await transaction.get(clanRef);
      if (!clanDoc.exists()) return;

      const clanData = clanDoc.data() as Clan;
      const members = clanData.members || [];
      const updatedMembers = members.filter(m => m.id !== userId);

      if (updatedMembers.length === 0) {
        transaction.delete(clanRef);
      } else {
        transaction.update(clanRef, {
          members: updatedMembers,
          memberCount: updatedMembers.length,
          updatedAt: new Date().toISOString(),
        });
      }
    });

    return true;
  } catch (err) {
    console.error('Error leaving clan in Firestore:', err);
    return false;
  }
}

// ==========================================
// 5. 1V1 CHALLENGES
// ==========================================

export async function saveChallengeToFirestore(challenge: ChallengeItem): Promise<boolean> {
  if (!challenge.id) return false;
  const chalRef = doc(db, CHALLENGES_COLLECTION, challenge.id);
  try {
    await setDoc(chalRef, {
      ...challenge,
      updatedAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.error('Error saving challenge to Firestore:', err);
    return false;
  }
}

export function subscribeToUserChallenges(userId: string, onUpdate: (challenges: ChallengeItem[]) => void): () => void {
  if (!userId || userId === 'usr_default') return () => {};
  try {
    const q = query(
      collection(db, CHALLENGES_COLLECTION),
      where('challengerId', '==', userId),
      limit(25)
    );
    const q2 = query(
      collection(db, CHALLENGES_COLLECTION),
      where('opponentId', '==', userId),
      limit(25)
    );

    let list1: ChallengeItem[] = [];
    let list2: ChallengeItem[] = [];

    const emit = () => {
      const map = new Map<string, ChallengeItem>();
      [...list1, ...list2].forEach(c => map.set(c.id, c));
      const combined = Array.from(map.values());
      onUpdate(combined);
    };

    const unsub1 = onSnapshot(q, snap => {
      list1 = [];
      snap.forEach(d => list1.push(d.data() as ChallengeItem));
      emit();
    }, () => {});

    const unsub2 = onSnapshot(q2, snap => {
      list2 = [];
      snap.forEach(d => list2.push(d.data() as ChallengeItem));
      emit();
    }, () => {});

    return () => {
      unsub1();
      unsub2();
    };
  } catch (e) {
    return () => {};
  }
}

// ==========================================
// 6. NOTIFICATIONS
// ==========================================

export async function sendNotificationToFirestore(notification: NotificationItem): Promise<void> {
  if (!notification.id) return;
  const notifRef = doc(db, NOTIFICATIONS_COLLECTION, notification.id);
  try {
    await setDoc(notifRef, {
      ...notification,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error sending notification to Firestore:', err);
  }
}

export async function markNotificationsAsReadInFirestore(userId: string): Promise<void> {
  if (!userId || userId === 'usr_default') return;
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      where('isRead', '==', false)
    );
    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map(d => updateDoc(d.ref, { isRead: true }));
    await Promise.all(updates);
  } catch (err) {
    console.warn('Error marking notifications read in Firestore:', err);
  }
}

export function subscribeToUserNotifications(userId: string, onUpdate: (notifs: NotificationItem[]) => void): () => void {
  if (!userId || userId === 'usr_default') return () => {};
  try {
    const q = query(
      collection(db, NOTIFICATIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(30)
    );
    return onSnapshot(q, snapshot => {
      const list: NotificationItem[] = [];
      snapshot.forEach(docSnap => list.push(docSnap.data() as NotificationItem));
      onUpdate(list);
    }, (err) => {
      console.warn('Error subscribing to notifications in Firestore:', err);
    });
  } catch (e) {
    return () => {};
  }
}
