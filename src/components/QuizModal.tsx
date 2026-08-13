import React, { useState } from 'react';
import { Chapter, Question, UserProfile } from '../types';
import { 
  X, CheckCircle2, XCircle, Heart, Zap, Award, Sparkles, AlertTriangle, Play, RefreshCw, Crown
} from 'lucide-react';

interface QuizModalProps {
  chapter: Chapter;
  user: UserProfile;
  isFreeReviewMode?: boolean;
  onClose: () => void;
  onDeductLife: () => void;
  onRewardXp: (xp: number) => void;
  onChapterComplete: (chapterId: number, badgeId: string) => void;
  onOpenPremium: () => void;
  onRechargeLifeAd: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  chapter,
  user,
  isFreeReviewMode = false,
  onClose,
  onDeductLife,
  onRewardXp,
  onChapterComplete,
  onOpenPremium,
  onRechargeLifeAd,
}) => {
  const [questions] = useState<Question[]>(chapter.quizQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [watchingAd, setWatchingAd] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isOutOfLives = user.plan === 'free' && user.livesCurrent <= 0 && !isFreeReviewMode;

  const handleSelectOption = (index: number) => {
    if (isAnswered || isOutOfLives) return;

    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.correctIndex;

    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      const xpGained = isFreeReviewMode ? 5 : 15;
      setTotalXpEarned(prev => prev + xpGained);
      onRewardXp(xpGained);
    } else {
      if (!isFreeReviewMode && user.plan === 'free') {
        onDeductLife();
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      const finalCorrect = correctCount + (selectedOption === currentQuestion.correctIndex ? 0 : 0);
      const passPercentage = Math.round((finalCorrect / questions.length) * 100);
      
      // Strict rule: Must get at least 70% correct (<= 30% wrong) to unlock next chapter
      if (!isFreeReviewMode && passPercentage >= 70) {
        onChapterComplete(chapter.id, chapter.badge.id);
      }
    }
  };

  const handleWatchAd = () => {
    setWatchingAd(true);
    setTimeout(() => {
      setWatchingAd(false);
      onRechargeLifeAd();
    }, 3000);
  };

  // Render "Out of Lives" Modal if user has no lives
  if (isOutOfLives && !isFinished) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-rose-500/40 rounded-3xl max-w-md w-full p-6 text-center text-slate-100 shadow-2xl relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Heart className="w-8 h-8 fill-rose-500" />
          </div>

          <h2 className="text-xl font-black text-white">Você está sem Vidas!</h2>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            Para continuar o quiz de capítulos sem perder seu progresso, escolha uma das opções abaixo:
          </p>

          <div className="mt-6 space-y-3">
            <button
              onClick={handleWatchAd}
              disabled={watchingAd}
              className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-teal-300 font-bold text-xs flex items-center justify-center gap-2 transition border border-teal-500/30"
            >
              <Play className="w-4 h-4 text-teal-400 fill-teal-400" />
              {watchingAd ? 'Carregando vídeo patrocinado (3s)...' : 'Assistir Anúncio para ganhar +1 Vida'}
            </button>

            <button
              onClick={onOpenPremium}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
            >
              <Crown className="w-4 h-4 fill-slate-950" />
              Seja Premium - Vidas Infinitas
            </button>

            <button
              onClick={onClose}
              className="w-full py-2.5 text-xs text-slate-400 hover:text-white transition"
            >
              Voltar para a Trilha
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Quiz Completed Summary
  if (isFinished) {
    const passPercentage = Math.round((correctCount / questions.length) * 100);
    const passedThreshold = passPercentage >= 70;

    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-center text-slate-100 shadow-2xl space-y-5">
          
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-xl ${
            passedThreshold 
              ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-emerald-500/20'
              : 'bg-gradient-to-tr from-rose-600 to-amber-600 text-white shadow-rose-500/20'
          }`}>
            {passedThreshold ? <Award className="w-10 h-10 stroke-[2.5]" /> : <AlertTriangle className="w-10 h-10 stroke-[2.5]" />}
          </div>

          <div>
            <span className={`text-[10px] font-bold uppercase tracking-widest block ${passedThreshold ? 'text-teal-400' : 'text-rose-400'}`}>
              {passedThreshold ? 'Aprovado no Capítulo!' : 'Não Aprovado (Mínimo 70%)'}
            </span>
            <h2 className="text-xl font-black text-white mt-1">
              {chapter.title}
            </h2>
          </div>

          {/* Stats Box */}
          <div className="grid grid-cols-3 gap-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Acertos</span>
              <span className={`text-lg font-black ${passedThreshold ? 'text-emerald-400' : 'text-rose-400'}`}>{correctCount}/{questions.length}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">Taxa</span>
              <span className={`text-lg font-black ${passedThreshold ? 'text-teal-400' : 'text-amber-400'}`}>{passPercentage}%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-semibold block">XP Ganho</span>
              <span className="text-lg font-black text-amber-400">+{totalXpEarned}</span>
            </div>
          </div>

          {/* Result Banner */}
          {passedThreshold ? (
            !isFreeReviewMode && (
              <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 border border-amber-600/40 p-4 rounded-2xl text-amber-200 text-xs flex items-center gap-3 text-left">
                <Award className="w-8 h-8 text-amber-400 shrink-0" />
                <div>
                  <span className="font-bold text-amber-300 block">Capítulo Desbloqueado & Badge Conquistado!</span>
                  <span>{chapter.badge.name} - {chapter.badge.description}</span>
                </div>
              </div>
            )
          ) : (
            <div className="bg-rose-950/40 border border-rose-800/50 p-4 rounded-2xl text-rose-200 text-xs text-left space-y-1">
              <span className="font-bold text-rose-400 block">Atenção ao Regulamento ISTQB:</span>
              <p className="text-slate-300">
                Você errou mais de 30% das questões ({100 - passPercentage}% de erros). Para avançar ao próximo capítulo é necessário obter no mínimo 70% de acertos. Refaça o quiz para prosseguir!
              </p>
            </div>
          )}

          <button
            onClick={onClose}
            className={`w-full py-3 px-4 rounded-xl font-black text-sm shadow-lg transition ${
              passedThreshold
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-110 text-slate-950 shadow-teal-500/20'
                : 'bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700'
            }`}
          >
            {passedThreshold ? 'Continuar para a Trilha' : 'Tentar Novamente na Trilha'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-slate-100">
        
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">
                {chapter.title}
              </span>
              <span className="text-[9px] font-extrabold bg-slate-800 text-teal-300 px-1.5 py-0.5 rounded">
                Nível {currentQuestion.taxonomy}
              </span>
            </div>
            <h3 className="font-bold text-xs text-slate-300">
              Questão {currentIndex + 1} de {questions.length}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            {/* Lives Indicator */}
            {!isFreeReviewMode && (
              <div className="flex items-center gap-1 text-xs font-bold text-rose-400 bg-rose-950/40 border border-rose-800/40 px-2 py-0.5 rounded-full">
                <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                <span>{user.plan === 'premium' ? '∞' : user.livesCurrent}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question Stem */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <p className="text-sm font-semibold text-white leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
            {currentQuestion.stem}
          </p>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((optionText, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctIndex;

              let style = 'bg-slate-950 border-slate-800 text-slate-200 hover:border-teal-500/50';

              if (isAnswered) {
                if (isCorrect) {
                  style = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-semibold';
                } else if (isSelected) {
                  style = 'bg-rose-950/80 border-rose-500 text-rose-200 font-semibold';
                } else {
                  style = 'bg-slate-950/40 border-slate-900 text-slate-500 opacity-50';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs transition flex items-start gap-3 ${style}`}
                >
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{optionText}</span>
                  {isAnswered && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />}
                </button>
              );
            })}
          </div>

          {/* Explanation Box */}
          {isAnswered && (
            <div className={`p-4 rounded-2xl text-xs space-y-1.5 border animate-fadeIn ${
              selectedOption === currentQuestion.correctIndex
                ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200'
                : 'bg-rose-950/40 border-rose-800/50 text-rose-200'
            }`}>
              <span className="font-bold block text-xs">
                {selectedOption === currentQuestion.correctIndex ? '✓ Correto (+15 XP)!' : '✕ Incorreto!'}
              </span>
              <p className="leading-relaxed text-slate-300">
                {currentQuestion.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-end">
          <button
            onClick={handleNextQuestion}
            disabled={!isAnswered}
            className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:brightness-110 text-slate-950 font-extrabold text-xs shadow-lg shadow-teal-500/20 disabled:opacity-40 transition"
          >
            {currentIndex === questions.length - 1 ? 'Finalizar Quiz' : 'Próxima Questão →'}
          </button>
        </div>

      </div>
    </div>
  );
};
