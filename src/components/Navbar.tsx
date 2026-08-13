import React from 'react';
import { UserProfile } from '../types';
import { translations, Language } from '../utils/i18n';
import { AppLogoIcon } from './AppLogo';
import { Flame, Heart, Zap, Crown, Settings, Sparkles, Globe, User, HelpCircle, Search, Bell, Coins, ShoppingBag } from 'lucide-react';

interface NavbarProps {
  user: UserProfile;
  unreadNotifsCount?: number;
  onOpenPremium: () => void;
  onOpenShop?: () => void;
  onOpenSettings: () => void;
  onOpenAuth: () => void;
  onOpenTutorial: () => void;
  onToggleLanguage: (lang: Language) => void;
  onOpenSearch?: () => void;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  unreadNotifsCount = 0,
  onOpenPremium,
  onOpenShop,
  onOpenSettings,
  onOpenAuth,
  onOpenTutorial,
  onToggleLanguage,
  onOpenSearch,
  onOpenNotifications,
}) => {
  const lang = user.language || 'pt';
  const t = translations[lang];

  const isDoubleXpActive = (user.doubleXpActiveUntil || 0) > Date.now();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/98 backdrop-blur-md border-b border-slate-800 px-2.5 sm:px-4 py-2 text-white shadow-lg w-full max-w-full overflow-x-hidden">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 shrink">
          <AppLogoIcon className="w-8 h-8 sm:w-9 sm:h-9 shrink-0" />
          <div className="min-w-0">
            <h1 className="font-extrabold text-xs sm:text-base tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent truncate">
              {t.appTitle}
            </h1>
            <span className="hidden xs:block text-[8px] sm:text-[10px] font-semibold text-teal-400 uppercase tracking-wider leading-none mt-0.5 truncate">
              {t.appSubtitle}
            </span>
          </div>
        </div>

        {/* Gamification & Social Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          
          {/* Double XP Badge */}
          {isDoubleXpActive && (
            <div className="hidden md:flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-2 py-0.5 rounded-full font-black text-[10px] animate-pulse shadow shrink-0">
              <Zap className="w-3 h-3 fill-slate-950 text-slate-950" />
              <span>2x XP</span>
            </div>
          )}

          {/* Social Search Button */}
          {onOpenSearch && (
            <button
              onClick={onOpenSearch}
              className="p-1 sm:p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-teal-500/50 transition shrink-0"
              title={t.searchColleagues}
            >
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
            </button>
          )}

          {/* Notifications Bell Icon */}
          {onOpenNotifications && (
            <button
              onClick={onOpenNotifications}
              className="relative p-1 sm:p-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300 hover:text-white hover:border-teal-500/50 transition shrink-0"
              title={t.notificationsTitle}
            >
              <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-rose-500 text-white font-extrabold text-[8px] sm:text-[9px] flex items-center justify-center shadow-md animate-bounce">
                  {unreadNotifsCount}
                </span>
              )}
            </button>
          )}

          {/* Shop Icon Button (No Text Counter) */}
          <button
            onClick={onOpenShop || onOpenPremium}
            className="p-1.5 sm:p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30 transition shadow-sm shrink-0 flex items-center justify-center"
            title={lang === 'en' ? 'QA Shop & Premium Plans' : 'Loja de Vantagens e Planos Premium'}
          >
            <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-400 fill-amber-400/20 stroke-[2.5]" />
          </button>

          {/* Streak */}
          <div className="flex items-center gap-1 bg-amber-950/40 border border-amber-800/40 px-1.5 py-1 rounded-full text-[10px] sm:text-xs font-bold text-amber-400 shadow-inner shrink-0">
            <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500 text-amber-500 animate-pulse" />
            <span>{user.streakDays}d</span>
          </div>

          {/* Lives (Hearts / Infinite) */}
          <button
            onClick={onOpenShop || onOpenPremium}
            className={`flex items-center gap-1 px-1.5 sm:px-2.5 py-1 rounded-full text-[10px] sm:text-xs font-bold transition-all shrink-0 ${
              user.plan === 'premium'
                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-300'
                : user.livesCurrent === 0
                ? 'bg-rose-950/80 border border-rose-600 text-rose-400 animate-bounce'
                : 'bg-rose-950/40 border border-rose-800/40 text-rose-400'
            }`}
            title={user.plan === 'premium' ? 'Vidas Infinitas (Premium)' : 'Vidas disponíveis - Clique para recarregar na Loja'}
          >
            <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${user.plan === 'premium' ? 'fill-amber-400 text-amber-400' : 'fill-rose-500 text-rose-500'}`} />
            <span>{user.plan === 'premium' ? '∞' : `${user.livesCurrent}/${user.livesMax}`}</span>
          </button>

          {/* User Auth Button */}
          <button
            onClick={onOpenAuth}
            className={`p-1 sm:p-1.5 rounded-lg border text-[10px] sm:text-xs font-bold transition flex items-center gap-1 shrink-0 ${
              user.isLoggedIn
                ? 'bg-teal-950/60 border-teal-500/40 text-teal-300'
                : 'bg-slate-800 border-slate-700 text-slate-200 hover:border-teal-500'
            }`}
            title={user.isLoggedIn ? `Conectado como ${user.name}` : t.login}
          >
            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-400" />
            <span className="hidden md:inline text-[11px] truncate max-w-[80px]">
              {user.isLoggedIn ? user.name.split(' ')[0] : t.login}
            </span>
          </button>

        </div>

      </div>
    </header>
  );
};
