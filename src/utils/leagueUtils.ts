import { UserProfile } from '../types';

export interface LeagueTier {
  id: string;
  name: string;
  nameEn: string;
  leagueName: string;
  subCategory: 3 | 2 | 1;
  minXp: number;
  iconName: string;
  colorGradient: string;
  borderColor: string;
  textColor: string;
  badgeBg: string;
  glowColor: string;
}

export const LEAGUE_TIERS: LeagueTier[] = [
  // 1. QA Trainee
  { 
    id: 'trainee_3', name: 'QA Estagiário III', nameEn: 'QA Trainee III', 
    leagueName: 'QA Trainee', subCategory: 3, minXp: 0, 
    iconName: 'shield', colorGradient: 'from-amber-900 via-amber-800 to-slate-900 border-amber-700/80', 
    borderColor: 'border-amber-700/80', textColor: 'text-amber-400', badgeBg: 'bg-amber-900/60', glowColor: 'rgba(217, 119, 6, 0.2)' 
  },
  { 
    id: 'trainee_2', name: 'QA Estagiário II', nameEn: 'QA Trainee II', 
    leagueName: 'QA Trainee', subCategory: 2, minXp: 150, 
    iconName: 'shield', colorGradient: 'from-amber-800 via-amber-700 to-slate-900 border-amber-600/80', 
    borderColor: 'border-amber-600/80', textColor: 'text-amber-300', badgeBg: 'bg-amber-800/60', glowColor: 'rgba(217, 119, 6, 0.3)' 
  },
  { 
    id: 'trainee_1', name: 'QA Estagiário I', nameEn: 'QA Trainee I', 
    leagueName: 'QA Trainee', subCategory: 1, minXp: 400, 
    iconName: 'shield', colorGradient: 'from-amber-700 via-amber-600 to-slate-900 border-amber-500/80', 
    borderColor: 'border-amber-500/80', textColor: 'text-amber-200', badgeBg: 'bg-amber-700/60', glowColor: 'rgba(217, 119, 6, 0.4)' 
  },

  // 2. QA Analyst Junior
  { 
    id: 'junior_3', name: 'QA Jr. III', nameEn: 'QA Junior III', 
    leagueName: 'QA Jr.', subCategory: 3, minXp: 800, 
    iconName: 'award', colorGradient: 'from-slate-700 via-slate-600 to-slate-900 border-slate-400/80', 
    borderColor: 'border-slate-400/80', textColor: 'text-slate-300', badgeBg: 'bg-slate-700/60', glowColor: 'rgba(148, 163, 184, 0.2)' 
  },
  { 
    id: 'junior_2', name: 'QA Jr. II', nameEn: 'QA Junior II', 
    leagueName: 'QA Jr.', subCategory: 2, minXp: 1400, 
    iconName: 'award', colorGradient: 'from-slate-600 via-slate-500 to-slate-900 border-slate-300/80', 
    borderColor: 'border-slate-300/80', textColor: 'text-slate-200', badgeBg: 'bg-slate-600/60', glowColor: 'rgba(148, 163, 184, 0.3)' 
  },
  { 
    id: 'junior_1', name: 'QA Jr. I', nameEn: 'QA Junior I', 
    leagueName: 'QA Jr.', subCategory: 1, minXp: 2200, 
    iconName: 'award', colorGradient: 'from-slate-500 via-slate-400 to-slate-900 border-slate-200/80', 
    borderColor: 'border-slate-200/80', textColor: 'text-white', badgeBg: 'bg-slate-500/60', glowColor: 'rgba(226, 232, 240, 0.4)' 
  },

  // 3. QA Analyst Pleno
  { 
    id: 'pleno_3', name: 'QA Pleno III', nameEn: 'QA Mid III', 
    leagueName: 'QA Pleno', subCategory: 3, minXp: 3200, 
    iconName: 'trophy', colorGradient: 'from-yellow-700 via-amber-600 to-slate-900 border-yellow-500/80', 
    borderColor: 'border-yellow-500/80', textColor: 'text-yellow-300', badgeBg: 'bg-yellow-800/60', glowColor: 'rgba(234, 179, 8, 0.2)' 
  },
  { 
    id: 'pleno_2', name: 'QA Pleno II', nameEn: 'QA Mid II', 
    leagueName: 'QA Pleno', subCategory: 2, minXp: 4500, 
    iconName: 'trophy', colorGradient: 'from-yellow-600 via-amber-500 to-slate-900 border-yellow-400/80', 
    borderColor: 'border-yellow-400/80', textColor: 'text-yellow-200', badgeBg: 'bg-yellow-700/60', glowColor: 'rgba(234, 179, 8, 0.3)' 
  },
  { 
    id: 'pleno_1', name: 'QA Pleno I', nameEn: 'QA Mid I', 
    leagueName: 'QA Pleno', subCategory: 1, minXp: 6000, 
    iconName: 'trophy', colorGradient: 'from-yellow-500 via-amber-400 to-slate-900 border-yellow-300/80', 
    borderColor: 'border-yellow-300/80', textColor: 'text-yellow-100', badgeBg: 'bg-yellow-600/60', glowColor: 'rgba(253, 224, 71, 0.4)' 
  },

  // 4. QA Senior
  { 
    id: 'senior_3', name: 'QA Sênior III', nameEn: 'QA Senior III', 
    leagueName: 'QA Sênior', subCategory: 3, minXp: 8000, 
    iconName: 'zap', colorGradient: 'from-teal-800 via-cyan-700 to-slate-900 border-teal-400/80', 
    borderColor: 'border-teal-400/80', textColor: 'text-teal-300', badgeBg: 'bg-teal-900/60', glowColor: 'rgba(45, 212, 191, 0.2)' 
  },
  { 
    id: 'senior_2', name: 'QA Sênior II', nameEn: 'QA Senior II', 
    leagueName: 'QA Sênior', subCategory: 2, minXp: 10500, 
    iconName: 'zap', colorGradient: 'from-teal-700 via-cyan-600 to-slate-900 border-teal-300/80', 
    borderColor: 'border-teal-300/80', textColor: 'text-teal-200', badgeBg: 'bg-teal-800/60', glowColor: 'rgba(45, 212, 191, 0.3)' 
  },
  { 
    id: 'senior_1', name: 'QA Sênior I', nameEn: 'QA Senior I', 
    leagueName: 'QA Sênior', subCategory: 1, minXp: 13500, 
    iconName: 'zap', colorGradient: 'from-teal-600 via-cyan-500 to-slate-900 border-cyan-200/80', 
    borderColor: 'border-cyan-200/80', textColor: 'text-cyan-100', badgeBg: 'bg-teal-700/60', glowColor: 'rgba(103, 232, 249, 0.4)' 
  },

  // 5. Quality Lead
  { 
    id: 'lead_3', name: 'Líder de QA III', nameEn: 'QA Lead III', 
    leagueName: 'Líder QA', subCategory: 3, minXp: 17000, 
    iconName: 'gem', colorGradient: 'from-emerald-900 via-emerald-800 to-slate-900 border-emerald-500/80', 
    borderColor: 'border-emerald-500/80', textColor: 'text-emerald-300', badgeBg: 'bg-emerald-900/60', glowColor: 'rgba(16, 185, 129, 0.2)' 
  },
  { 
    id: 'lead_2', name: 'Líder de QA II', nameEn: 'QA Lead II', 
    leagueName: 'Líder QA', subCategory: 2, minXp: 21500, 
    iconName: 'gem', colorGradient: 'from-emerald-800 via-emerald-700 to-slate-900 border-emerald-400/80', 
    borderColor: 'border-emerald-400/80', textColor: 'text-emerald-200', badgeBg: 'bg-emerald-800/60', glowColor: 'rgba(16, 185, 129, 0.3)' 
  },
  { 
    id: 'lead_1', name: 'Líder de QA I', nameEn: 'QA Lead I', 
    leagueName: 'Líder QA', subCategory: 1, minXp: 27000, 
    iconName: 'gem', colorGradient: 'from-emerald-700 via-emerald-600 to-slate-900 border-emerald-300/80', 
    borderColor: 'border-emerald-300/80', textColor: 'text-emerald-100', badgeBg: 'bg-emerald-700/60', glowColor: 'rgba(110, 231, 183, 0.4)' 
  },

  // 6. Test Automation Architect
  { 
    id: 'architect_3', name: 'Arquiteto de Testes III', nameEn: 'Test Architect III', 
    leagueName: 'Arquiteto QA', subCategory: 3, minXp: 34000, 
    iconName: 'sparkles', colorGradient: 'from-blue-900 via-indigo-800 to-slate-900 border-blue-400/80', 
    borderColor: 'border-blue-400/80', textColor: 'text-blue-300', badgeBg: 'bg-blue-900/60', glowColor: 'rgba(96, 165, 250, 0.2)' 
  },
  { 
    id: 'architect_2', name: 'Arquiteto de Testes II', nameEn: 'Test Architect II', 
    leagueName: 'Arquiteto QA', subCategory: 2, minXp: 42000, 
    iconName: 'sparkles', colorGradient: 'from-blue-800 via-indigo-700 to-slate-900 border-blue-300/80', 
    borderColor: 'border-blue-300/80', textColor: 'text-blue-200', badgeBg: 'bg-blue-800/60', glowColor: 'rgba(96, 165, 250, 0.3)' 
  },
  { 
    id: 'architect_1', name: 'Arquiteto de Testes I', nameEn: 'Test Architect I', 
    leagueName: 'Arquiteto QA', subCategory: 1, minXp: 52000, 
    iconName: 'sparkles', colorGradient: 'from-blue-700 via-sky-600 to-slate-900 border-sky-200/80', 
    borderColor: 'border-sky-200/80', textColor: 'text-sky-100', badgeBg: 'bg-blue-700/60', glowColor: 'rgba(186, 230, 253, 0.4)' 
  },

  // 7. Head of Quality / QA Manager
  { 
    id: 'manager_3', name: 'Gerente de Qualidade III', nameEn: 'QA Manager III', 
    leagueName: 'Gerente QA', subCategory: 3, minXp: 64000, 
    iconName: 'flame', colorGradient: 'from-rose-900 via-pink-900 to-slate-900 border-rose-500/80', 
    borderColor: 'border-rose-500/80', textColor: 'text-rose-300', badgeBg: 'bg-rose-900/60', glowColor: 'rgba(244, 63, 94, 0.2)' 
  },
  { 
    id: 'manager_2', name: 'Gerente de Qualidade II', nameEn: 'QA Manager II', 
    leagueName: 'Gerente QA', subCategory: 2, minXp: 78000, 
    iconName: 'flame', colorGradient: 'from-rose-800 via-pink-800 to-slate-900 border-rose-400/80', 
    borderColor: 'border-rose-400/80', textColor: 'text-rose-200', badgeBg: 'bg-rose-800/60', glowColor: 'rgba(244, 63, 94, 0.3)' 
  },
  { 
    id: 'manager_1', name: 'Gerente de Qualidade I', nameEn: 'QA Manager I', 
    leagueName: 'Gerente QA', subCategory: 1, minXp: 95000, 
    iconName: 'flame', colorGradient: 'from-rose-700 via-rose-600 to-slate-900 border-rose-300/80', 
    borderColor: 'border-rose-300/80', textColor: 'text-rose-100', badgeBg: 'bg-rose-700/60', glowColor: 'rgba(253, 164, 175, 0.4)' 
  },

  // 8. Principal Quality Director
  { 
    id: 'director_3', name: 'Diretor de Qualidade III', nameEn: 'Quality Director III', 
    leagueName: 'Diretor QA', subCategory: 3, minXp: 115000, 
    iconName: 'crown', colorGradient: 'from-purple-900 via-fuchsia-900 to-slate-900 border-purple-400/80', 
    borderColor: 'border-purple-400/80', textColor: 'text-purple-300', badgeBg: 'bg-purple-900/60', glowColor: 'rgba(192, 132, 252, 0.3)' 
  },
  { 
    id: 'director_2', name: 'Diretor de Qualidade II', nameEn: 'Quality Director II', 
    leagueName: 'Diretor QA', subCategory: 2, minXp: 140000, 
    iconName: 'crown', colorGradient: 'from-purple-800 via-fuchsia-800 to-slate-900 border-purple-300/80', 
    borderColor: 'border-purple-300/80', textColor: 'text-purple-200', badgeBg: 'bg-purple-800/60', glowColor: 'rgba(192, 132, 252, 0.4)' 
  },
  { 
    id: 'director_1', name: 'Diretor de Qualidade I (CTFL Legend)', nameEn: 'Quality Director I (CTFL Legend)', 
    leagueName: 'Diretor QA', subCategory: 1, minXp: 175000, 
    iconName: 'crown', colorGradient: 'from-purple-700 via-pink-600 to-amber-600 border-amber-300', 
    borderColor: 'border-amber-300', textColor: 'text-amber-200', badgeBg: 'bg-purple-700/60', glowColor: 'rgba(251, 191, 36, 0.5)' 
  },
];

export function getLeagueFromXp(xp: number = 0, lang: 'pt' | 'en' = 'pt') {
  const safeXp = Math.max(0, xp || 0);
  let currentTier = LEAGUE_TIERS[0];
  let currentIndex = 0;

  for (let i = 0; i < LEAGUE_TIERS.length; i++) {
    if (safeXp >= LEAGUE_TIERS[i].minXp) {
      currentTier = LEAGUE_TIERS[i];
      currentIndex = i;
    } else {
      break;
    }
  }

  const nextTier = LEAGUE_TIERS[currentIndex + 1] || null;
  const currentMinXp = currentTier.minXp;
  const nextMinXp = nextTier ? nextTier.minXp : currentMinXp + 50000;

  const xpInTier = Math.max(0, safeXp - currentMinXp);
  const xpSpan = Math.max(1, nextMinXp - currentMinXp);
  const progressPercent = nextTier
    ? Math.min(100, Math.floor((xpInTier / xpSpan) * 100))
    : 100;

  const xpRemaining = nextTier ? Math.max(0, nextMinXp - safeXp) : 0;

  const displayTier = {
    ...currentTier,
    name: lang === 'en' ? currentTier.nameEn : currentTier.name,
  };

  return {
    currentTier: displayTier,
    currentIndex,
    nextTier,
    progressPercent,
    xpRemaining,
    nextMinXp,
  };
}

export function formatXp(val: number): string {
  if (val >= 1000000) {
    return `${(val / 1000000).toFixed(1)}M`;
  }
  if (val >= 1000) {
    return `${(val / 1000).toFixed(1)}k`;
  }
  return val.toString();
}
