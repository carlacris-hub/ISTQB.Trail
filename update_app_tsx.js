import fs from 'fs';

let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
  "import { auth, onAuthStateChanged, firebaseSignOut, testFirestoreConnection } from './lib/firebase';",
  "import { supabase } from './lib/supabase';"
);

// testFirestoreConnection is missing now, I should just remove its call.
content = content.replace(/testFirestoreConnection\(\);\n?/g, '');

content = content.replace(
  /const unsubscribeAuth = onAuthStateChanged\(auth, async \(fbUser\) => \{[\s\S]*?\}\);/,
  `const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      const fbUser = session?.user;
      if (fbUser) {
        // Authenticated
        const uId = fbUser.id;
        try {
          const profile = await loadUserProfileFromFirestore(uId);
          if (profile) {
            setUser(prev => ({ ...prev, ...profile, isLoggedIn: true, uid: uId, id: uId }));
            
            // Re-subscribe to progress
            if (window.unsubProgress) window.unsubProgress();
            window.unsubProgress = subscribeToUserProfile(uId, (updated) => {
              setUser(prev => ({ ...prev, ...updated }));
            });
            
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
    };`
);

content = content.replace(
  /await firebaseSignOut\(auth\);/,
  `await supabase.auth.signOut();`
);

fs.writeFileSync('src/App.tsx', content);
