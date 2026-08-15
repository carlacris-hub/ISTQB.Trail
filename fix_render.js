import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const newRender = `  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 pb-20 font-sans selection:bg-teal-500/30">
      <Navbar 
        user={user} 
        onOpenAuth={() => setShowAuthModal(true)} 
        onLogout={handleLogout} 
        onOpenTutorial={() => setShowTutorialModal(true)}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'trail' && (
          <ChapterTrail 
            user={user} 
            chapters={getIstqbChapters(user.language || 'pt')} 
            onSelectChapter={() => {}} 
            onSelectLesson={(c, l) => setActiveLessonModal({ chapter: c, lesson: l })} 
            onSelectQuiz={(c, q) => setActiveQuizModal({ chapter: c, isFreeReview: q })} 
            onSelectMockExam={() => setShowMockExamModal(true)} 
          />
        )}
        {activeTab === 'leaderboard' && <LeaderboardView user={user} onUserClick={setSelectedUserForModal} />}
        {activeTab === 'clans' && <ClansView user={user} onUpdateUser={setUser} onOpenPremium={() => setShowPremiumModal(true)} />}
        {activeTab === 'social' && <SocialView user={user} filter={socialFriendsFilter} setFilter={setSocialFriendsFilter} onUserClick={setSelectedUserForModal} />}
        {activeTab === 'profile' && <ProfileView user={user} onEditProfile={() => setShowEditProfileModal(true)} onLanguageChange={(l) => setUser(p => ({...p, language: l}))} onLogout={handleLogout} />}
      </main>

      <BottomNav activeTab={activeTab} onChange={setActiveTab} notificationsCount={notifications.filter(n => !n.read).length} />

      {activeLessonModal && (
        <LessonModal 
          chapter={activeLessonModal.chapter} 
          lesson={activeLessonModal.lesson} 
          user={user} 
          onClose={() => setActiveLessonModal(null)} 
          onComplete={(xp, coins) => {
            setUser(prev => ({
              ...prev,
              xpTotal: prev.xpTotal + xp,
              coins: prev.coins + coins,
              completedLessonIds: [...(prev.completedLessonIds || []), activeLessonModal.lesson.id]
            }));
            setActiveLessonModal(null);
          }} 
          onNeedPremium={() => setShowPremiumModal(true)} 
        />
      )}

      {activeQuizModal && (
        <QuizModal 
          chapter={activeQuizModal.chapter} 
          user={user} 
          isFreeReview={activeQuizModal.isFreeReview}
          onClose={() => setActiveQuizModal(null)} 
          onComplete={(xp, coins) => {
            setUser(prev => ({
              ...prev,
              xpTotal: prev.xpTotal + xp,
              coins: prev.coins + coins,
              completedChapterIds: [...(prev.completedChapterIds || []), activeQuizModal.chapter.id]
            }));
            setActiveQuizModal(null);
          }} 
          onNeedPremium={() => setShowPremiumModal(true)} 
        />
      )}

      {showAuthModal && <AuthModal user={user} onClose={() => setShowAuthModal(false)} onAuthSuccess={handleAuthSuccess} onLanguageChange={(l) => setUser(p => ({...p, language: l}))} />}
      {showEditProfileModal && <EditProfileModal user={user} onClose={() => setShowEditProfileModal(false)} onSave={(u) => setUser(u)} />}
      {showConsentModal && <ConsentModal onAccept={() => setShowConsentModal(false)} lang={user.language || 'pt'} />}
      {showMockExamModal && <MockExamModal user={user} onClose={() => setShowMockExamModal(false)} onComplete={() => {}} onNeedPremium={() => setShowPremiumModal(true)} />}
      {showPremiumModal && <PremiumModal user={user} onClose={() => setShowPremiumModal(false)} onUpgrade={() => {}} />}
      {showShopModal && <ShopModal user={user} onClose={() => setShowShopModal(false)} onBuy={() => {}} />}
      
      {selectedUserForModal && (
        <UserProfileModal 
          user={selectedUserForModal} 
          currentUser={user}
          onClose={() => setSelectedUserForModal(null)} 
          onFollow={() => toggleFollowColleague(user.id, selectedUserForModal.id)} 
          onChallenge={() => {
             setChallengeTargetOpponent(selectedUserForModal);
             setShowChallengeModal(true);
          }} 
        />
      )}

      {showChallengeModal && (
        <ChallengeModal 
          user={user} 
          opponent={challengeTargetOpponent} 
          challengeId={challengeIdToPlay}
          onClose={() => { setShowChallengeModal(false); setChallengeTargetOpponent(undefined); setChallengeIdToPlay(undefined); }} 
          onComplete={() => {}}
        />
      )}

      {showSearchModal && <UserSearchModal currentUser={user} onClose={() => setShowSearchModal(false)} onUserClick={setSelectedUserForModal} />}
      {showNotificationsModal && <NotificationsModal notifications={notifications} onClose={() => setShowNotificationsModal(false)} onMarkRead={() => {}} onPlayChallenge={(id) => { setChallengeIdToPlay(id); setShowChallengeModal(true); setShowNotificationsModal(false); }} />}
      
    </div>
  );
}
`;

content = content.replace(/return \([\s\S]*$/g, newRender);

fs.writeFileSync('src/App.tsx', content);
