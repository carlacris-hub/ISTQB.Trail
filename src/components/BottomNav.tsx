import React from 'react';
import { Compass, Award, Trophy, User, HelpCircle, Users } from 'lucide-react';
import { translations, Language } from '../utils/i18n';

export type TabType = 'trail' | 'mock' | 'info' | 'leaderboard' | 'social' | 'clans' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  mockExamAvailable: boolean;
  language?: Language;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab, mockExamAvailable, language = 'pt' }) => {
  const t = translations[language];

  const navItems = [
    { id: 'trail' as TabType, label: t.trail, icon: Compass },
    { id: 'mock' as TabType, label: t.simulations, icon: Award, badge: mockExamAvailable ? undefined : '1/1' },
    { id: 'leaderboard' as TabType, label: t.ranking, icon: Trophy },
    { id: 'social' as TabType, label: 'Social', icon: Users },
    { id: 'info' as TabType, label: 'FAQ', icon: HelpCircle },
    { id: 'profile' as TabType, label: t.profile, icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 py-2 px-2 sm:px-4 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id || (item.id === 'social' && activeTab === 'clans');
          return (
            <button
              key={item.id}
              onClick={() => onChangeTab(item.id)}
              className={`flex flex-col items-center gap-1 transition-all relative py-1 px-2.5 rounded-xl ${
                isActive
                  ? 'text-teal-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-extrabold px-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] sm:text-[11px] leading-none">{item.label}</span>
              {isActive && (
                <div className="w-1 h-1 bg-teal-400 rounded-full mt-0.5 shadow-sm shadow-teal-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
