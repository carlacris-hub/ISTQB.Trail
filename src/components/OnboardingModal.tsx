import React, { useState } from 'react';
import { UserProfile } from '../types';
import { translations } from '../utils/i18n';
import { ShieldCheck, Flame, Trophy, Users, Check, ArrowRight, Sparkles, BookOpen, Layers, Target } from 'lucide-react';

interface OnboardingModalProps {
  user: UserProfile;
  onFinish: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ user, onFinish }) => {
  const lang = user.language || 'pt';
  const t = translations[lang];

  const [step, setStep] = useState(0);

  const steps = [
    {
      icon: BookOpen,
      color: 'from-emerald-500 to-teal-500',
      title: t.step1Title,
      description: t.step1Desc,
      highlights: lang === 'en' ? [
        'Chapters 1 to 6 covering 100% of CTFL v4.0.1 syllabus',
        'Quick micro-lessons with practical QA examples',
        'Interactive quizzes at the end of each module'
      ] : [
        'Capítulos 1 a 6 cobrindo 100% do CTFL v4.0.1',
        'Micro-lições rápidas com exemplos práticos',
        'Quizzes interativos ao final de cada módulo'
      ]
    },
    {
      icon: Flame,
      color: 'from-amber-500 to-rose-500',
      title: t.step2Title,
      description: t.step2Desc,
      highlights: lang === 'en' ? [
        '5 Lives recharging automatically over time (Unlimited for PRO)',
        'Earn XP and level up from "Novice" to "ISTQB Master"',
        'Keep your Daily Streak alive by practicing daily'
      ] : [
        '5 Vidas que se recarregam com o tempo (Ilimitado para PRO)',
        'Acumule XP e suba de Nível de "Noviço" até "Mestre ISTQB"',
        'Mantenha seu Streak Diário ativando o app todos os dias'
      ]
    },
    {
      icon: Target,
      color: 'from-indigo-500 to-blue-600',
      title: t.step3Title,
      description: t.step3Desc,
      highlights: lang === 'en' ? [
        '40 Questions in official exam standard format',
        '60-minute countdown exam timer',
        'Official 65% passing score (26 correct answers)'
      ] : [
        '40 Questões no padrão oficial do exame',
        'Cronômetro de 60 minutos regressivo',
        'Nota de corte oficial de 65% (26 acertos)'
      ]
    },
    {
      icon: Users,
      color: 'from-purple-500 to-indigo-600',
      title: t.step4Title,
      description: t.step4Desc,
      highlights: lang === 'en' ? [
        'Join QA study clans and team up with peers',
        'Challenge colleagues to real-time 1v1 testing duels',
        'Compete in weekly leagues from Bronze to Diamond'
      ] : [
        'Participe de clãs de estudo com outros analistas de QA',
        'Desafie colegas em duelos 1v1 de questões ISTQB',
        'Dispute as ligas semanais do Bronze ao Diamante'
      ]
    }
  ];

  const currentStep = steps[step];
  const StepIcon = currentStep.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(prev => prev + 1);
    } else {
      onFinish();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-teal-500/30 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl text-slate-100 flex flex-col relative">
        
        {/* Step Indicator Top Progress Bar */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-400">
          <span>{t.tutorialTitle}</span>
          <span className="text-teal-400">Passo {step + 1} de {steps.length}</span>
        </div>

        <div className="flex-1 p-6 space-y-5 text-center">
          
          {/* Animated Icon Banner */}
          <div className={`w-20 h-20 rounded-3xl bg-gradient-to-tr ${currentStep.color} text-slate-950 flex items-center justify-center mx-auto shadow-xl shadow-teal-500/10`}>
            <StepIcon className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div>
            <h3 className="text-lg font-black text-white">{currentStep.title}</h3>
            <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
              {currentStep.description}
            </p>
          </div>

          {/* Bullet points highlights */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-left space-y-2.5">
            {currentStep.highlights.map((h, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
                <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span>{h}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i === step ? 'w-6 bg-teal-400' : 'w-2 bg-slate-800'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="py-3 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 transition flex items-center gap-2"
          >
            <span>{step === steps.length - 1 ? t.tutorialFinish : t.tutorialNext}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
