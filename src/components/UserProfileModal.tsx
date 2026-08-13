import React from 'react';
import { LeaderboardUser, UserProfile } from '../types';
import { 
  X, Award, Zap, Shield, Building2, User, Swords, Check, UserPlus, UserMinus, Sparkles, Trophy 
} from 'lucide-react';
import { translations } from '../utils/i18n';
import { calculateFollowersCount } from '../utils/socialStorage';

interface UserProfileModalProps {
  currentUser: UserProfile;
  targetUser: LeaderboardUser;
  onClose: () => void;
  onToggleFollow: (targetUserId: string, targetUserObj?: LeaderboardUser) => void;
  onStartChallenge: (targetUser: LeaderboardUser) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  currentUser,
  targetUser,
  onClose,
  onToggleFollow,
  onStartChallenge,
}) => {
  const lang = currentUser.language || 'pt';
  const t = translations[lang];
  const isFollowing = (currentUser.followingIds || []).includes(targetUser.id);
  const isSelf = targetUser.id === currentUser.id;
  const followersCount = calculateFollowersCount(targetUser.id, targetUser.followersCount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header Cover Banner */}
        <div className="h-28 bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-700 relative p-4 flex justify-between items-start">
          <span className="text-[10px] font-extrabold uppercase tracking-widest bg-slate-950/40 text-teal-300 px-2.5 py-1 rounded-full border border-teal-500/30">
            {targetUser.league ? `Liga ${targetUser.league}` : 'Candidato ISTQB'}
          </span>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-950/50 text-white hover:bg-slate-950 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Avatar & Main Info */}
        <div className="px-6 pb-6 relative">
          <div className="flex justify-between items-end -mt-12 mb-3">
            <div className="relative">
              <img
                src={targetUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={targetUser.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-slate-900 shadow-xl bg-slate-800"
              />
              <div className="absolute -bottom-1 -right-1 bg-teal-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-md border border-slate-900 shadow">
                Rank #{targetUser.rank || '1'}
              </div>
            </div>

            {!isSelf && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggleFollow(targetUser.id, targetUser)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-md ${
                    isFollowing
                      ? 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-rose-950/50 hover:text-rose-300 hover:border-rose-800'
                      : 'bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserMinus className="w-3.5 h-3.5" />
                      <span>{t.following}</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{t.follow}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onStartChallenge(targetUser);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-md shadow-amber-500/20 flex items-center gap-1.5 transition"
                >
                  <Swords className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? '1v1 Duel' : 'Duelo 1v1'}</span>
                </button>
              </div>
            )}
          </div>

          {/* User Name, Username, Title & Company */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-extrabold text-white">
                {targetUser.name}
              </h3>
              <span className="text-xs font-mono font-extrabold text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-md border border-teal-500/20">
                @{targetUser.username || targetUser.id.slice(0, 8)}
              </span>
              {targetUser.clanName && (
                <span className="text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-md">
                  [{targetUser.clanName}]
                </span>
              )}
            </div>

            {targetUser.company && (
              <div className="text-xs font-semibold text-teal-400 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-teal-400" />
                <span>{targetUser.company}</span>
              </div>
            )}

            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {targetUser.bio || (lang === 'en' ? 'Preparing for official ISTQB CTFL certification.' : 'Preparando para a certificação oficial ISTQB CTFL v4.0.')}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2.5 my-5">
            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
              <Zap className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="text-base font-black text-white block">{targetUser.weeklyXp || targetUser.xpTotal || 0}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">XP Total</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
              <Award className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span className="text-base font-black text-white block">{targetUser.badgeCount || 0}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Badges</span>
            </div>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-center">
              <Trophy className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
              <span className="text-base font-black text-white block">{followersCount}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t.followers}</span>
            </div>
          </div>

          {/* Additional Info Box */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5 space-y-2 text-xs text-slate-300">
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{lang === 'en' ? 'Completed Chapters:' : 'Capítulos Concluídos:'}</span>
              <span className="font-bold text-white">{targetUser.completedChapterCount || 0} / 6</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">{lang === 'en' ? 'Passed Mock Exams:' : 'Simulados Aprovados:'}</span>
              <span className="font-bold text-emerald-400">{targetUser.mockExamPassedCount || 0}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
