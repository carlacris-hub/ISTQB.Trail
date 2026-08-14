import React, { useState } from 'react';
import { UserProfile, LeaderboardUser } from '../types';
import { getLeaderboard } from '../utils/storage';
import { getLeagueFromXp } from '../utils/leagueUtils';
import { LeaguesModal } from './LeaguesModal';
import { 
  Trophy, Award, Zap, ArrowUpRight, ArrowDownRight, Search, Globe, UserCheck, UserPlus, Swords, Building2, ChevronRight, Plus 
} from 'lucide-react';
import { translations } from '../utils/i18n';

interface LeaderboardViewProps {
  user: UserProfile;
  onSelectUser: (selectedUser: LeaderboardUser) => void;
  onToggleFollow: (targetUserId: string, targetUserObj?: LeaderboardUser) => void;
  onStartChallenge: (targetUser: LeaderboardUser) => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  user,
  onSelectUser,
  onToggleFollow,
  onStartChallenge,
}) => {
  const lang = user.language || 'pt';
  const t = translations[lang];

  const [filterMode, setFilterMode] = useState<'global' | 'following'>('global');
  const [searchQuery, setSearchQuery] = useState('');
  const [showLeaguesModal, setShowLeaguesModal] = useState(false);

  const rawLeaderboard = getLeaderboard(user, filterMode);
  const leagueInfo = getLeagueFromXp(user.xpTotal);
  const { currentTier, nextTier, progressPercent } = leagueInfo;

  // Filter search query
  const leaderboard = rawLeaderboard.filter(u => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      (u.company && u.company.toLowerCase().includes(q))
    );
  });

  return (
    <div className="pb-24 pt-4 px-4 max-w-xl mx-auto space-y-6">
      
      {/* League Header Banner */}
      <div className={`bg-gradient-to-r ${currentTier.colorGradient} border p-5 rounded-3xl shadow-2xl text-white relative overflow-hidden space-y-3`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-slate-950/40 px-2.5 py-0.5 rounded-full text-amber-300 border border-amber-400/30 inline-block mb-1">
              {lang === 'en' ? 'Weekly League' : 'Liga Semanal ISTQB'}
            </span>
            <h2 className="text-2xl font-black text-white drop-shadow-md">
              Liga {currentTier.name}
            </h2>
            <p className="text-xs text-slate-200 mt-1 max-w-xs font-medium leading-relaxed">
              {t.leaderboardSubtitle}
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-slate-950/40 backdrop-blur-md flex items-center justify-center text-amber-300 border border-white/20 shadow-inner shrink-0">
            <Trophy className="w-8 h-8 fill-amber-300 text-amber-300 animate-pulse" />
          </div>
        </div>

        {/* Plus (+) Button below information of current league to see available tiers */}
        <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex justify-between text-[11px] font-bold text-slate-200">
              <span>{nextTier ? (lang === 'en' ? `Next: ${nextTier.name}` : `Próximo: ${nextTier.name}`) : (lang === 'en' ? 'Max Tier' : 'Nível Máximo')}</span>
              <span className="text-amber-300 font-extrabold">{user.xpTotal.toLocaleString()} XP</span>
            </div>
            <div className="w-full bg-slate-950/60 rounded-full h-2 p-0.5">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>

          <button
            onClick={() => setShowLeaguesModal(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-amber-400/60 hover:border-amber-400 text-amber-300 font-black text-xs transition flex items-center gap-1.5 shrink-0 shadow-lg group cursor-pointer"
            title={lang === 'en' ? 'View All Available League Tiers' : 'Ver Todos os Níveis de Ligas Disponíveis'}
          >
            <Plus className="w-4 h-4 text-amber-400 group-hover:scale-125 transition-transform" />
            <span>{lang === 'en' ? 'View Tiers' : 'Ver Níveis'}</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs: Global vs Following */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
        <button
          onClick={() => setFilterMode('global')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
            filterMode === 'global'
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>{t.globalRanking}</span>
        </button>

        <button
          onClick={() => setFilterMode('following')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
            filterMode === 'following'
              ? 'bg-teal-500 text-slate-950 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>{t.followingRanking} ({(user.followingIds || []).length})</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 shadow-inner"
        />
      </div>

      {/* Leaderboard Users List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-slate-400">
          <span>{lang === 'en' ? 'Rank / QA Candidate' : 'Posição / Candidato QA'}</span>
          <span>XP Total</span>
        </div>

        <div className="space-y-2">
          {leaderboard.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              {filterMode === 'following'
                ? (lang === 'en' ? 'You are not following any QA colleagues yet. Search for friends above to follow them!' : 'Você ainda não segue nenhum colega QA. Busque por colegas no botão acima para acompanhá-los!')
                : (lang === 'en' ? 'No candidates found.' : 'Nenhum candidato encontrado.')}
            </div>
          ) : (
            leaderboard.map((u, idx) => {
              const isUser = u.isCurrentUser;
              const isFollowing = u.isFollowing;

              return (
                <div
                  key={`${u.id}-${idx}`}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition ${
                    isUser
                      ? 'bg-teal-950/60 border-teal-500/70 ring-1 ring-teal-500/30 shadow-md'
                      : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div 
                    onClick={() => onSelectUser(u)}
                    className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                  >
                    {/* Rank Number */}
                    <div className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 ${
                      u.rank === 1
                        ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20'
                        : u.rank === 2
                        ? 'bg-slate-300 text-slate-950'
                        : u.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {u.rank}
                    </div>

                    <img
                      src={u.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={u.name}
                      className="w-8 h-8 rounded-xl object-cover border border-slate-800 shrink-0"
                    />

                    <div className="min-w-0 flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-1.5 w-full">
                        <h4 className={`text-sm font-bold truncate ${isUser ? 'text-teal-300 font-extrabold' : 'text-white'}`}>
                          {u.name}
                        </h4>
                        {isUser && (
                          <span className="text-[9px] font-extrabold bg-teal-500 text-slate-950 px-1.5 py-0.5 rounded shrink-0">
                            VOCÊ
                          </span>
                        )}
                      </div>

                      {u.username && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 w-full truncate mt-0.5">
                          <span className="text-teal-400 font-mono truncate">
                            @{u.username}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* XP & View More Action */}
                  <div 
                    onClick={() => onSelectUser(u)}
                    className="flex items-center gap-2 shrink-0 cursor-pointer"
                  >
                    <div className="flex items-center gap-1 font-black text-xs text-emerald-400 min-w-[50px] justify-end">
                      <Zap className="w-3.5 h-3.5 fill-emerald-400" />
                      <span>{(u.xpTotal || u.weeklyXp || 0).toLocaleString()}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 hover:text-slate-300 transition shrink-0 ml-1" />
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Relegation/Promotion Info Footer */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> Top 3 Promovidos
          </div>
          <div className="flex items-center gap-1 text-rose-400 font-semibold">
            <ArrowDownRight className="w-3.5 h-3.5" /> Últimos 2 Rebaixados
          </div>
        </div>
      </div>

      {/* Leagues Modal */}
      {showLeaguesModal && (
        <LeaguesModal
          user={user}
          onClose={() => setShowLeaguesModal(false)}
        />
      )}

    </div>
  );
};

