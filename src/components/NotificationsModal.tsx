import React from 'react';
import { UserProfile, NotificationItem } from '../types';
import { 
  X, Bell, CheckCheck, BookOpen, Award, Trophy, Swords, ShieldAlert, Sparkles 
} from 'lucide-react';
import { translations } from '../utils/i18n';

interface NotificationsModalProps {
  user: UserProfile;
  notifications: NotificationItem[];
  onClose: () => void;
  onMarkAllRead: () => void;
  onOpenChallenge?: (challengeId?: string) => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  user,
  notifications,
  onClose,
  onMarkAllRead,
  onOpenChallenge,
}) => {
  const lang = user.language || 'pt';
  const t = translations[lang];

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'chapter_completed':
        return <BookOpen className="w-4 h-4 text-emerald-400" />;
      case 'mock_passed':
        return <Trophy className="w-4 h-4 text-amber-400" />;
      case 'badge_earned':
        return <Award className="w-4 h-4 text-teal-400" />;
      case 'challenge_received':
      case 'challenge_result':
        return <Swords className="w-4 h-4 text-orange-400" />;
      case 'clan_invite':
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white">{t.notificationsTitle}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllRead}
              className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1 transition"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{t.markAllRead}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-4 space-y-2.5 overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-xs text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-50" />
              <span>{t.noNotifications}</span>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  if (n.type === 'challenge_received' && onOpenChallenge) {
                    onClose();
                    onOpenChallenge(n.challengeId);
                  }
                }}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  !n.isRead
                    ? 'bg-slate-900/90 border-amber-500/40 ring-1 ring-amber-500/20'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                    {getIconForType(n.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{n.title}</h4>
                      <span className="text-[10px] text-slate-500 shrink-0">{n.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>

                    {n.type === 'challenge_received' && (
                      <div className="mt-2 text-[10px] font-extrabold text-amber-400 flex items-center gap-1">
                        <Swords className="w-3 h-3" />
                        <span>Clique para responder ao duelo!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
