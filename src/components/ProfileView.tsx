import React from 'react';
import { UserProfile, MockExamResult } from '../types';
import { ISTQB_CHAPTERS } from '../data/istqbContent';
import { translations, Language } from '../utils/i18n';
import { getCountryPricing, formatPrice } from '../utils/pricing';
import { calculateFollowersCount } from '../utils/socialStorage';
import { getLeagueFromXp } from '../utils/leagueUtils';
import { 
  User, Award, Zap, Flame, Heart, Crown, Shield, RefreshCw, CheckCircle2, ChevronRight, Settings, Sparkles, Globe, LogOut, HelpCircle, LogIn, Download, FileText, ExternalLink, Coins
} from 'lucide-react';

interface ProfileViewProps {
  user: UserProfile;
  mockExamHistory: MockExamResult[];
  onOpenPremium: () => void;
  onRechargeLives: () => void;
  onAddDevXp: (amount: number) => void;
  onResetProgress: () => void;
  onOpenAuth: () => void;
  onOpenTutorial: () => void;
  onToggleLanguage: (lang: Language) => void;
  onLogout: () => void;
  onOpenEditProfile?: () => void;
  onOpenSearch?: () => void;
  onOpenFollowing?: () => void;
  onOpenFollowers?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  mockExamHistory,
  onOpenPremium,
  onRechargeLives,
  onAddDevXp,
  onResetProgress,
  onOpenAuth,
  onOpenTutorial,
  onToggleLanguage,
  onLogout,
  onOpenEditProfile,
  onOpenSearch,
  onOpenFollowing,
  onOpenFollowers,
}) => {
  const lang = user.language || 'pt';
  const t = translations[lang];
  const passedExamsCount = mockExamHistory.filter(h => h.passed).length;
  const countryPricing = getCountryPricing(user.country);
  const userFollowersCount = calculateFollowersCount(user.id);

  return (
    <div className="pb-24 pt-4 px-4 max-w-xl mx-auto space-y-6">
      
      {/* User Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-slate-100 space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500/50 shadow-lg shrink-0 bg-slate-800"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-black text-white truncate">{user.name}</h2>
                <span className="text-xs font-mono font-extrabold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                  @{user.username || 'candidato123'}
                </span>
                {user.plan === 'premium' && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full shadow-sm shrink-0">
                    <Crown className="w-3 h-3 fill-slate-950" /> PRO
                  </span>
                )}
              </div>

              {user.company ? (
                <p className="text-xs font-bold text-teal-400 flex items-center gap-1 mt-0.5 truncate">
                  <User className="w-3.5 h-3.5" />
                  <span>{user.company}</span>
                </p>
              ) : (
                <p className="text-xs text-teal-400 font-bold mt-0.5">
                  {lang === 'en' ? `Level ${user.level}: ${user.levelTitle}` : `Nível ${user.level}: ${user.levelTitle}`}
                </p>
              )}

              <p className="text-xs text-slate-300 mt-1 max-w-xs leading-relaxed line-clamp-2">
                {user.bio || (lang === 'en' ? 'Preparing for official ISTQB CTFL v4.0 certification.' : 'Preparando para a certificação oficial ISTQB CTFL v4.0.')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-800 shrink-0">
            {onOpenEditProfile && (
              <button
                onClick={onOpenEditProfile}
                className="px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 text-teal-300 text-xs font-bold transition flex items-center gap-1"
              >
                <span>{t.editProfile}</span>
              </button>
            )}

            <button
              onClick={user.isLoggedIn ? onLogout : onOpenAuth}
              className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-500 text-slate-200 text-xs font-bold transition flex items-center gap-1.5"
            >
              {user.isLoggedIn ? <LogOut className="w-3.5 h-3.5 text-rose-400" /> : <LogIn className="w-3.5 h-3.5 text-teal-400" />}
              <span>{user.isLoggedIn ? t.logout : t.login}</span>
            </button>
          </div>
        </div>

        {/* Social Counters */}
        <div className="flex items-center justify-around bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 text-center">
          <button 
            onClick={onOpenFollowing || onOpenSearch} 
            className="hover:opacity-80 transition cursor-pointer group"
          >
            <span className="text-sm font-black text-white group-hover:text-teal-400 transition block">
              {(user.followingIds || []).length}
            </span>
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-teal-300 uppercase tracking-wider block">
              {t.following}
            </span>
          </button>

          <div className="w-px h-6 bg-slate-800" />

          <button 
            onClick={onOpenFollowers || onOpenSearch} 
            className="hover:opacity-80 transition cursor-pointer group"
          >
            <span className="text-sm font-black text-white group-hover:text-teal-400 transition block">
              {userFollowersCount}
            </span>
            <span className="text-[10px] font-bold text-slate-400 group-hover:text-teal-300 uppercase tracking-wider block">
              {t.followers}
            </span>
          </button>

          <div className="w-px h-6 bg-slate-800" />

          <div>
            <span className="text-sm font-black text-amber-400 block">{getLeagueFromXp(user.xpTotal).currentTier.name}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{lang === 'en' ? 'League' : 'Liga'}</span>
          </div>
        </div>

      </div>

      {/* Moedas QA & Country Pricing Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Coins Wallet Card */}
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-amber-950/30 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <Coins className="w-5 h-5 fill-amber-400/30" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-400 uppercase tracking-wider block">
                {lang === 'en' ? 'App Currency' : 'Moeda do App'}
              </span>
              <h4 className="text-base font-black text-white leading-none">
                {user.coins || 0} <span className="text-xs text-amber-300 font-bold">{lang === 'en' ? 'QA Coins' : 'Moedas QA'}</span>
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {lang === 'en' ? '300 Coins = 1 Extra Mock Exam' : '300 Moedas = 1 Simulado Extra'}
              </p>
            </div>
          </div>

          <button
            onClick={onOpenPremium}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs shadow-md shadow-amber-500/20 transition shrink-0"
          >
            {lang === 'en' ? 'Shop' : 'Loja'}
          </button>
        </div>

        {/* Country & Regional Currency Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <span className="text-2xl shrink-0">{countryPricing.flag}</span>
            <div>
              <span className="text-[10px] font-extrabold text-teal-400 uppercase tracking-wider block">
                País & Moeda
              </span>
              <h4 className="text-sm font-extrabold text-white leading-none">
                {countryPricing.name} ({countryPricing.currencyCode})
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Plano: {formatPrice(countryPricing.premiumMonthly, countryPricing)}/mês
              </p>
            </div>
          </div>

          {onOpenEditProfile && (
            <button
              onClick={onOpenEditProfile}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-teal-500/50 text-slate-300 text-xs font-bold transition shrink-0"
            >
              Alterar
            </button>
          )}
        </div>
      </div>

      {/* Active Boosts & Streak Multipliers */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span className="text-xs font-bold text-slate-200">Bônus de Ofensiva (Streak)</span>
          </div>
          <span className="text-xs font-black text-amber-400">
            +{Math.min(20, Math.floor((user.streakDays || 0) / 10) * 1.0).toFixed(1)}% XP Extra
          </span>
        </div>
        <p className="text-[10px] text-slate-400 leading-snug">
          {lang === 'en'
            ? 'Each 10 consecutive active days adds a +1.0% passive XP bonus to all exercises and PvP battles.'
            : 'A cada 10 dias seguidos de estudo, você ganha +1,0% de fração de XP extra acumulado em todas as atividades.'}
        </p>

        {(user.doubleXpActiveUntil || 0) > Date.now() && (
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
              <span className="font-extrabold text-amber-300">Bônus 2x XP Ativo</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
              Restam ~{Math.max(0, Math.ceil(((user.doubleXpActiveUntil || 0) - Date.now()) / (1000 * 60 * 60)))}h
            </span>
          </div>
        )}
      </div>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-teal-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-white">{t.language}</h4>
            <p className="text-[10px] text-slate-400">
              {lang === 'pt' ? t.portuguese : t.english}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleLanguage(lang === 'pt' ? 'en' : 'pt')}
            className="px-3 py-1.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-300 font-bold text-xs hover:bg-teal-500/20 transition"
          >
            {lang === 'pt' ? 'Mudar p/ EN' : 'Switch to PT'}
          </button>

          <button
            onClick={onOpenTutorial}
            className="px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-teal-500/50 text-slate-200 font-bold text-xs transition flex items-center gap-1"
          >
            <HelpCircle className="w-3.5 h-3.5 text-teal-400" />
            <span>Tutorial</span>
          </button>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
          <Zap className="w-5 h-5 text-emerald-400 fill-emerald-400 mx-auto mb-1" />
          <span className="text-lg font-black text-white block">{user.xpTotal}</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Total XP</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
          <Flame className="w-5 h-5 text-amber-400 fill-amber-400 mx-auto mb-1 animate-pulse" />
          <span className="text-lg font-black text-white block">{user.streakDays} Dias</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Streak Diário</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
          <Award className="w-5 h-5 text-teal-400 mx-auto mb-1" />
          <span className="text-lg font-black text-white block">{user.unlockedBadgeIds.length}/{ISTQB_CHAPTERS.length}</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Badges</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-center">
          <CheckCircle2 className="w-5 h-5 text-indigo-400 mx-auto mb-1" />
          <span className="text-lg font-black text-white block">{passedExamsCount}</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase">Simulados Aprovados</span>
        </div>
      </div>

      {/* Official Syllabus PDF Download Card */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-500/40 rounded-2xl p-5 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
              {lang === 'en' ? 'Official ISTQB Documentation' : 'Documentação Oficial ISTQB'}
            </span>
            <h3 className="text-sm font-extrabold text-white">
              Syllabus CTFL v4.0.1 (PDF)
            </h3>
            <p className="text-[11px] text-slate-300">
              {lang === 'en' ? 'Always up to date directly from the official certification page.' : 'Sempre atualizado direto da página oficial da certificação.'}
            </p>
          </div>
        </div>

        <a
          href="https://istqb.org/certifications/certified-tester-foundation-level-ctfl-v4-0/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shrink-0 shadow-lg shadow-teal-500/20"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>{lang === 'en' ? 'Download PDF' : 'Baixar PDF'}</span>
        </a>
      </div>

      {/* Badges Showcase Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-400" /> Conquistas de Capítulos ISTQB
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {ISTQB_CHAPTERS.map(ch => {
            const isUnlocked = user.unlockedBadgeIds.includes(ch.badge.id);

            return (
              <div
                key={ch.badge.id}
                className={`p-3 rounded-xl border text-center transition ${
                  isUnlocked
                    ? 'bg-amber-950/20 border-amber-500/50 text-amber-200'
                    : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-60'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl mx-auto flex items-center justify-center mb-1.5 ${
                  isUnlocked ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/20' : 'bg-slate-800 text-slate-600'
                }`}>
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-white truncate">{ch.badge.name}</h4>
                <span className="text-[9px] text-slate-400 block line-clamp-1 mt-0.5">{ch.badge.description}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testing & Developer Control Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Settings className="w-4 h-4 text-teal-400" /> Controles do Candidato / Teste
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <button
            onClick={onRechargeLives}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/50 text-rose-300 font-semibold flex items-center justify-between transition"
          >
            <span>Recarregar Vidas (5/5)</span>
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </button>

          <button
            onClick={() => onAddDevXp(100)}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-emerald-300 font-semibold flex items-center justify-between transition"
          >
            <span>Adicionar +100 XP (Teste)</span>
            <Zap className="w-4 h-4 fill-emerald-400 text-emerald-400" />
          </button>

          <button
            onClick={onOpenPremium}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-amber-300 font-semibold flex items-center justify-between transition"
          >
            <span>Alternar Plano (Free / Premium)</span>
            <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
          </button>

          <button
            onClick={onResetProgress}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-700 text-rose-400 font-semibold flex items-center justify-between transition"
          >
            <span>Resetar Progresso</span>
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
