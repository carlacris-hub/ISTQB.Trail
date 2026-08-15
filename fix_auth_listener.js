import fs from 'fs';
let content = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `  // Firebase Auth State Listener & Realtime Firestore Sync
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const fbUser = session?.user;
      if (fbUser) {
        // Authenticated
        const uId = fbUser.id;
        try {
          const profile = await loadUserProfileFromFirestore(uId);
          if (profile) {
            setUser(prev => ({ ...prev, ...profile, isLoggedIn: true, uid: uId, id: uId }));
          } else {
            // New user missing firestore profile
            const newProfile = {
              ...user,
              uid: uId,
              id: uId,
              email: fbUser.email || '',
              name: fbUser.user_metadata?.full_name || 'Usuário ISTQB',
              isLoggedIn: true
            };
            setUser(newProfile);
            await saveUserProfileToFirestore(newProfile);
          }
        } catch (err) {
          console.error("Error loading user post-login:", err);
        }
      } else {
        // Logged out
        if (user.isLoggedIn && user.authProvider !== 'guest') {
          setUser(getDefaultUser());
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);`;

content = content.replace(/  \/\/ Firebase Auth State Listener & Realtime Firestore Sync[\s\S]*?  \}, \[\]\);/m, replacement);

fs.writeFileSync('src/App.tsx', content);
