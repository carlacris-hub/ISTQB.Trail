import React, { useState, useEffect } from 'react';
import { UserProfile, LeaderboardUser } from '../types';
import { translations } from '../utils/i18n';
import { ClansView } from './ClansView';
import { 
  Users, Shield, Search, UserPlus, UserCheck, Flame, Award, 
  Swords, Sparkles, Building2, User
} from 'lucide-react';
import { 
  getStoredColleagues, searchColleagues, toggleFollowColleague, calculateFollowersCount 
} from '../utils/socialStorage';

interface SocialViewProps {
  user: UserProfile;
  onUserUpdate: (updatedUser: UserProfile) => void;
  onSelectUser: (targetUser: LeaderboardUser) => void;
  onToggleFollow: (targetUserId: string, targetUserObj?: LeaderboardUser) => void;
  onStartChallenge: (targetUser: LeaderboardUser) => void;
  initialSubTab?: 'friends' | 'clans';
  initialFriendsFilter?: 'all' | 'following' | 'followers';
}

export const SocialView: React.FC<SocialViewProps> = ({
  user,
  onUserUpdate,
  onSelectUser,
  onToggleFollow,
  onStartChallenge,
  initialSubTab = 'friends',
  initialFriendsFilter = 'all',
}) => {
  const lang = user.language || 'pt';
  const t = translations[lang];

  const [activeSubTab, setActiveSubTab] = useState<'friends' | 'clans'>(initialSubTab);
  const [friendsFilter, setFriendsFilter] = useState<'all' | 'following' | 'followers'>(initialFriendsFilter);
  const [searchQuery, setSearchQuery] = useState('');
  const [colleaguesList, setColleaguesList] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    const followingIds = user.followingIds || [];
    let results = searchColleagues(searchQuery, user.id, followingIds);

    if (friendsFilter === 'following') {
      results = results.filter(c => followingIds.includes(c.id));
    } else if (friendsFilter === 'followers') {
      results = results.filter(c => (c.followingIds || []).includes(user.id));
    }

    const seen = new Set<string>();
    const deduplicated = results.filter(c => {
      if (!c || !c.id) return false;
      if (seen.has(c.id)) return false;
      seen.add(c.id);
      return true;
    });

    setColleaguesList(deduplicated);
  }, [searchQuery, user.id, user.followingIds, friendsFilter]);

  const followingCount = (user.followingIds || []).length;
  const followersCount = calculateFollowersCount(user.id);

  const handleFollowClick = (targetUser: LeaderboardUser, e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFollow(targetUser.id, targetUser);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-4xl mx-auto pb-24 animate-fade-in">
      
      {/* View Title & Top Sub-Tabs */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 font-bold text-xs mb-2">
              <Users className="w-3.5 h-3.5" />
              <span>Comunidade & Conexões QA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {lang === 'en' ? 'Social Hub' : 'Hub Social'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {lang === 'en' 
                ? 'Connect with QA professionals, follow colleagues, and participate in Clans.'
                : 'Conecte-se com profissionais de QA, siga colegas e participe de Clãs.'}
            </p>
          </div>

          {/* Sub Tab Buttons */}
          <div className="flex items-center bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto shrink-0">
            <button
              onClick={() => setActiveSubTab('friends')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeSubTab === 'friends'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-lg shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-4 h-4 stroke-[2.5]" />
              <span>{lang === 'en' ? 'Friends' : 'Amigos'}</span>
            </button>

            <button
              onClick={() => setActiveSubTab('clans')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
                activeSubTab === 'clans'
                  ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 shadow-lg shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4 stroke-[2.5]" />
              <span>{lang === 'en' ? 'Clans' : 'Clãs'}</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Friends Content */}
        {activeSubTab === 'friends' && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Quick Connection Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div 
                onClick={() => setFriendsFilter('following')}
                className={`border rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer transition ${
                  friendsFilter === 'following' ? 'bg-teal-950/80 border-teal-500/80 ring-1 ring-teal-500/30' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <UserCheck className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {lang === 'en' ? 'Following' : 'Seguindo'}
                  </span>
                  <span className="text-lg font-black text-white">{followingCount}</span>
                </div>
              </div>

              <div 
                onClick={() => setFriendsFilter('followers')}
                className={`border rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer transition ${
                  friendsFilter === 'followers' ? 'bg-emerald-950/80 border-emerald-500/80 ring-1 ring-emerald-500/30' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {lang === 'en' ? 'Followers' : 'Seguidores'}
                  </span>
                  <span className="text-lg font-black text-white">{followersCount}</span>
                </div>
              </div>

              <div 
                onClick={() => setFriendsFilter('all')}
                className={`col-span-2 sm:col-span-1 border rounded-2xl p-3.5 flex items-center gap-3 cursor-pointer transition ${
                  friendsFilter === 'all' ? 'bg-amber-950/80 border-amber-500/80 ring-1 ring-amber-500/30' : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Flame className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    {lang === 'en' ? 'All Users' : 'Todos'}
                  </span>
                  <span className="text-lg font-black text-amber-400">
                    {lang === 'en' ? 'View All' : 'Ver Todos'}
                  </span>
                </div>
              </div>
            </div>

            {/* Filter Tabs & Search Bar */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setFriendsFilter('all')}
                  className={`flex-1 py-2 rounded-lg font-bold transition text-center ${
                    friendsFilter === 'all' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'All Colleagues' : 'Todos os Colegas'}
                </button>

                <button
                  onClick={() => setFriendsFilter('following')}
                  className={`flex-1 py-2 rounded-lg font-bold transition text-center ${
                    friendsFilter === 'following' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'Following' : 'Seguindo'} ({followingCount})
                </button>

                <button
                  onClick={() => setFriendsFilter('followers')}
                  className={`flex-1 py-2 rounded-lg font-bold transition text-center ${
                    friendsFilter === 'followers' ? 'bg-teal-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {lang === 'en' ? 'Followers' : 'Seguidores'} ({followersCount})
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={lang === 'en' ? 'Search friends by name, @username, or company...' : 'Buscar amigos por nome, @username ou empresa...'}
                  className="w-full pl-11 pr-4 py-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition shadow-inner"
                />
              </div>
            </div>

            {/* List of Friends / Colleagues */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
                  {searchQuery 
                    ? (lang === 'en' ? 'Search Results' : 'Resultados da Busca') 
                    : (lang === 'en' ? 'Suggested Friends & Colleagues' : 'Colegas de QA & Sugestões')}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {colleaguesList.length} {lang === 'en' ? 'profiles found' : 'perfis'}
                </span>
              </div>

              {colleaguesList.length === 0 ? (
                <div className="text-center py-10 bg-slate-950/40 border border-slate-800/80 rounded-2xl">
                  <User className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-60" />
                  <p className="text-xs font-bold text-slate-400">
                    {lang === 'en' ? 'No friends found for this search.' : 'Nenhum perfil encontrado para esta busca.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {colleaguesList.map((colleague, idx) => {
                    const isFollowing = (user.followingIds || []).includes(colleague.id);
                    return (
                      <div
                        key={`${colleague.id}-${idx}`}
                        onClick={() => onSelectUser(colleague)}
                        className="bg-slate-950/60 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl transition cursor-pointer flex flex-col justify-between gap-3 group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={colleague.avatarUrl}
                              alt={colleague.name}
                              className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0"
                            />
                            <div className="min-w-0">
                              <h4 className="text-xs font-extrabold text-white truncate group-hover:text-teal-400 transition">
                                {colleague.name}
                              </h4>
                              {colleague.username && (
                                <span className="text-[10px] font-mono text-teal-400 block font-bold">
                                  @{colleague.username}
                                </span>
                              )}
                              {colleague.company && (
                                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 truncate">
                                  <Building2 className="w-3 h-3 text-slate-500 shrink-0" />
                                  <span className="truncate">{colleague.company}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={(e) => handleFollowClick(colleague, e)}
                            className={`px-3 py-1.5 rounded-xl font-black text-[10px] transition flex items-center gap-1 shrink-0 ${
                              isFollowing
                                ? 'bg-slate-800 text-teal-400 border border-teal-500/30 hover:bg-rose-950 hover:text-rose-400 hover:border-rose-500/40'
                                : 'bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-md shadow-teal-500/20'
                            }`}
                          >
                            {isFollowing ? (
                              <>
                                <UserCheck className="w-3 h-3 stroke-[3]" />
                                <span>{lang === 'en' ? 'Following' : 'Seguindo'}</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-3 h-3 stroke-[3]" />
                                <span>{lang === 'en' ? 'Follow' : 'Seguir'}</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Bio & Stats */}
                        {colleague.bio && (
                          <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                            {colleague.bio}
                          </p>
                        )}

                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                          <div className="flex items-center gap-3">
                            <span className="font-extrabold text-teal-300">
                              {colleague.xpTotal} XP
                            </span>
                            <span>
                              {colleague.followersCount || 0} {lang === 'en' ? 'followers' : 'seguidores'}
                            </span>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onStartChallenge(colleague);
                            }}
                            className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                          >
                            <Swords className="w-3 h-3" />
                            <span>{lang === 'en' ? 'Challenge 1v1' : 'Desafiar 1v1'}</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>
        )}

      </div>

      {/* Tab 2: Clans Content */}
      {activeSubTab === 'clans' && (
        <ClansView
          user={user}
          onUserUpdate={onUserUpdate}
        />
      )}

    </div>
  );
};
