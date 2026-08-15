import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    fetchAllFirestoreUsers().then(fsUsers => {
      if (fsUsers && fsUsers.length > 0) {
        syncFirestoreUsersToColleagues(fsUsers);
      }
    });
  }, []);

  const handleSelectAuthOption = (option: 'login' | 'signup' | 'guest') => {
    if (option === 'guest') {
      setUser(prev => ({ ...prev, authProvider: 'guest', isLoggedIn: false, hasChosenInitialAuth: true }));
      setShowConsentModal(true);
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = (updates: Partial<UserProfile>, isNew: boolean) => {
    setUser(prev => ({ ...prev, ...updates, isLoggedIn: true }));
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(getDefaultUser());
    } catch (e) {
      console.error(e);
    }
  };

  if (!user.hasChosenInitialAuth) {
    return <WelcomeAuthScreen onSelectOption={handleSelectAuthOption} onLanguageChange={(l) => setUser(prev => ({...prev, language: l}))} lang={user.language || 'pt'} />;
  }

  return (`;

content = content.replace(/    \}\);\n\n      return \(/, replacement);

fs.writeFileSync('src/App.tsx', content);
