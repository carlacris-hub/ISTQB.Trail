import React, { useState } from 'react';
import { UserProfile } from '../types';
import { translations, Language } from '../utils/i18n';
import { User, Mail, Lock, Sparkles, Check, ArrowRight, ShieldCheck, Globe, AlertCircle, LogOut, X } from 'lucide-react';
import { AppLogoIcon } from './AppLogo';
import { supabase } from '../lib/supabase';

interface AuthModalProps {
  user: UserProfile;
  onClose: () => void;
  onAuthSuccess: (userUpdate: Partial<UserProfile>, isNewAccount: boolean) => void;
  onLanguageChange: (lang: Language) => void;
  onLogout?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  user,
  onClose,
  onAuthSuccess,
  onLanguageChange,
  onLogout,
}) => {
  const lang = user.language || 'pt';
  const t = translations[lang];

  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // If user is already logged in, show ONLY the logout option
  if (user.isLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl text-slate-100 relative">
          
          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 via-teal-950/30 to-slate-900 p-6 text-center border-b border-slate-800 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white border border-slate-800 transition"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative inline-block mb-3">
              <img
                src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user.name}
                className="w-16 h-16 rounded-2xl object-cover mx-auto border-2 border-teal-500/50 shadow-lg"
              />
            </div>

            <h3 className="text-lg font-black text-white">{user.name}</h3>
            {user.username && (
              <span className="text-xs font-mono font-bold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20 inline-block mt-1">
                @{user.username}
              </span>
            )}
            {user.email && (
              <p className="text-xs text-slate-400 mt-1 truncate max-w-[240px] mx-auto">{user.email}</p>
            )}
          </div>

          {/* Body with Logout only */}
          <div className="p-6 space-y-3">
            <button
              onClick={() => {
                if (onLogout) onLogout();
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg shadow-rose-600/20 transition flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4 stroke-[2.5]" />
              <span>{lang === 'en' ? 'Log Out' : 'Sair da Conta'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
            >
              {lang === 'en' ? 'Cancel' : 'Cancelar'}
            </button>
          </div>

        </div>
      </div>
    );
  }

  const handleEmailAuth = async (e) => {
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
  };

  const handleGoogleAuth = async () => {
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
  };

  const handleGuestAuth = () => {
    onAuthSuccess({
      isLoggedIn: true,
      authProvider: 'guest',
      hasCompletedTutorial: false,
    }, false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl text-slate-100 relative">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-slate-900 via-teal-950/40 to-slate-900 p-6 text-center border-b border-slate-800 relative">
          
          {/* Language Toggle */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-[11px]">
            <button
              onClick={() => onLanguageChange('pt')}
              className={`px-2 py-1 rounded-lg font-bold transition ${
                lang === 'pt' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              PT
            </button>
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2 py-1 rounded-lg font-bold transition ${
                lang === 'en' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          <div className="flex justify-center mb-3">
            <AppLogoIcon className="w-14 h-14" />
          </div>

          <h2 className="text-xl font-black text-white tracking-tight">
            {mode === 'login' ? t.welcomeBack : t.createAccount}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {t.officialSyllabus}
          </p>

          {/* Mode Switcher Tabs */}
          <div className="mt-4 inline-flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setMode('signup')}
              className={`px-4 py-1.5 rounded-lg font-bold transition ${
                mode === 'signup'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.signup}
            </button>
            <button
              onClick={() => setMode('login')}
              className={`px-4 py-1.5 rounded-lg font-bold transition ${
                mode === 'login'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.login}
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition flex items-center justify-center gap-3"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{t.loginWithGoogle}</span>
          </button>

          <div className="flex items-center gap-3 text-slate-600 text-xs my-2">
            <div className="flex-1 h-px bg-slate-800" />
            <span>{t.or}</span>
            <div className="flex-1 h-px bg-slate-800" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                E-mail
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 block mb-1">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passwordPlaceholder}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-teal-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2 mt-2"
            >
              <span>{mode === 'signup' ? t.signup : t.login}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Guest Mode Link */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleGuestAuth}
              className="text-xs text-slate-400 hover:text-teal-400 font-semibold underline underline-offset-4 transition"
            >
              {t.continueAsGuest}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
