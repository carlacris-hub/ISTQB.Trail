import React, { useState } from 'react';
import { ShieldCheck, LogIn, UserPlus, User, Sparkles, Award, ArrowRight, Lock, Check } from 'lucide-react';
import { translations, Language } from '../utils/i18n';
import { UserProfile } from '../types';
import { AppLogoIcon, AppLogoBanner } from './AppLogo';

interface WelcomeAuthScreenProps {
  language?: Language;
  onSelectOption: (option: 'login' | 'signup' | 'guest') => void;
  onToggleLanguage: (lang: Language) => void;
}

export const WelcomeAuthScreen: React.FC<WelcomeAuthScreenProps> = ({
  language = 'pt',
  onSelectOption,
  onToggleLanguage,
}) => {
  const t = translations[language];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between p-4 sm:p-6 relative overflow-hidden">
      
      {/* Background Ambient Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-md mx-auto w-full flex items-center justify-between pt-2">
        <div className="flex items-center gap-2">
          <AppLogoIcon className="w-8 h-8" />
          <span className="font-extrabold text-sm text-white tracking-wide">
            ISTQB Trail
          </span>
        </div>

        <button
          onClick={() => onToggleLanguage(language === 'pt' ? 'en' : 'pt')}
          className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-bold text-teal-400 hover:border-teal-500/50 transition uppercase"
        >
          {language}
        </button>
      </div>

      {/* Main Hero Card */}
      <div className="max-w-md mx-auto w-full my-auto py-8 space-y-6 text-center">
        
        {/* App Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-teal-400" />
          <span>Syllabus CTFL v4.0.1</span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            {t.welcomeHeroTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
            {t.welcomeHeroSubtitle}
          </p>
        </div>

        {/* Option Buttons Stack */}
        <div className="space-y-3 pt-4">
          
          {/* Option 1: Login */}
          <button
            onClick={() => onSelectOption('login')}
            className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-110 text-slate-950 font-extrabold text-sm shadow-xl shadow-teal-500/20 flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-3">
              <LogIn className="w-5 h-5 stroke-[2.5]" />
              <div className="text-left">
                <span className="block leading-none">{t.alreadyHaveAccount}</span>
                <span className="text-[10px] font-semibold opacity-80 block mt-0.5">{t.loadSavedProgress}</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option 2: Create Account */}
          <button
            onClick={() => onSelectOption('signup')}
            className="w-full py-3.5 px-5 rounded-2xl bg-slate-900 border border-teal-500/40 hover:border-teal-400 text-white font-extrabold text-sm shadow-lg flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-3">
              <UserPlus className="w-5 h-5 text-teal-400 stroke-[2.5]" />
              <div className="text-left">
                <span className="block leading-none">{t.createNewAccount}</span>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{t.unlockAllChapters}</span>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-400 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Option 3: Continue as Guest */}
          <button
            onClick={() => onSelectOption('guest')}
            className="w-full py-3 px-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-slate-400" />
              <div className="text-left">
                <span className="block leading-none">{t.continueGuestLabel}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">{t.guestAccessDesc}</span>
              </div>
            </div>
            <span className="text-[10px] font-semibold text-slate-500 group-hover:text-slate-300">{t.continueAsGuest} →</span>
          </button>

        </div>

      </div>

      {/* Footer Disclaimer */}
      <div className="max-w-md mx-auto w-full text-center text-[10px] text-slate-500 space-y-1 pb-2">
        <p>{t.alignedWithIstqb}</p>
      </div>

    </div>
  );
};
