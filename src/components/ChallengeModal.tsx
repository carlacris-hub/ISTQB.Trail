import React, { useState, useEffect } from 'react';
import { UserProfile, LeaderboardUser, ChallengeItem, Question } from '../types';
import { getIstqbChapters } from '../data/istqbContent';
import { getChallenges, saveChallenges, addNotification } from '../utils/socialStorage';
import { 
  X, Swords, Clock, CheckCircle2, XCircle, Award, Trophy, Zap, Sparkles, ChevronRight 
} from 'lucide-react';
import { translations } from '../utils/i18n';

interface ChallengeModalProps {
  currentUser: UserProfile;
  targetOpponent?: LeaderboardUser;
  challengeIdToPlay?: string;
  onClose: () => void;
  onUserUpdate: (updatedUser: UserProfile) => void;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  currentUser,
  targetOpponent,
  challengeIdToPlay,
  onClose,
  onUserUpdate,
}) => {
  const lang = currentUser.language || 'pt';
  const t = translations[lang];

  // Steps: 'setup' | 'playing' | 'results'
  const [step, setStep] = useState<'setup' | 'playing' | 'results'>('setup');
  
  // Setup parameters
  const [questionCount, setQuestionCount] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'K1' | 'K2' | 'K3' | 'mixed'>('K2');
  const [selectedOpponent, setSelectedOpponent] = useState<LeaderboardUser | undefined>(targetOpponent);

  // Active playing questions state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  
  // Results calculation state
  const [activeChallenge, setActiveChallenge] = useState<ChallengeItem | null>(null);
  const [levelUpBonusGranted, setLevelUpBonusGranted] = useState<string | null>(null);

  useEffect(() => {
    // If challengeIdToPlay is provided, load existing challenge
    if (challengeIdToPlay) {
      const allChallenges = getChallenges();
      const existing = allChallenges.find(c => c.id === challengeIdToPlay);
      if (existing) {
        setActiveChallenge(existing);
        prepareQuestionsForChallenge(existing.questionCount, existing.difficulty);
        setStep('playing');
        setStartTime(Date.now());
      }
    }
  }, [challengeIdToPlay]);

  // Timer while playing
  useEffect(() => {
    let interval: any;
    if (step === 'playing') {
      interval = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const prepareQuestionsForChallenge = (count: number, diff: 'K1' | 'K2' | 'K3' | 'mixed') => {
    const chapters = getIstqbChapters(lang);
    let allQuestions: Question[] = [];
    chapters.forEach(ch => {
      allQuestions = [...allQuestions, ...ch.quizQuestions];
    });

    let filtered = allQuestions;
    if (diff !== 'mixed') {
      filtered = allQuestions.filter(q => q.taxonomy === diff);
    }

    // Shuffle and pick
    filtered = [...filtered].sort(() => Math.random() - 0.5);
    const selected = filtered.slice(0, Math.min(count, filtered.length));
    setQuestions(selected);
  };

  const handleStartSetupChallenge = () => {
    if (!selectedOpponent) return;
    prepareQuestionsForChallenge(questionCount, difficulty);
    setStep('playing');
    setStartTime(Date.now());
    setElapsedSeconds(0);
  };

  const handleSelectOption = (optionIndex: number) => {
    const newAnswers = [...userAnswers, optionIndex];
    setUserAnswers(newAnswers);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finished all questions in challenge
      finishChallengeTurn(newAnswers);
    }
  };

  const finishChallengeTurn = (finalAnswers: number[]) => {
    const totalTimeSec = Math.max(1, elapsedSeconds);
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (finalAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const isChallenger = !challengeIdToPlay;
    const opponent = selectedOpponent || {
      id: activeChallenge?.opponentId || 'col_1',
      name: activeChallenge?.opponentName || 'Carlos Eduardo',
    };

    let challengeToSave: ChallengeItem;

    if (isChallenger) {
      // Challenger played first
      challengeToSave = {
        id: `chal_${Date.now()}`,
        challengerId: currentUser.id,
        challengerName: currentUser.name,
        challengerAvatar: currentUser.avatarUrl,
        opponentId: opponent.id,
        opponentName: opponent.name,
        opponentAvatar: opponent.avatarUrl,
        questionCount: questions.length,
        difficulty,
        status: 'completed', // auto simulated opponent for instant feedback
        challengerScore: correctCount,
        challengerTimeSec: totalTimeSec,
        // Simulate opponent score
        opponentScore: Math.min(questions.length, Math.max(0, Math.floor(correctCount + (Math.random() > 0.5 ? 0 : -1)))),
        opponentTimeSec: Math.floor(totalTimeSec * (0.8 + Math.random() * 0.4)),
        rewardXp: 100,
        createdAt: 'Agora',
        questionIds: questions.map(q => q.id),
      };

      // Determine winner
      if (
        challengeToSave.challengerScore > (challengeToSave.opponentScore || 0) ||
        (challengeToSave.challengerScore === challengeToSave.opponentScore && challengeToSave.challengerTimeSec <= (challengeToSave.opponentTimeSec || 999))
      ) {
        challengeToSave.winnerId = currentUser.id;
      } else {
        challengeToSave.winnerId = opponent.id;
      }
    } else {
      // Responding to challenge
      const existing = activeChallenge!;
      existing.opponentScore = correctCount;
      existing.opponentTimeSec = totalTimeSec;
      existing.status = 'completed';

      if (
        (existing.opponentScore || 0) > existing.challengerScore ||
        (existing.opponentScore === existing.challengerScore && (existing.opponentTimeSec || 999) <= existing.challengerTimeSec)
      ) {
        existing.winnerId = currentUser.id;
      } else {
        existing.winnerId = existing.challengerId;
      }

      challengeToSave = existing;
    }

    // Save to challenges list
    const all = getChallenges();
    const updated = [challengeToSave, ...all.filter(c => c.id !== challengeToSave.id)];
    saveChallenges(updated);
    setActiveChallenge(challengeToSave);

    // Reward user if won
    const isWinner = challengeToSave.winnerId === currentUser.id;
    if (isWinner) {
      const xpGained = 100;
      const newXp = currentUser.xpTotal + xpGained;
      const oldLevel = currentUser.level;
      
      let updatedUser: UserProfile = {
        ...currentUser,
        xpTotal: newXp,
      };

      // Check level up reward
      const newLevel = Math.floor(newXp / 300) + 1;
      let rewardText = '';
      if (newLevel > oldLevel) {
        updatedUser.level = newLevel;
        // Grant Level-up reward
        updatedUser.mockExamsUsedThisMonth = Math.max(0, updatedUser.mockExamsUsedThisMonth - 1);
        updatedUser.livesCurrent = updatedUser.livesMax;
        rewardText = '+1 Token de Simulado Grátis + Vidas Recarregadas!';
      }

      onUserUpdate(updatedUser);
      setLevelUpBonusGranted(rewardText);

      // Add notification
      addNotification({
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.avatarUrl,
        type: 'challenge_result',
        title: 'Vitória no Duelo 1v1!',
        message: `Você venceu ${opponent.name} no Duelo 1v1 (${correctCount}/${questions.length} acertos em ${totalTimeSec}s) e ganhou +100 XP!`,
      });
    }

    setStep('results');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <Swords className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-extrabold text-white">{t.challengeTitle}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* STEP 1: SETUP */}
        {step === 'setup' && (
          <div className="p-6 space-y-5 overflow-y-auto">
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
              {t.challengeDesc}
            </p>

            {/* Target Opponent */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-1">Oponente Escolhido</label>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedOpponent?.avatarUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={selectedOpponent?.name || 'Oponente'}
                    className="w-10 h-10 rounded-xl object-cover border border-slate-800"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{selectedOpponent?.name || 'Carlos Eduardo'}</h4>
                    <span className="text-[10px] text-teal-400">{selectedOpponent?.company || 'QA Colleague'}</span>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded">
                  Pronto
                </span>
              </div>
            </div>

            {/* Question Count Selection */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">{t.questionCount}</label>
              <div className="grid grid-cols-3 gap-2">
                {[3, 5, 10].map(count => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setQuestionCount(count)}
                    className={`py-2.5 rounded-xl border text-xs font-black transition ${
                      questionCount === count
                        ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {count} Questões
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Taxonomy */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">{t.difficultyLevel}</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'K1', label: t.easyK1 },
                  { id: 'K2', label: t.mediumK2 },
                  { id: 'K3', label: t.hardK3 },
                  { id: 'mixed', label: t.mixedDifficulty },
                ].map(item => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDifficulty(item.id as any)}
                    className={`p-3 rounded-xl border text-left text-xs font-bold transition ${
                      difficulty === item.id
                        ? 'bg-teal-500/10 border-teal-500 text-teal-300 ring-1 ring-teal-500/30'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleStartSetupChallenge}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:brightness-110 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition"
            >
              <Swords className="w-4 h-4 stroke-[2.5]" />
              <span>{t.startDuel}</span>
            </button>
          </div>
        )}

        {/* STEP 2: PLAYING */}
        {step === 'playing' && questions.length > 0 && (
          <div className="p-6 space-y-5 overflow-y-auto">
            {/* Top Bar Status */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-2 border-b border-slate-800">
              <span className="text-amber-400">Questão {currentIndex + 1} de {questions.length}</span>
              <div className="flex items-center gap-1.5 text-white bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>{elapsedSeconds}s</span>
              </div>
            </div>

            {/* Question Card */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
              <span className="text-[10px] font-extrabold uppercase bg-teal-500/10 text-teal-400 border border-teal-500/20 px-2 py-0.5 rounded">
                Taxonomia {questions[currentIndex].taxonomy}
              </span>
              <p className="text-sm text-white font-medium leading-relaxed">
                {questions[currentIndex].stem}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2.5">
              {questions[currentIndex].options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-800/90 hover:border-teal-500/60 hover:bg-slate-900 text-left text-xs font-medium text-slate-200 transition flex items-center justify-between group"
                >
                  <span className="leading-relaxed pr-3">{opt}</span>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-teal-400 transition shrink-0" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: RESULTS */}
        {step === 'results' && activeChallenge && (
          <div className="p-6 text-center space-y-5 overflow-y-auto animate-fade-in">
            {activeChallenge.winnerId === currentUser.id ? (
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-xl">
                  <Trophy className="w-9 h-9 fill-amber-400" />
                </div>
                <h2 className="text-xl font-black text-amber-400">{t.challengeWon}</h2>
                <p className="text-xs text-slate-300">{t.challengeReward}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                  <Swords className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-extrabold text-white">{t.challengeLost}</h2>
                <p className="text-xs text-slate-400">Bom duelo! Pratique mais questões K2 e K3 para vencer a revanche.</p>
              </div>
            )}

            {/* Comparison Board */}
            <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
              <div className="border-r border-slate-800 pr-2 space-y-1">
                <span className="text-[10px] text-teal-400 font-bold block uppercase">{currentUser.name} (Você)</span>
                <span className="text-lg font-black text-white block">
                  {activeChallenge.winnerId === currentUser.id ? activeChallenge.challengerScore : activeChallenge.opponentScore || 0} / {activeChallenge.questionCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Tempo: {activeChallenge.winnerId === currentUser.id ? activeChallenge.challengerTimeSec : activeChallenge.opponentTimeSec}s</span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-amber-400 font-bold block uppercase">{activeChallenge.opponentName}</span>
                <span className="text-lg font-black text-white block">
                  {activeChallenge.winnerId === currentUser.id ? activeChallenge.opponentScore || 0 : activeChallenge.challengerScore} / {activeChallenge.questionCount}
                </span>
                <span className="text-[10px] text-slate-400 block">Tempo: {activeChallenge.winnerId === currentUser.id ? activeChallenge.opponentTimeSec : activeChallenge.challengerTimeSec}s</span>
              </div>
            </div>

            {/* Level up bonus alert */}
            {levelUpBonusGranted && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>Nível Subiu! Bônus: {levelUpBonusGranted}</span>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition"
            >
              Fechar Duelo
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
