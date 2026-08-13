import React, { useState } from 'react';
import { Chapter, UserProfile } from '../types';
import { 
  ShieldCheck, Layers, FileText, Cpu, BarChart3, Wrench, 
  CheckCircle2, Lock, BookOpen, Play, RefreshCw, Award, Sparkles, ChevronRight
} from 'lucide-react';
import { translations } from '../utils/i18n';

interface ChapterTrailProps {
  chapters: Chapter[];
  user: UserProfile;
  onStartLesson: (chapter: Chapter, lessonId: string) => void;
  onStartQuiz: (chapter: Chapter) => void;
  onStartFreeReview: (chapter: Chapter) => void;
}

export const ChapterTrail: React.FC<ChapterTrailProps> = ({
  chapters,
  user,
  onStartLesson,
  onStartQuiz,
  onStartFreeReview,
}) => {
  const lang = user.language || 'pt';
  const t = translations[lang];

  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(1);

  // Helper to resolve dynamic icons
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return ShieldCheck;
      case 'Layers': return Layers;
      case 'FileText': return FileText;
      case 'Cpu': return Cpu;
      case 'BarChart3': return BarChart3;
      case 'Wrench': return Wrench;
      default: return BookOpen;
    }
  };

  // Handle Start Quiz with Guest check
  const handleQuizClick = (chapter: Chapter) => {
    if (user.authProvider === 'guest' || !user.isLoggedIn) {
      alert(t.guestNoticeAlert);
      return;
    }
    onStartQuiz(chapter);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 border border-teal-800/50 rounded-2xl p-5 shadow-xl text-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex items-start justify-between gap-3 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> {t.officialSyllabus}
            </div>
            <h2 className="text-xl font-black tracking-tight text-white">
              {t.appTitle} {t.appSubtitle}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-sm leading-relaxed">
              {t.syllabusDesc}
            </p>
          </div>
          <div className="text-right bg-slate-950/50 border border-slate-800 p-2.5 rounded-xl min-w-[90px]">
            <span className="text-[10px] text-slate-400 block font-semibold uppercase">{t.streak}</span>
            <span className="text-lg font-black text-teal-400">
              {user.completedChapterIds.length}/{chapters.length}
            </span>
            <span className="text-[10px] text-slate-400 block">{t.chapterProgress}</span>
          </div>
        </div>
      </div>

      {/* Chapters Node List */}
      <div className="relative space-y-6">
        
        {/* Connecting trail line */}
        <div className="absolute left-7 top-8 bottom-8 w-1 bg-slate-800 -z-0" />

        {chapters.map((chapter, index) => {
          const isCompleted = user.completedChapterIds.includes(chapter.id);
          const isGuest = user.authProvider === 'guest' || !user.isLoggedIn;
          // Current is first uncompleted chapter or selected
          const isPreviousCompleted = index === 0 || user.completedChapterIds.includes(chapters[index - 1].id);
          const isLocked = (isGuest && chapter.id > 1) || (!isPreviousCompleted && !isCompleted);
          const isSelected = selectedChapterId === chapter.id;

          const IconComp = getIcon(chapter.iconName);

          return (
            <div key={chapter.id} className="relative z-10 transition-all">
              
              {/* Chapter Card Header / Node Button */}
              <div
                onClick={() => setSelectedChapterId(isSelected ? null : chapter.id)}
                className={`flex items-start gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                  isCompleted
                    ? 'bg-slate-900/90 border-emerald-500/40 hover:border-emerald-500/70 shadow-lg shadow-emerald-950/20'
                    : isLocked
                    ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                    : 'bg-slate-900 border-teal-500/60 ring-2 ring-teal-500/20 shadow-xl'
                }`}
              >
                
                {/* Node Icon Circle */}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                  isCompleted
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : isLocked
                    ? 'bg-slate-800 text-slate-500'
                    : `bg-gradient-to-tr ${chapter.color} text-white shadow-teal-500/20`
                }`}>
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                  ) : isLocked ? (
                    <Lock className="w-5 h-5" />
                  ) : (
                    <IconComp className="w-6 h-6" />
                  )}
                </div>

                {/* Info Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">
                      {chapter.syllabusReference}
                    </span>
                    {isCompleted && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                        <Award className="w-3 h-3" /> {lang === 'en' ? 'Completed' : 'Concluído'}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-white truncate mt-0.5">
                    {chapter.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                    {chapter.subtitle}
                  </p>
                </div>

                <div className="text-slate-400 self-center">
                  <ChevronRight className={`w-5 h-5 transition-transform ${isSelected ? 'rotate-90 text-teal-400' : ''}`} />
                </div>
              </div>

              {/* Expandable Chapter Content Drawer */}
              {isSelected && (
                <div className="mt-3 ml-4 pl-6 border-l-2 border-teal-500/40 space-y-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 shadow-inner">
                  
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {chapter.description}
                  </p>

                  {/* Micro-lessons list */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {t.microLessons} ({chapter.lessons.length})
                    </span>

                    <div className="grid gap-2">
                      {chapter.lessons.map((lesson) => {
                        const isLessonDone = user.completedLessonIds.includes(lesson.id);
                        return (
                          <div
                            key={lesson.id}
                            onClick={() => onStartLesson(chapter, lesson.id)}
                            className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/50 cursor-pointer transition group"
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                                isLessonDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-300 group-hover:bg-teal-500/20 group-hover:text-teal-300'
                              }`}>
                                <BookOpen className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <h4 className="text-xs font-semibold text-slate-200 group-hover:text-white">
                                  {lesson.title}
                                </h4>
                                <span className="text-[10px] text-slate-400">+{lesson.xpReward} XP</span>
                              </div>
                            </div>

                            <span className="text-xs font-semibold text-teal-400 group-hover:translate-x-0.5 transition-transform">
                              {isLessonDone ? t.review : t.read} →
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions Bar for Quiz / Review */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    
                    <button
                      onClick={() => handleQuizClick(chapter)}
                      disabled={isLocked}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-110 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20 disabled:opacity-50 transition"
                    >
                      <Play className="w-4 h-4 fill-slate-950" />
                      {isCompleted ? t.retakeQuiz : `${t.startQuiz} (+50 XP)`}
                    </button>

                    <button
                      onClick={() => onStartFreeReview(chapter)}
                      className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition"
                      title={lang === 'en' ? 'Practice with unlimited lives and no timer' : 'Praticar sem limite de vidas e sem tempo'}
                    >
                      <RefreshCw className="w-3.5 h-3.5 text-teal-400" />
                      {t.freeReview}
                    </button>
                  </div>

                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
};
