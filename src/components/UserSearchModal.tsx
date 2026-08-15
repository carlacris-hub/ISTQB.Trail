import React, { useState, useEffect } from 'react';
import { UserProfile, LeaderboardUser, Clan } from '../types';
import { searchColleagues, searchClans, getPopularClans, joinOrRequestClan } from '../utils/socialStorage';
import { searchFirestoreUsers } from '../utils/firestoreService';
import { 
  X, Search, UserPlus, Building2, Award, UserCheck, AtSign, Shield, Users, Sparkles, Check, Clock, ChevronRight, Zap
} from 'lucide-react';
import { translations } from '../utils/i18n';

interface UserSearchModalProps {
  currentUser: UserProfile;
  onClose: () => void;
  onSelectUser: (user: LeaderboardUser) => void;
  onToggleFollow: (userId: string, userObj?: LeaderboardUser) => void;
  onUserUpdate?: (updatedUser: UserProfile) => void;
  onOpenClansTab?: () => void;
}

export const UserSearchModal: React.FC<UserSearchModalProps> = ({
  currentUser,
  onClose,
  onSelectUser,
  onToggleFollow,
  onUserUpdate,
  onOpenClansTab,
}) => {
  const lang = currentUser.language || 'pt';
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'all' | 'users' | 'clans'>('all');
  const [query, setQuery] = useState('');
  const [firestoreResults, setFirestoreResults] = useState<LeaderboardUser[]>([]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const followingIds = currentUser.followingIds || [];

  // Search users & clans
  const localUserResults = searchColleagues(query, currentUser.id, followingIds);
  const clanResults = searchClans(query);
  const popularClans = getPopularClans();

  useEffect(() => {
    let isCancelled = false;
    const clean = query.trim();
    if (clean.length >= 2) {
      searchFirestoreUsers(clean).then((fsUsers) => {
        if (!isCancelled) {
          const localIds = new Set(localUserResults.map(r => r.id));
          const filteredFs = fsUsers
            .filter(u => !localIds.has(u.id))
            .map(u => ({ ...u, isFollowing: followingIds.includes(u.id) }));
          setFirestoreResults(filteredFs);
        }
      });
    } else {
      setFirestoreResults([]);
    }
    return () => { isCancelled = true; };
  }, [query]);

  const seenUserIds = new Set<string>();
  const allUserResults = [...localUserResults, ...firestoreResults].filter(u => {
    if (!u || !u.id) return false;
    if (seenUserIds.has(u.id)) return false;
    seenUserIds.add(u.id);
    return true;
  });

  const handleClanAction = (clan: Clan) => {
    const res = joinOrRequestClan(currentUser, clan.id);
    if (res.message) {
      setActionFeedback(res.message);
      setTimeout(() => setActionFeedback(null), 3500);
    }

    if (res.success && !res.isPending && onUserUpdate) {
      onUserUpdate({ ...currentUser, clanId: clan.id });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-extrabold text-white">
              {lang === 'en' ? 'Search Users & Clans' : 'Pesquisar Usuários e Clãs'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/30 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            <input
              type="text"
              autoFocus
              placeholder={
                lang === 'en'
                  ? 'Search by @username, name, or clan name...'
                  : 'Buscar por @username, nome de usuário ou nome do clã...'
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 shadow-inner"
            />
          </div>

          {/* Search Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950/60 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                activeTab === 'all'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'All' : 'Tudo'}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                activeTab === 'users'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <AtSign className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Users' : 'Usuários'}</span>
            </button>
            <button
              onClick={() => setActiveTab('clans')}
              className={`flex-1 py-1.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${
                activeTab === 'clans'
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Clans' : 'Clãs'}</span>
            </button>
          </div>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="mx-4 mt-3 bg-teal-950/80 border border-teal-500/50 p-2.5 rounded-xl text-xs font-bold text-teal-300 flex items-center gap-2 animate-fade-in shrink-0">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Results Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          
          {/* POPULAR CLANS SECTION (Shown when query is empty or on Clans tab) */}
          {(activeTab === 'clans' || (activeTab === 'all' && !query.trim())) && (
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{lang === 'en' ? 'Popular QA Clans' : '🔥 Clãs Populares'}</span>
                </h4>
                {onOpenClansTab && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenClansTab();
                    }}
                    className="text-[10px] font-bold text-teal-400 hover:underline flex items-center gap-0.5"
                  >
                    <span>{lang === 'en' ? 'View All Clans' : 'Ver Todos Clãs'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-2">
                {popularClans.map((clan) => {
                  const isMyClan = currentUser.clanId === clan.id || clan.members.some(m => m.id === currentUser.id);
                  const isPending = clan.pendingRequests?.some(r => r.userId === currentUser.id);

                  return (
                    <div
                      key={clan.id}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 hover:border-slate-700 flex items-center justify-between gap-3 transition"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={clan.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={clan.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-xs font-extrabold text-white truncate">{clan.name}</h5>
                            <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/30 shrink-0">
                              [{clan.tag}]
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{clan.description}</p>
                          <div className="flex items-center gap-2 mt-1 text-[10px]">
                            <span className="text-teal-400 font-bold flex items-center gap-1">
                              <Users className="w-3 h-3" /> {clan.members.length}/10
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                              <Zap className="w-3 h-3" /> {clan.totalXp} XP
                            </span>
                            <span className="text-slate-600">•</span>
                            <span className="text-slate-400 text-[9px] bg-slate-800 px-1.5 py-0.2 rounded">
                              {clan.joinType === 'approval' ? (lang === 'en' ? 'Approval' : 'Com Aprovação') : (lang === 'en' ? 'Free Entry' : 'Entrada Livre')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isMyClan ? (
                          <span className="text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-1 rounded-lg">
                            {lang === 'en' ? 'Your Clan' : 'Seu Clã'}
                          </span>
                        ) : isPending ? (
                          <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-lg flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{lang === 'en' ? 'Pending' : 'Aguardando'}</span>
                          </span>
                        ) : !currentUser.clanId ? (
                          <button
                            onClick={() => handleClanAction(clan)}
                            className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs transition"
                          >
                            {clan.joinType === 'approval' 
                              ? (lang === 'en' ? 'Request' : 'Pedir p/ Entrar') 
                              : (lang === 'en' ? 'Join' : 'Entrar')}
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-semibold">
                            {lang === 'en' ? 'In another clan' : 'Em outro clã'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* USERS RESULTS */}
          {(activeTab === 'all' || activeTab === 'users') && (
            <div className="space-y-2">
              {activeTab === 'all' && (
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {lang === 'en' ? 'Users' : 'Usuários (@username)'}
                </h4>
              )}

              {allUserResults.length === 0 ? (
                activeTab === 'users' && (
                  <div className="text-center py-8 text-xs text-slate-400 space-y-1">
                    <p>{lang === 'en' ? 'No users found matching query.' : 'Nenhum usuário encontrado.'}</p>
                    <p className="text-[10px] text-slate-500">
                      {lang === 'en' ? 'Try searching by @username (e.g. @anasilva)' : 'Tente buscar por @username (ex: @anasilva)'}
                    </p>
                  </div>
                )
              ) : (
                allUserResults.map((col, idx) => {
                  const isFollowing = followingIds.includes(col.id);
                  const displayUsername = col.username ? `@${col.username}` : `@${col.id.slice(0, 8)}`;

                  return (
                    <div
                      key={`${col.id}-${idx}`}
                      className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-slate-700 flex items-center justify-between gap-3 transition"
                    >
                      <div
                        onClick={() => {
                          onClose();
                          onSelectUser(col);
                        }}
                        className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
                      >
                        <img
                          src={col.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={col.name}
                          className="w-11 h-11 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-white truncate">{col.name}</h4>
                            <span className="text-[11px] font-mono text-teal-400 font-extrabold bg-teal-500/10 px-1.5 py-0.5 rounded border border-teal-500/20 shrink-0">
                              {displayUsername}
                            </span>
                            {col.clanName && (
                              <span className="text-[9px] font-bold bg-amber-500/10 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/20 shrink-0">
                                [{col.clanName}]
                              </span>
                            )}
                          </div>

                          {col.company && (
                            <p className="text-[11px] text-slate-300 flex items-center gap-1 truncate mt-0.5">
                              <Building2 className="w-3 h-3 text-teal-400 shrink-0" />
                              <span>{col.company}</span>
                            </p>
                          )}

                          <p className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                            <span>XP: {col.weeklyXp || col.xpTotal || 0}</span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <Award className="w-3 h-3 text-amber-400" /> {col.badgeCount || 0} Badges
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => onToggleFollow(col.id, col)}
                          className={`p-2 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                            isFollowing
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-rose-950/30 hover:text-rose-400 hover:border-rose-500/30'
                              : 'bg-teal-500 hover:bg-teal-400 text-slate-950'
                          }`}
                          title={isFollowing ? (lang === 'en' ? 'Following' : 'Seguindo') : (lang === 'en' ? 'Follow' : 'Seguir')}
                        >
                          {isFollowing ? (
                            <>
                              <UserCheck className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{lang === 'en' ? 'Following' : 'Seguindo'}</span>
                            </>
                          ) : (
                            <>
                              <UserPlus className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">{lang === 'en' ? 'Follow' : 'Seguir'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* CLANS SEARCH RESULTS (WHEN QUERY SPECIFIED AND TAB IS ALL) */}
          {activeTab === 'all' && query.trim() && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {lang === 'en' ? 'Clans Matching Search' : 'Clãs Encontrados'}
              </h4>

              {clanResults.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">{lang === 'en' ? 'No clans found.' : 'Nenhum clã encontrado.'}</p>
              ) : (
                clanResults.map((clan) => {
                  const isMyClan = currentUser.clanId === clan.id || clan.members.some(m => m.id === currentUser.id);
                  const isPending = clan.pendingRequests?.some(r => r.userId === currentUser.id);

                  return (
                    <div
                      key={clan.id}
                      className="p-3 rounded-xl border border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={clan.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={clan.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h5 className="text-xs font-extrabold text-white truncate">{clan.name}</h5>
                            <span className="text-[9px] font-black bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded border border-amber-500/30 shrink-0">
                              [{clan.tag}]
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">{clan.description}</p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isMyClan ? (
                          <span className="text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30 px-2.5 py-1 rounded-lg">
                            {lang === 'en' ? 'Your Clan' : 'Seu Clã'}
                          </span>
                        ) : isPending ? (
                          <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded-lg flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{lang === 'en' ? 'Pending' : 'Aguardando'}</span>
                          </span>
                        ) : !currentUser.clanId ? (
                          <button
                            onClick={() => handleClanAction(clan)}
                            className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-xs transition"
                          >
                            {clan.joinType === 'approval' 
                              ? (lang === 'en' ? 'Request' : 'Pedir p/ Entrar') 
                              : (lang === 'en' ? 'Join' : 'Entrar')}
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-semibold">
                            {lang === 'en' ? 'In another clan' : 'Em outro clã'}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
