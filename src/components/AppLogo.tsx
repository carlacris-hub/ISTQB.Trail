import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

/**
 * Main ISTQB Trail Logo: Progress Ring with Magnifying Glass spotting a Bug
 * Rendered using the project's official dark teal, emerald, sky blue & purple palette.
 */
export const AppLogoIcon: React.FC<LogoProps> = ({ className = 'w-9 h-9', size }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 180 180"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="ISTQB Trail Progress & Bug Lens Logo"
    >
      <defs>
        <linearGradient id="appRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="appLensGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      {/* Card Background */}
      <rect x="6" y="6" width="168" height="168" rx="36" fill="#0f172a" stroke="#334155" strokeWidth="2.5" />

      {/* Progress Track Circle */}
      <circle cx="90" cy="90" r="56" fill="none" stroke="#1e293b" strokeWidth="12" />

      {/* Progress Active Ring Arc */}
      <circle
        cx="90"
        cy="90"
        r="56"
        fill="none"
        stroke="url(#appRingGrad)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray="250 352"
        transform="rotate(-100 90 90)"
      />

      {/* Magnifying Glass Lens */}
      <circle
        cx="82"
        cy="82"
        r="22"
        fill="none"
        stroke="url(#appLensGrad)"
        strokeWidth="7"
      />

      {/* Magnifying Glass Handle */}
      <line
        x1="97"
        y1="97"
        x2="116"
        y2="116"
        stroke="url(#appLensGrad)"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Bug Dot inside Lens */}
      <circle cx="76" cy="76" r="6" fill="#a855f7" />
    </svg>
  );
};

/**
 * Full Logo Banner showing the Progress Ring + Magnifying Glass concept
 */
export const AppLogoBanner: React.FC<{ className?: string }> = ({ className = 'w-full max-w-sm mx-auto' }) => {
  return (
    <div className={`rounded-3xl bg-slate-900/90 p-4 border border-slate-800 shadow-2xl flex flex-col items-center text-center ${className}`}>
      <AppLogoIcon className="w-32 h-32 mb-3" />
      <h3 className="text-lg font-black text-white tracking-tight">Anel de Progresso</h3>
      <p className="text-xs text-teal-400 font-medium mt-0.5">Lupa achando o bug (QA ISTQB)</p>
    </div>
  );
};
