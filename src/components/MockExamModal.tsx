import React, { useState, useEffect } from 'react';
import { Question, UserProfile, MockExamResult } from '../types';
import { getOfficialMockExamQuestions } from '../data/istqbContent';
import { 
  X, Clock, Award, CheckCircle2, XCircle, Flag, ChevronLeft, ChevronRight, Grid, Sparkles, AlertCircle, Crown, Coins
} from 'lucide-react';
import { translations } from '../utils/i18n';
import { getCountryPricing, formatPrice } from '../utils/pricing';

interface MockExamModalProps {
  user: UserProfile;
  onClose: () => void;
  onCompleteMockExam: (result: MockExamResult) => void;
  onOpenPremium: () => void;
  onUserUpdate?: (updatedUser: UserProfile) => void;
}

export const MockExamModal: React.FC<MockExamModalProps> = ({
  user,
  onClose,
  onCompleteMockExam,
  onOpenPremium,
  onUserUpdate,
}) => {
  const lang = user.language || 'pt';
  const t = translations[lang];
  const countryPricing = getCountryPricing(user.country);

  const [bypassedLimit, setBypassedLimit] = useState(false);
  const maxExams = user.plan === 'premium' ? 5 : 1;
  const isLimitReached = !bypassedLimit && user.mockExamsUsedThisMonth >= maxExams;

  const handleUseTokenOrCoins = () => {
    if (!onUserUpdate) return;
    if ((user.extraMockExamTokens || 0) > 0) {
      onUserUpdate({
        ...user,
        extraMockExamTokens: user.extraMockExamTokens! - 1,
      });
      setBypassedLimit(true);
    } else if ((user.coins || 0) >= 300) {
      onUserUpdate({
        ...user,
        coins: user.coins - 300,
      });
      setBypassedLimit(true);
    }
  };

  const [questions] = useState<Question[]>(() => {
    return getOfficialMockExamQuestions(lang);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});
  const [secondsRemaining, setSecondsRemaining] = useState(3600); // 60 minutes = 3600s
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [showGridDrawer, setShowGridDrawer] = useState(false);
  const [finalResult, setFinalResult] = useState<MockExamResult | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isExamFinished || isLimitReached) return;

    const timer = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamFinished, isLimitReached]);

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isExamFinished) return;
    setUserAnswers(prev => ({ ...prev, [currentIndex]: optionIndex }));
  };

  const toggleFlag = () => {
    setFlaggedQuestions(prev => ({ ...prev, [currentIndex]: !prev[currentIndex] }));
  };

  const handleSubmitExam = () => {
    if (isExamFinished) return;

    let correct = 0;
    const answerDetails = questions.map((q, idx) => {
      const selected = userAnswers[idx] ?? -1;
      const isRight = selected === q.correctIndex;
      if (isRight) correct += 1;
      return {
        questionId: q.id,
        userSelectedIndex: selected,
        correctIndex: q.correctIndex,
        isCorrect: isRight,
        chapterId: q.chapterId,
      };
    });

    const percentage = Math.round((correct / questions.length) * 100);
    const passed = percentage >= 65; // ISTQB official cutoff is 65% (26/40)

    const result: MockExamResult = {
      id: `exam_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      timeSpentSeconds: 3600 - secondsRemaining,
      score: correct,
      percentage,
      passed,
      answers: answerDetails,
    };

    setFinalResult(result);
    setIsExamFinished(true);
    onCompleteMockExam(result);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Limit Exceeded View
  if (isLimitReached && !isExamFinished) {
    const hasTokens = (user.extraMockExamTokens || 0) > 0;
    const hasEnoughCoins = (user.coins || 0) >= 300;

    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-center text-slate-100 shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>

          <h2 className="text-xl font-black text-white">Limite Mensal de Simulados Atingido</h2>
          
          <p className="text-xs text-slate-300 leading-relaxed">
            {user.plan === 'free'
              ? `No plano Free (${countryPricing.flag} ${countryPricing.name}), você tem direito a 1 simulado mensal. Você pode resgatar 1 simulado extra usando 300 Moedas QA ou assinar o Plano PRO por ${formatPrice(countryPricing.premiumMonthly, countryPricing)}/mês!`
              : `Você utilizou os 5 simulados inclusos este mês. Resgate simulados extras usando suas Moedas QA acumuladas!`}
          </p>

          {/* Wallet summary */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="font-bold text-slate-200">Seu Saldo: {user.coins || 0} Moedas QA</span>
            </div>
            {hasTokens && (
              <span className="text-[10px] font-extrabold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-full border border-teal-500/30">
                {user.extraMockExamTokens} Ficha(s) Extra
              </span>
            )}
          </div>

          <div className="pt-2 space-y-2">
            {hasTokens ? (
              <button
                onClick={handleUseTokenOrCoins}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                Usar 1 Ficha de Simulado Extra
              </button>
            ) : hasEnoughCoins ? (
              <button
                onClick={handleUseTokenOrCoins}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
              >
                <Coins className="w-4 h-4 fill-slate-950" />
                Resgatar Simulado por 300 Moedas QA
              </button>
            ) : (
              <button
                onClick={onOpenPremium}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
              >
                <Coins className="w-4 h-4 fill-slate-950" />
                Comprar Moedas ({formatPrice(countryPricing.coinPacks.pack300.price, countryPricing)}) ou Seja PRO
              </button>
            )}

            {user.plan === 'free' && (
              <button
                onClick={onOpenPremium}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 transition"
              >
                <Crown className="w-4 h-4 fill-amber-400 text-amber-400" />
                Assinar Plano PRO ({formatPrice(countryPricing.premiumMonthly, countryPricing)}/mês)
              </button>
            )}

            <button
              onClick={onClose}
              className="w-full py-2 text-xs text-slate-400 hover:text-white transition"
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Final Results Summary View
  if (isExamFinished && finalResult) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-slate-100">
          
          <div className="p-6 text-center space-y-4 border-b border-slate-800 bg-slate-950/60">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-xl ${
              finalResult.passed ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500 text-white'
            }`}>
              <Award className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div>
              <span className={`text-[11px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block mb-1 ${
                finalResult.passed ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              }`}>
                {finalResult.passed ? 'APROVADO NO EXAME SIMULADO!' : 'REPROVADO - NECESSITA REVISÃO'}
              </span>
              <h2 className="text-xl font-black text-white">Resultado do Simulado ISTQB</h2>
            </div>

            <div className="grid grid-cols-3 gap-2 bg-slate-900 p-3 rounded-2xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Nota Final</span>
                <span className="text-lg font-black text-white">{finalResult.score}/40</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Aproveitamento</span>
                <span className={`text-lg font-black ${finalResult.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {finalResult.percentage}%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block">Tempo Gasto</span>
                <span className="text-lg font-black text-teal-400">{formatTime(finalResult.timeSpentSeconds)}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300">
              {finalResult.passed
                ? 'Parabéns! Sua nota ultrapassou a nota de corte oficial de 65% (26 acertos). Você está no caminho certo para passar na prova oficial ISTQB!'
                : 'A nota de corte oficial é 65% (26 acertos em 40). Use o modo de revisão de capítulos para reforçar seus pontos fracos.'}
            </p>
          </div>

          {/* Full Review list */}
          <div className="p-6 overflow-y-auto flex-1 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Revisão de Respostas do Exame
            </h3>

            {questions.map((q, idx) => {
              const userAns = finalResult.answers[idx];
              const isRight = userAns.isCorrect;

              return (
                <div key={idx} className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                  isRight ? 'bg-emerald-950/20 border-emerald-800/40' : 'bg-rose-950/20 border-rose-800/40'
                }`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-white">Q{idx + 1}. {q.chapterTitle}</span>
                    <span className={`font-extrabold text-[10px] ${isRight ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isRight ? '✓ Correto' : '✕ Errado'}
                    </span>
                  </div>
                  <p className="text-slate-300 leading-snug">{q.stem}</p>
                  <div className="text-[11px] text-slate-400 pt-1">
                    <span>Sua resposta: <b>{userAns.userSelectedIndex >= 0 ? q.options[userAns.userSelectedIndex] : 'Não respondida'}</b></span>
                    {!isRight && <p className="text-emerald-400 mt-0.5">Resposta correta: <b>{q.options[q.correctIndex]}</b></p>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-950">
            <button
              onClick={onClose}
              className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-lg shadow-teal-500/20 transition"
            >
              Concluir e Salvar Resultado
            </button>
          </div>

        </div>
      </div>
    );
  }

  // Active Exam View
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col h-[90vh] text-slate-100">
        
        {/* Exam Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400 bg-amber-950/50 border border-amber-800/50 px-3 py-1 rounded-full">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{formatTime(secondsRemaining)}</span>
            </div>

            <span className="text-xs font-bold text-slate-300 hidden sm:inline">
              Simulado Oficial ISTQB CTFL v4.0
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Flag */}
            <button
              onClick={toggleFlag}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border transition ${
                flaggedQuestions[currentIndex]
                  ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
              }`}
            >
              <Flag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Marcar para revisar</span>
            </button>

            {/* Matrix Drawer button */}
            <button
              onClick={() => setShowGridDrawer(!showGridDrawer)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
              title="Abrir matriz de questões"
            >
              <Grid className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* Question Matrix Drawer */}
          {showGridDrawer && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">
                  Matriz de Respostas ({Object.keys(userAnswers).length}/{questions.length} respondidas)
                </span>
                <button
                  onClick={() => setShowGridDrawer(false)}
                  className="text-[11px] text-teal-400 font-semibold"
                >
                  Fechar
                </button>
              </div>

              <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5">
                {questions.map((_, idx) => {
                  const isAnswered = userAnswers[idx] !== undefined;
                  const isFlagged = flaggedQuestions[idx];
                  const isCurr = idx === currentIndex;

                  let bg = 'bg-slate-900 text-slate-400 border-slate-800';
                  if (isAnswered) bg = 'bg-teal-500/20 text-teal-300 border-teal-500/40 font-bold';
                  if (isFlagged) bg = 'bg-amber-500/20 text-amber-400 border-amber-500/50';
                  if (isCurr) bg += ' ring-2 ring-teal-400';

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentIndex(idx);
                        setShowGridDrawer(false);
                      }}
                      className={`h-8 rounded-lg border text-xs flex items-center justify-center transition ${bg}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Question Title */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold text-teal-400">{currentQuestion.chapterTitle}</span>
            <span>Questão {currentIndex + 1} de {questions.length}</span>
          </div>

          <p className="text-sm font-semibold text-white leading-relaxed bg-slate-950 p-4 rounded-2xl border border-slate-800">
            {currentQuestion.stem}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQuestion.options.map((optionText, idx) => {
              const isSelected = userAnswers[currentIndex] === idx;

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3.5 rounded-xl border text-left text-xs transition flex items-start gap-3 ${
                    isSelected
                      ? 'bg-teal-950/80 border-teal-500 text-teal-200 font-semibold'
                      : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-teal-500/50'
                  }`}
                >
                  <span className="w-5 h-5 rounded-md bg-slate-800 text-slate-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 leading-relaxed">{optionText}</span>
                </button>
              );
            })}
          </div>

        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-2">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white font-bold text-xs disabled:opacity-40 flex items-center gap-1 transition"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>

          <button
            onClick={handleSubmitExam}
            className="py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition shadow-md"
          >
            Entregar Prova
          </button>

          <button
            onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
            disabled={currentIndex === questions.length - 1}
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:brightness-110 text-slate-950 font-black text-xs disabled:opacity-40 flex items-center gap-1 transition shadow-md shadow-teal-500/20"
          >
            Próxima <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
