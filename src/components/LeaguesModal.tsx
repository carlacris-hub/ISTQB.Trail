import React from 'react';
import { UserProfile } from '../types';
import { LEAGUE_TIERS, getLeagueFromXp, formatXp, LeagueTier } from '../utils/leagueUtils';
import { 
  X, Trophy, Shield, Award, Zap, Gem, Sparkles, Flame, Crown, CheckCircle2, Lock, ChevronRight, Info
} from 'lucide-react';
import { translations } from '../utils/i18n';

interface LeaguesModalProps {
  user: UserProfile;
  onClose: () => void;
}

export const LeaguesModal: React.FC<LeaguesModalProps> = ({ user, onClose }) => {
  const lang = user.language || 'pt';
  const t = translations[lang];

  const leagueInfo = getLeagueFromXp(user.xpTotal);
  const { currentTier, nextTier, progressPercent, xpRemaining } = leagueInfo;

  const renderIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'shield': return <Shield className={className} />;
      case 'award': return <Award className={className} />;
      case 'trophy': return <Trophy className={className} />;
      case 'zap': return <Zap className={className} />;
      case 'gem': return <Gem className={className} />;
      case 'sparkles': return <Sparkles className={className} />;
      case 'flame': return <Flame className={className} />;
      case 'crown': return <Crown className={className} />;
      default: return <Trophy className={className} />;
    }
  };

  // Group tiers dynamically by League Name
  const leagueGroups = Array.from(new Set(LEAGUE_TIERS.map(t => t.leagueName)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {lang === 'en' ? 'League Progression' : 'Sistema de Ligas & Progressão'}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {lang === 'en' ? 'Earn XP in lessons, duels & clans to advance tiers' : 'Ganhe XP em lições, duelos PvP e clãs para subir de liga'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          
          {/* Current Tier Status Card */}
          <div className={`bg-gradient-to-r ${currentTier.colorGradient} border p-5 rounded-2xl shadow-xl relative overflow-hidden text-white space-y-3`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest bg-slate-950/40 px-2.5 py-0.5 rounded-full text-amber-300 border border-amber-400/30 inline-block mb-1">
                  {lang === 'en' ? 'YOUR CURRENT TIER' : 'SUA LIGA ATUAL'}
                </span>
                <h2 className="text-2xl font-black text-white drop-shadow-md flex items-center gap-2">
                  {renderIcon(currentTier.iconName, 'w-7 h-7 text-amber-300')}
                  <span>Liga {currentTier.name}</span>
                </h2>
                <p className="text-xs text-slate-200 mt-0.5 font-medium">
                  {lang === 'en' ? 'Total XP:' : 'XP Acumulado:'} <strong className="text-amber-300 font-black">{user.xpTotal.toLocaleString()} XP</strong>
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-slate-950/40 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20 shadow-inner shrink-0">
                {renderIcon(currentTier.iconName, 'w-8 h-8')}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-extrabold">
                <span className="text-slate-200">
                  {nextTier 
                    ? (lang === 'en' ? `Next Tier: ${nextTier.name}` : `Próximo Nível: ${nextTier.name}`)
                    : (lang === 'en' ? 'MAX TIER REACHED!' : 'NÍVEL MÁXIMO ALCANÇADO!')}
                </span>
                <span className="text-amber-300 font-black">
                  {nextTier ? `${xpRemaining.toLocaleString()} XP restantes` : 'Lendário 1'}
                </span>
              </div>

              <div className="w-full bg-slate-950/60 rounded-full h-3 p-0.5 border border-white/10">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-500 shadow-md"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* XP Sources Info Box */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black text-teal-400">
              <Zap className="w-4 h-4" />
              <span>{lang === 'en' ? 'How to Earn XP and Rank Up:' : 'Como Ganhar XP e Subir de Liga:'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300 font-medium">
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800/80 flex items-center gap-2">
                <span className="text-amber-400 font-black shrink-0">+20-100 XP</span>
                <span>Lições do Syllabus ISTQB</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800/80 flex items-center gap-2">
                <span className="text-amber-400 font-black shrink-0">+100 XP</span>
                <span>Vitórias em Duelos 1v1 PvP</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800/80 flex items-center gap-2">
                <span className="text-amber-400 font-black shrink-0">+150 XP</span>
                <span>Aprovação em Simulados</span>
              </div>
              <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800/80 flex items-center gap-2">
                <span className="text-amber-400 font-black shrink-0">+50-200 XP</span>
                <span>Missões de Clã & Sequência</span>
              </div>
            </div>
          </div>

          {/* All Leagues Hierarchy List */}
          <div className="space-y-4">
            <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>{lang === 'en' ? 'All League Tiers (Exponential XP Requirements)' : 'Todas as Ligas & Requisitos de XP'}</span>
            </h4>

            <div className="space-y-4">
              {leagueGroups.map((groupName) => {
                const groupTiers = LEAGUE_TIERS.filter(t => t.leagueName === groupName);
                if (groupTiers.length === 0) return null;

                return (
                  <div key={groupName} className="space-y-2">
                    <div className="flex items-center gap-2 border-b border-slate-800 pb-1">
                      {renderIcon(groupTiers[0].iconName, 'w-4 h-4 text-amber-400')}
                      <span className="text-xs font-black text-white uppercase tracking-wider">
                        Liga {groupName}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {groupTiers.map((tier) => {
                        const isUnlocked = user.xpTotal >= tier.minXp;
                        const isCurrent = currentTier.id === tier.id;

                        return (
                          <div
                            key={tier.id}
                            className={`p-3 rounded-2xl border transition relative flex flex-col justify-between gap-2 ${
                              isCurrent
                                ? 'bg-amber-950/80 border-amber-400 ring-2 ring-amber-400/50 shadow-lg shadow-amber-500/10'
                                : isUnlocked
                                ? 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                                : 'bg-slate-950/30 border-slate-800/50 opacity-60'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-lg ${tier.badgeBg} flex items-center justify-center text-white border ${tier.borderColor}`}>
                                  {renderIcon(tier.iconName, 'w-4 h-4')}
                                </div>
                                <div>
                                  <h5 className={`text-xs font-black ${isCurrent ? 'text-amber-300' : 'text-white'}`}>
                                    {tier.name}
                                  </h5>
                                  <span className="text-[10px] text-slate-400 font-bold block">
                                    {tier.minXp === 0 ? '0 XP (Inicial)' : `${tier.minXp.toLocaleString()} XP`}
                                  </span>
                                </div>
                              </div>

                              <div>
                                {isCurrent ? (
                                  <span className="text-[9px] font-black bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full shadow-sm">
                                    ATUAL
                                  </span>
                                ) : isUnlocked ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                ) : (
                                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <span>{lang === 'en' ? 'Start at Bronze 3 and reach Lendário 1!' : 'Inicie no Bronze 3 e conquiste Lendário 1!'}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold transition"
          >
            {lang === 'en' ? 'Close' : 'Entendido'}
          </button>
        </div>

      </div>
    </div>
  );
};
