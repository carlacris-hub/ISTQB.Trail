import fs from 'fs';

let content = fs.readFileSync('src/components/AuthModal.tsx', 'utf8');

content = content.replace(
  "import { auth, googleProvider, signInWithPopup } from '../lib/firebase';",
  "import { supabase } from '../lib/supabase';"
);

content = content.replace(
  "import {\n  signInWithEmailAndPassword,\n  createUserWithEmailAndPassword,\n  updateProfile\n} from 'firebase/auth';",
  ""
);

content = content.replace(
  /const handleGoogleAuth = async \(\) => \{[\s\S]*?catch \(err: any\) \{[\s\S]*?\}[\s\S]*?\};/,
  `const handleGoogleAuth = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
      // Note: Redirect handles the rest in onAuthStateChanged
    } catch (err) {
      console.error('Google Auth Error:', err);
      setErrorMsg(t.loginError || 'Authentication failed');
      setLoading(false);
    }
  };`
);

content = content.replace(
  /const handleEmailAuth = async \(e: React\.FormEvent\) => \{[\s\S]*?catch \(err: any\) \{[\s\S]*?\}[\s\S]*?\};/,
  `const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            }
          }
        });
        if (error) throw error;
        
        if (data.user) {
          onAuthSuccess({
            uid: data.user.id,
            id: data.user.id,
            email: data.user.email,
            name: name || data.user.user_metadata?.full_name || 'Usuário',
            isLoggedIn: true,
            authProvider: 'email',
          }, true);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        if (data.user) {
          onAuthSuccess({
            uid: data.user.id,
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || 'Usuário',
            isLoggedIn: true,
            authProvider: 'email',
          }, false);
        }
      }
    } catch (err) {
      console.error('Auth Error:', err);
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };`
);

fs.writeFileSync('src/components/AuthModal.tsx', content);
