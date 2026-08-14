import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, Chapter, Lesson, MockExamResult, LeaderboardUser, NotificationItem } from './types';
import { ISTQB_CHAPTERS, getIstqbChapters } from './data/istqbContent';
import { 
  loadUserProfile, saveUserProfile, getMockExamHistory, saveMockExamResult, getDefaultUser 
} from './utils/storage';
import { generateUniqueUsername } from './utils/usernameUtils';
import { 
  getNotifications, markNotificationsAsRead, toggleFollowColleague, syncFirestoreUsersToColleagues 
} from './utils/socialStorage';
import { Language, translations } from './utils/i18n';
import { auth, onAuthStateChanged, firebaseSignOut, testFirestoreConnection } from './lib/firebase';
import { 
  saveUserProfileToFirestore, 
  saveUserProgressToFirestore,
  loadUserProfileFromFirestore, 
  subscribeToUserProfile,
  loadUserProgressFromFirestore,
  subscribeToUserProgress,
  loadMockExamHistoryFromFirestore,
  subscribeToMockExams,
  subscribeToUserNotifications,
  subscribeToUserChallenges,
  fetchAllFirestoreUsers 
} from './utils/firestoreService';

import { Navbar } from './components/Navbar';
import { BottomNav, TabType } from './components/BottomNav';
import { ChapterTrail } from './components/ChapterTrail';
import { LessonModal } from './components/LessonModal';
import { QuizModal } from './components/QuizModal';
import { MockExamModal } from './components/MockExamModal';
import { LeaderboardView } from './components/LeaderboardView';
import { PremiumModal } from './components/PremiumModal';
import { ShopModal } from './components/ShopModal';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { OnboardingModal } from './components/OnboardingModal';
import { WelcomeAuthScreen } from './components/WelcomeAuthScreen';
import { ConsentModal } from './components/ConsentModal';
import { InfoFaqView } from './components/InfoFaqView';

// Social Components
import { UserProfileModal } from './components/UserProfileModal';
import { EditProfileModal } from './components/EditProfileModal';
import { UserSearchModal } from './components/UserSearchModal';
import { NotificationsModal } from './components/NotificationsModal';
import { ChallengeModal } from './components/ChallengeModal';
import { ClansView } from './components/ClansView';
import { SocialView } from './components/SocialView';
import InstallPWA from './components/InstallPWA';

export default function App() {
  const [user, setUser] = useState<UserProfile>(loadUserProfile);
  const [activeTab, setActiveTab] = useState<TabType>('trail');

  // Modals & Active State
  const [activeLessonModal, setActiveLessonModal] = useState<{ chapter: Chapter; lesson: Lesson } | null>(null);
  const [activeQuizModal, setActiveQuizModal] = useState<{ chapter: Chapter; isFreeReview: boolean } | null>(null);
  const [showMockExamModal, setShowMockExamModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);

  // Social Modals & Notifications
  const [selectedUserForModal, setSelectedUserForModal] = useState<LeaderboardUser | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [challengeTargetOpponent, setChallengeTargetOpponent] = useState<LeaderboardUser | undefined>(undefined);
  const [challengeIdToPlay, setChallengeIdToPlay] = useState<string | undefined>(undefined);
  const [socialFriendsFilter, setSocialFriendsFilter] = useState<'all' | 'following' | 'followers'>('all');

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => getNotifications(user.id));
  const [mockHistory, setMockHistory] = useState<MockExamResult[]>(getMockExamHistory);

  const unreadNotifsCount = notifications.filter(n => !n.isRead).length;

  // Verify Firestore connection on boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  const isRemoteUpdateRef = useRef(false);
  const lastCloudSavedHashRef = useRef('');
  const cloudSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync state changes to localStorage and throttled Firestore
  useEffect(() => {
    // Always save locally immediately
    saveUserProfile(user);

    // If this update was triggered by a remote Firestore snapshot, skip sending it back
    if (isRemoteUpdateRef.current) {
      isRemoteUpdateRef.current = false;
      return;
    }

    if (user.uid && user.isLoggedIn) {
      const stateHash = JSON.stringify({
        uid: user.uid,
        xp: user.xpTotal,
        coins: user.coins,
        lives: user.livesCurrent,
        streak: user.streakDays,
        lessons: user.completedLessonIds,
        chapters: user.completedChapterIds,
        badges: user.unlockedBadgeIds,
        name: user.name,
        username: user.username,
        avatar: user.avatarUrl,
        plan: user.plan,
        clanId: user.clanId,
        following: user.followingIds,
      });

      if (stateHash === lastCloudSavedHashRef.current) {
        return;
      }

      if (cloudSaveTimerRef.current) {
        clearTimeout(cloudSaveTimerRef.current);
      }

      cloudSaveTimerRef.current = setTimeout(() => {
        lastCloudSavedHashRef.current = stateHash;
        saveUserProfileToFirestore(user);
        if (user.uid) {
          saveUserProgressToFirestore(user.uid, {
            userId: user.uid,
            completedLessonIds: user.completedLessonIds || [],
            completedChapterIds: user.completedChapterIds || [],
            unlockedBadgeIds: user.unlockedBadgeIds || [],
          });
        }
      }, 1500);
    }

    return () => {
      if (cloudSaveTimerRef.current) {
        clearTimeout(cloudSaveTimerRef.current);
      }
    };
  }, [user]);

  const [isAppVisible, setIsAppVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsAppVisible(!document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Firebase Auth State Listener & Realtime Firestore Sync
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const uid = fbUser.uid;
        const [firestoreUser, advancesData, examsData] = await Promise.all([
          loadUserProfileFromFirestore(uid),
          loadUserProgressFromFirestore(uid),
          loadMockExamHistoryFromFirestore(uid)
        ]);

        if (examsData && examsData.length > 0) {
          setMockHistory(examsData);
        }

        const autoUsername = generateUniqueUsername(fbUser.displayName || fbUser.email || 'candidato');

        if (firestoreUser) {
          isRemoteUpdateRef.current = true;
          setUser(prev => ({
            ...prev,
            ...firestoreUser,
            completedLessonIds: advancesData?.completedLessonIds || firestoreUser.completedLessonIds || prev.completedLessonIds,
            completedChapterIds: advancesData?.completedChapterIds || firestoreUser.completedChapterIds || prev.completedChapterIds,
            unlockedBadgeIds: advancesData?.unlockedBadgeIds || firestoreUser.unlockedBadgeIds || prev.unlockedBadgeIds,
            uid,
            isLoggedIn: true,
            email: fbUser.email || prev.email,
            name: fbUser.displayName || firestoreUser.name || prev.name,
            username: firestoreUser.username || prev.username || autoUsername,
            avatarUrl: fbUser.photoURL || firestoreUser.avatarUrl || prev.avatarUrl,
            hasChosenInitialAuth: true,
          }));
        } else {
          // Initialize new Firestore document
          const newUserProfile: UserProfile = {
            ...user,
            uid,
            isLoggedIn: true,
            authProvider: 'google',
            email: fbUser.email || user.email,
            name: fbUser.displayName || user.name,
            username: autoUsername,
            avatarUrl: fbUser.photoURL || user.avatarUrl,
            hasChosenInitialAuth: true,
          };
          setUser(newUserProfile);
          await saveUserProfileToFirestore(newUserProfile);
        }
      }
    });

    return () => {
      unsubscribeAuth();
    };
  }, []);

  // Manage Realtime Firestore Subscribers based on visibility
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    if (user.uid && user.isLoggedIn && isAppVisible) {
      unsubs.push(
        subscribeToUserProfile(user.uid, (remoteProfile) => {
          if (remoteProfile) {
            isRemoteUpdateRef.current = true;
            setUser(prev => ({
              ...prev,
              ...remoteProfile,
              uid: user.uid,
              isLoggedIn: true,
            }));
          }
        })
      );

      unsubs.push(
        subscribeToUserProgress(user.uid, (remoteAdvances) => {
          if (remoteAdvances) {
            isRemoteUpdateRef.current = true;
            setUser(prev => ({
              ...prev,
              completedLessonIds: remoteAdvances.completedLessonIds || prev.completedLessonIds,
              completedChapterIds: remoteAdvances.completedChapterIds || prev.completedChapterIds,
              unlockedBadgeIds: remoteAdvances.unlockedBadgeIds || prev.unlockedBadgeIds,
            }));
          }
        })
      );

      unsubs.push(
        subscribeToMockExams(user.uid, (remoteExams) => {
          if (remoteExams) {
            setMockHistory(remoteExams);
          }
        })
      );

      unsubs.push(
        subscribeToUserNotifications(user.uid, (remoteNotifs) => {
          if (remoteNotifs) {
            setNotifications(remoteNotifs);
          }
        })
      );
    }

    return () => {
      unsubs.forEach(u => u());
    };
  }, [user.uid, user.isLoggedIn, isAppVisible]);

  // Sync all registered Firestore users into colleagues list on mount
  useEffect(() => {
    fetchAllFirestoreUsers().then(fsUsers => {
      if (fsUsers && fsUsers.length > 0) {
        syncFirestoreUsersToColleagues(fsUsers);
      }
    });
  }, []);

  // Handle Welcome Screen Selection
  const handleSelectAuthOption = (option: 'login' | 'signup' | 'guest') => {
    if (option === 'guest') {
      setUser(prev => ({
        ...prev,
        authProvider: 'guest',
        isLoggedIn: false,
        hasChosenInitialAuth: true,
      }));
      setShowConsentModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  // Handle Consent Confirmation
  const handleConfirmConsent = (consent: {
    dataConsentAccepted: boolean;
    notificationsEnabled: boolean;
    analyticsConsentAccepted: boolean;
  }) => {
    setUser(prev => ({
      ...prev,
      ...consent,
      hasChosenInitialAuth: true,
    }));
    setShowConsentModal(false);
    if (!user.hasCompletedTutorial) {
      setShowTutorialModal(true);
    }
  };

  // Handle Language Switching
  const handleToggleLanguage = (newLang: Language) => {
    setUser(prev => ({ ...prev, language: newLang }));
  };

  // Handle Auth Success
  const handleAuthSuccess = (update: Partial<UserProfile>, isNewAccount: boolean) => {
    const updatedUser = {
      ...user,
      ...update,
      hasChosenInitialAuth: true,
    };
    setUser(updatedUser);
    if (updatedUser.uid) {
      saveUserProfileToFirestore(updatedUser);
    }

    setShowAuthModal(false);
    if (isNewAccount || !user.dataConsentAccepted) {
      setShowConsentModal(true);
    } else if (!user.hasCompletedTutorial) {
      setShowTutorialModal(true);
    }
  };

  const handleFinishTutorial = () => {
    setUser(prev => ({ ...prev, hasCompletedTutorial: true }));
    setShowTutorialModal(false);
  };

  const handleLogout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser({
      ...getDefaultUser(),
      hasChosenInitialAuth: false,
    });
  };

  // Handle Lesson Completion
  const handleCompleteLesson = (lessonId: string, xpReward: number) => {
    setUser(prev => {
      const alreadyDone = prev.completedLessonIds.includes(lessonId);
      const newLessonIds = alreadyDone ? prev.completedLessonIds : [...prev.completedLessonIds, lessonId];
      const newXp = alreadyDone ? prev.xpTotal : prev.xpTotal + xpReward;

      return {
        ...prev,
        completedLessonIds: newLessonIds,
        xpTotal: newXp,
      };
    });
  };

  // Handle Quiz Deduct Life (for Free user)
  const handleDeductLife = () => {
    setUser(prev => {
      if (prev.plan === 'premium' || prev.livesCurrent <= 0) return prev;
      return {
        ...prev,
        livesCurrent: prev.livesCurrent - 1,
        lastLifeRechargeTime: Date.now(),
      };
    });
  };

  // Handle Reward XP
  const handleRewardXp = (amount: number) => {
    setUser(prev => {
      const is2xActive = (prev.doubleXpActiveUntil || 0) > Date.now();
      const streakMult = 1 + Math.min(0.20, Math.floor((prev.streakDays || 0) / 10) * 0.01);
      const bonusXp = Math.round(amount * (is2xActive ? 2 : 1) * streakMult);
      return {
        ...prev,
        xpTotal: prev.xpTotal + bonusXp,
      };
    });
  };

  // Handle Chapter Quiz Complete
  const handleChapterComplete = (chapterId: number, badgeId: string) => {
    setUser(prev => {
      const newCh = prev.completedChapterIds.includes(chapterId) ? prev.completedChapterIds : [...prev.completedChapterIds, chapterId];
      const newBadges = prev.unlockedBadgeIds.includes(badgeId) ? prev.unlockedBadgeIds : [...prev.unlockedBadgeIds, badgeId];

      return {
        ...prev,
        completedChapterIds: newCh,
        unlockedBadgeIds: newBadges,
        coins: (prev.coins || 0) + 50, // Award 50 Moedas QA
      };
    });
  };

  // Handle Mock Exam Completion
  const handleCompleteMockExam = (result: MockExamResult) => {
    saveMockExamResult(result);
    setMockHistory(getMockExamHistory());

    const is2xActive = (user.doubleXpActiveUntil || 0) > Date.now();
    const streakMult = 1 + Math.min(0.20, Math.floor((user.streakDays || 0) / 10) * 0.01);

    // XP based on accuracy (50 XP per correct answer out of 40 = up to 2000 XP) + passing bonus + 100% bonus
    const baseAccuracyXp = Math.round(result.score * 50);
    const passingBonusXp = result.passed ? 250 : 0;
    const perfectBonusXp = result.percentage === 100 ? 500 : 0;

    const rawXp = baseAccuracyXp + passingBonusXp + perfectBonusXp;
    const finalEarnedXp = Math.round(rawXp * (is2xActive ? 2 : 1) * streakMult);

    const coinBonus = result.passed ? (result.percentage === 100 ? 200 : 100) : 25;

    setUser(prev => ({
      ...prev,
      mockExamsUsedThisMonth: prev.mockExamsUsedThisMonth + 1,
      xpTotal: prev.xpTotal + finalEarnedXp,
      coins: (prev.coins || 0) + coinBonus,
    }));
  };

  // Dev / Testing Helper actions
  const handleRechargeLives = () => {
    setUser(prev => ({ ...prev, livesCurrent: 5 }));
  };

  const handleTogglePlan = (newPlan: 'free' | 'premium') => {
    setUser(prev => ({
      ...prev,
      plan: newPlan,
      livesCurrent: newPlan === 'premium' ? 5 : prev.livesCurrent,
    }));
    setShowPremiumModal(false);
  };

  const handleResetProgress = () => {
    if (confirm('Tem certeza que deseja resetar todo o seu progresso no ISTQB Trail?')) {
      const def = getDefaultUser();
      setUser(def);
      localStorage.removeItem('istqb_trail_mock_exams_v1');
      setMockHistory([]);
    }
  };

  const handleToggleFollowUser = (targetUserId: string, targetUserObj?: LeaderboardUser) => {
    const updated = toggleFollowColleague(user, targetUserId, targetUserObj);
    setUser(updated);
    setNotifications(getNotifications(user.id));
  };

  const handleStartChallengeUser = (targetUser?: LeaderboardUser, challengeId?: string) => {
    setChallengeTargetOpponent(targetUser);
    setChallengeIdToPlay(challengeId);
    setShowChallengeModal(true);
  };

  const handleOpenNotifications = () => {
    setShowNotificationsModal(true);
    markNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleMarkNotificationsAsRead = () => {
    markNotificationsAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const maxExams = user.plan === 'premium' ? 5 : 1;
  const mockExamAvailable = user.mockExamsUsedThisMonth < maxExams;

  if (!user.hasChosenInitialAuth) {
    return (
      <>
        <WelcomeAuthScreen
          language={user.language}
          onSelectOption={handleSelectAuthOption}
          onToggleLanguage={handleToggleLanguage}
        />

        {showAuthModal && (
          <AuthModal
            user={user}
            onClose={() => setShowAuthModal(false)}
            onAuthSuccess={handleAuthSuccess}
            onLanguageChange={handleToggleLanguage}
          />
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-teal-500 selection:text-slate-950 w-full max-w-full overflow-x-hidden relative">
      
      {/* Top Navbar */}
      <Navbar
        user={user}
        unreadNotifsCount={unreadNotifsCount}
        onOpenPremium={() => setShowPremiumModal(true)}
        onOpenShop={() => setShowPremiumModal(true)}
        onOpenSettings={() => setActiveTab('profile')}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenTutorial={() => setShowTutorialModal(true)}
        onToggleLanguage={handleToggleLanguage}
        onOpenSearch={() => setShowSearchModal(true)}
        onOpenNotifications={handleOpenNotifications}
      />

      {/* Main View Switcher */}
      <main className="max-w-4xl mx-auto">
        {activeTab === 'trail' && (
          <ChapterTrail
            chapters={getIstqbChapters(user.language || 'pt')}
            user={user}
            onStartLesson={(chapter, lessonId) => {
              const lesson = chapter.lessons.find(l => l.id === lessonId);
              if (lesson) setActiveLessonModal({ chapter, lesson });
            }}
            onStartQuiz={(chapter) => {
              setActiveQuizModal({ chapter, isFreeReview: false });
            }}
            onStartFreeReview={(chapter) => {
              setActiveQuizModal({ chapter, isFreeReview: true });
            }}
          />
        )}

        {activeTab === 'mock' && (
          <div className="p-4 max-w-xl mx-auto space-y-6 pt-6">
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-800/50 rounded-2xl p-6 text-center space-y-3 shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-indigo-600/30">
                <span className="font-black text-2xl">40</span>
              </div>

              <h2 className="text-xl font-black text-white">{translations[user.language || 'pt'].mockExamTitle}</h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
                {translations[user.language || 'pt'].mockExamDesc}
              </p>

              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 inline-block text-xs font-semibold text-teal-300">
                {user.language === 'en' ? `Mock exams used this month: ${user.mockExamsUsedThisMonth}/${maxExams}` : `Simulados utilizados este mês: ${user.mockExamsUsedThisMonth}/${maxExams}`}
              </div>

              <button
                onClick={() => setShowMockExamModal(true)}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/20 transition block"
              >
                {translations[user.language || 'pt'].startMockExam}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <InfoFaqView
            language={user.language}
            onOpenAuth={() => setShowAuthModal(true)}
            onOpenPremium={() => setShowPremiumModal(true)}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardView
            user={user}
            onSelectUser={(target) => setSelectedUserForModal(target)}
            onToggleFollow={handleToggleFollowUser}
            onStartChallenge={(target) => handleStartChallengeUser(target)}
          />
        )}

        {(activeTab === 'social' || activeTab === 'clans') && (
          <SocialView
            user={user}
            onUserUpdate={setUser}
            onSelectUser={(target) => setSelectedUserForModal(target)}
            onToggleFollow={handleToggleFollowUser}
            onStartChallenge={(target) => handleStartChallengeUser(target)}
            initialSubTab={activeTab === 'clans' ? 'clans' : 'friends'}
            initialFriendsFilter={socialFriendsFilter}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            mockExamHistory={mockHistory}
            onOpenPremium={() => setShowPremiumModal(true)}
            onRechargeLives={handleRechargeLives}
            onAddDevXp={handleRewardXp}
            onResetProgress={handleResetProgress}
            onOpenAuth={() => setShowAuthModal(true)}
            onOpenTutorial={() => setShowTutorialModal(true)}
            onToggleLanguage={handleToggleLanguage}
            onLogout={handleLogout}
            onOpenEditProfile={() => setShowEditProfileModal(true)}
            onOpenSearch={() => setShowSearchModal(true)}
            onOpenFollowing={() => {
              setSocialFriendsFilter('following');
              setActiveTab('social');
            }}
            onOpenFollowers={() => {
              setSocialFriendsFilter('followers');
              setActiveTab('social');
            }}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        mockExamAvailable={mockExamAvailable}
        language={user.language}
      />

      {/* Modals */}
      {showConsentModal && (
        <ConsentModal
          user={user}
          onAccept={handleConfirmConsent}
        />
      )}
      {showAuthModal && (
        <AuthModal
          user={user}
          onClose={() => setShowAuthModal(false)}
          onAuthSuccess={handleAuthSuccess}
          onLanguageChange={handleToggleLanguage}
          onLogout={handleLogout}
        />
      )}

      {showTutorialModal && (
        <OnboardingModal
          user={user}
          onFinish={handleFinishTutorial}
        />
      )}

      {activeLessonModal && (
        <LessonModal
          chapter={activeLessonModal.chapter}
          lesson={activeLessonModal.lesson}
          onClose={() => setActiveLessonModal(null)}
          onCompleteLesson={handleCompleteLesson}
        />
      )}

      {activeQuizModal && (
        <QuizModal
          chapter={activeQuizModal.chapter}
          user={user}
          isFreeReviewMode={activeQuizModal.isFreeReview}
          onClose={() => setActiveQuizModal(null)}
          onDeductLife={handleDeductLife}
          onRewardXp={handleRewardXp}
          onChapterComplete={handleChapterComplete}
          onOpenPremium={() => {
            setActiveQuizModal(null);
            setShowPremiumModal(true);
          }}
          onRechargeLifeAd={handleRechargeLives}
        />
      )}

      {showMockExamModal && (
        <MockExamModal
          user={user}
          onClose={() => setShowMockExamModal(false)}
          onCompleteMockExam={handleCompleteMockExam}
          onOpenPremium={() => {
            setShowMockExamModal(false);
            setShowPremiumModal(true);
          }}
          onUserUpdate={setUser}
        />
      )}

      {(showPremiumModal || showShopModal) && (
        <PremiumModal
          user={user}
          onClose={() => {
            setShowPremiumModal(false);
            setShowShopModal(false);
          }}
          onTogglePlan={handleTogglePlan}
          onUserUpdate={setUser}
        />
      )}

      {/* Social & Profile Modals */}
      {selectedUserForModal && (
        <UserProfileModal
          currentUser={user}
          targetUser={selectedUserForModal}
          onClose={() => setSelectedUserForModal(null)}
          onToggleFollow={handleToggleFollowUser}
          onStartChallenge={(target) => {
            setSelectedUserForModal(null);
            handleStartChallengeUser(target);
          }}
        />
      )}

      {showEditProfileModal && (
        <EditProfileModal
          user={user}
          onSave={setUser}
          onClose={() => setShowEditProfileModal(false)}
        />
      )}

      {showSearchModal && (
        <UserSearchModal
          currentUser={user}
          onClose={() => setShowSearchModal(false)}
          onSelectUser={(target) => setSelectedUserForModal(target)}
          onToggleFollow={handleToggleFollowUser}
        />
      )}

      {showNotificationsModal && (
        <NotificationsModal
          user={user}
          notifications={notifications}
          onClose={() => setShowNotificationsModal(false)}
          onMarkAllRead={handleMarkNotificationsAsRead}
          onOpenChallenge={(chalId) => {
            setShowNotificationsModal(false);
            handleStartChallengeUser(undefined, chalId);
          }}
        />
      )}

      {showChallengeModal && (
        <ChallengeModal
          currentUser={user}
          targetOpponent={challengeTargetOpponent}
          challengeIdToPlay={challengeIdToPlay}
          onClose={() => setShowChallengeModal(false)}
          onUserUpdate={setUser}
        />
      )}

      <InstallPWA />
    </div>
  );
}
