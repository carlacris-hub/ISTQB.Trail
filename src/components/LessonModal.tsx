import React, { useState } from 'react';
import { Lesson, Chapter } from '../types';
import { X, CheckCircle2, ChevronRight, ChevronLeft, Lightbulb, BookOpen } from 'lucide-react';

interface LessonModalProps {
  chapter: Chapter;
  lesson: Lesson;
  onClose: () => void;
  onCompleteLesson: (lessonId: string, xp: number) => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  chapter,
  lesson,
  onClose,
  onCompleteLesson,
}) => {
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const isLastSection = currentSectionIndex === lesson.content.length - 1;
  const currentSection = lesson.content[currentSectionIndex];

  const handleNext = () => {
    if (isLastSection) {
      onCompleteLesson(lesson.id, lesson.xpReward);
      onClose();
    } else {
      setCurrentSectionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-slate-100">
        
        {/* Top Bar */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
                {chapter.title}
              </span>
              <h3 className="font-bold text-sm text-white line-clamp-1">
                {lesson.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Slide Progress Bar */}
        <div className="bg-slate-950 px-5 py-2 flex items-center gap-1.5 border-b border-slate-800/80">
          {lesson.content.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full flex-1 transition-all ${
                idx <= currentSectionIndex ? 'bg-teal-400' : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Slide Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            {currentSection.sectionTitle}
          </h2>

          <p className="text-sm text-slate-300 leading-relaxed">
            {currentSection.text}
          </p>

          {currentSection.bulletPoints && currentSection.bulletPoints.length > 0 && (
            <ul className="space-y-2 pt-1">
              {currentSection.bulletPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="w-2 h-2 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}

          {currentSection.tip && (
            <div className="bg-amber-950/30 border border-amber-800/50 p-3.5 rounded-2xl flex items-start gap-3 text-amber-200 text-xs">
              <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-amber-300 mb-0.5">Dica para o Exame ISTQB:</span>
                <span>{currentSection.tip}</span>
              </div>
            </div>
          )}

          {currentSection.example && (
            <div className="bg-teal-950/30 border border-teal-800/40 p-3.5 rounded-2xl text-teal-200 text-xs">
              <span className="font-bold block text-teal-300 mb-1">💡 Exemplo Prático:</span>
              <p>{currentSection.example}</p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentSectionIndex === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs disabled:opacity-40 flex items-center gap-1 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          <button
            onClick={handleNext}
            className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-teal-500/20 transition"
          >
            {isLastSection ? (
              <>
                <CheckCircle2 className="w-4 h-4 fill-slate-950" />
                Concluir Lição (+{lesson.xpReward} XP)
              </>
            ) : (
              <>
                Próximo <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
