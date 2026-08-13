import React, { useState } from 'react';
import { UserProfile } from '../types';
import { getCountryPricing, formatPrice } from '../utils/pricing';
import { 
  X, Heart, Zap, Coins, Crown, Sparkles, CheckCircle2, ShoppingBag, Clock, ShieldAlert, ArrowUpCircle
} from 'lucide-react';

interface ShopModalProps {
  user: UserProfile;
  onClose: () => void;
  onUserUpdate: (updatedUser: UserProfile) => void;
  onOpenPremium: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({
  user,
  onClose,
  onUserUpdate,
  onOpenPremium,
}) => {
  const lang = user.language || 'pt';
  const countryPricing = getCountryPricing(user.country);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [xpAnimation, setXpAnimation] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Buy 1 Life (50 Coins)
  const handleBuyLife = () => {
    if ((user.livesCurrent || 0) >= (user.livesMax || 5)) {
      showToast(lang === 'en' ? 'Your lives are already full (5/5)!' : 'Suas vidas já estão cheias (5/5)!');
      return;
    }
    if ((user.coins || 0) < 50) {
      showToast(lang === 'en' ? 'You need 50 QA Coins to buy 1 Life!' : 'Você precisa de 50 Moedas QA para comprar 1 Vida!');
      return;
    }

    onUserUpdate({
      ...user,
      coins: user.coins - 50,
      livesCurrent: Math.min((user.livesMax || 5), (user.livesCurrent || 0) + 1),
    });

    showToast(lang === 'en' ? '❤️ +1 Life added to your account!' : '❤️ +1 Vida adicionada com sucesso!');
  };

  // Buy +1 Extra Mock Exam (300 Coins)
  const handleBuyMockExam = () => {
    if ((user.coins || 0) < 300) {
      showToast(lang === 'en' ? 'You need 300 QA Coins for 1 Extra Mock Exam!' : 'Você precisa de 300 Moedas QA para +1 Simulado Extra!');
      return;
    }

    onUserUpdate({
      ...user,
      coins: user.coins - 300,
      extraMockExamTokens: (user.extraMockExamTokens || 0) + 1,
    });

    showToast(lang === 'en' ? '🎟️ +1 Extra Mock Exam token added!' : '🎟️ +1 Ficha de Simulado Extra adicionada com sucesso!');
  };

  // Buy +100 XP Pack (100 Coins)
  const handleBuyXp = () => {
    if ((user.coins || 0) < 100) {
      showToast(lang === 'en' ? 'You need 100 QA Coins for +100 XP!' : 'Você precisa de 100 Moedas QA para +100 XP!');
      return;
    }

    const newXp = (user.xpTotal || 0) + 100;
    const newLevel = Math.floor(newXp / 500) + 1;

    onUserUpdate({
      ...user,
      coins: user.coins - 100,
      xpTotal: newXp,
      level: newLevel,
    });

    setXpAnimation(true);
    setTimeout(() => setXpAnimation(false), 2000);

    showToast(lang === 'en' ? '⚡ +100 XP added instantly! Level bar boosted.' : '⚡ +100 XP adicionados instantaneamente! Barra de evolução aumentada.');
  };

  // Buy 2x Double XP Boost (250 Coins)
  const handleBuyDoubleXp = () => {
    if ((user.coins || 0) < 250) {
      showToast(lang === 'en' ? 'You need 250 QA Coins for 12h Double XP!' : 'Você precisa de 250 Moedas QA para XP em Dobro por 12h!');
      return;
    }

    const doubleUntil = Date.now() + 12 * 60 * 60 * 1000;

    onUserUpdate({
      ...user,
      coins: user.coins - 250,
      doubleXpActiveUntil: doubleUntil,
    });

    showToast(lang === 'en' ? '🔥 2x XP Boost activated for 12 Hours!' : '🔥 Bônus 2x XP Ativado por 12 Horas!');
  };

  const isDoubleXpActive = (user.doubleXpActiveUntil || 0) > Date.now();
  const doubleXpRemainingHours = isDoubleXpActive
    ? Math.max(0, Math.ceil(((user.doubleXpActiveUntil || 0) - Date.now()) / (1000 * 60 * 60)))
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] text-slate-100 relative">
        
        {/* Header */}
        <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 p-5 border-b border-amber-500/20 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/60 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 shrink-0">
              <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 block">
                Loja de Vantagens
              </span>
              <h2 className="text-xl font-black text-white">
                Loja de Moedas QA
              </h2>
            </div>
          </div>

          {/* Wallet Balance Bar */}
          <div className="mt-4 bg-slate-950/80 p-3 rounded-2xl border border-amber-500/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="w-6 h-6 fill-amber-400 text-amber-400" />
              <div>
                <span className="text-xs text-slate-400 font-bold block leading-none">Saldo Atual</span>
                <span className="text-lg font-black text-white leading-none">{user.coins || 0} Moedas QA</span>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenPremium();
              }}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs shadow transition shrink-0"
            >
              + Comprar Moedas
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {toastMsg && (
          <div className="bg-emerald-500 text-slate-950 px-4 py-2 text-xs font-extrabold flex items-center justify-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* XP Boost Animation Indicator */}
        {xpAnimation && (
          <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 px-4 py-2 text-xs font-black flex items-center justify-center gap-2 animate-bounce">
            <ArrowUpCircle className="w-5 h-5 stroke-[3] animate-spin" />
            <span>⚡ BARRA DE XP AUMENTOU (+100 XP)!</span>
          </div>
        )}

        {/* Shop Items List */}
        <div className="p-5 overflow-y-auto space-y-3.5 text-xs flex-1">
          
          {/* Item 1: Buy 1 Life */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                <Heart className="w-5 h-5 fill-rose-500/30" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-white text-sm">1 Vida Adicional</h4>
                  <span className="text-[10px] text-slate-400 font-bold">({user.livesCurrent || 0}/{user.livesMax || 5})</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {lang === 'en' ? 'Recovers 1 lost heart life for chapter quizzes.' : 'Recupera 1 vida de coração para usar nos quizzes.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleBuyLife}
              disabled={(user.livesCurrent || 0) >= (user.livesMax || 5)}
              className={`px-3.5 py-2 rounded-xl font-extrabold text-xs transition shrink-0 flex items-center gap-1.5 ${
                (user.livesCurrent || 0) >= (user.livesMax || 5)
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
              }`}
            >
              <Coins className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>50 Moedas</span>
            </button>
          </div>

          {/* Item 2: +1 Extra Mock Exam Token */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-white text-sm">+1 Simulado Extra</h4>
                  {user.extraMockExamTokens ? (
                    <span className="text-[10px] font-extrabold bg-teal-950 text-teal-300 border border-teal-500/40 px-1.5 py-0.5 rounded-full">
                      {user.extraMockExamTokens} Ficha(s)
                    </span>
                  ) : null}
                </div>
                <p className="text-[11px] text-slate-400">
                  {lang === 'en' ? 'Unlocks 1 additional official 40-question exam.' : 'Libera +1 simulado oficial completo sem limites de plano.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleBuyMockExam}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-extrabold text-xs transition shrink-0 flex items-center gap-1.5"
            >
              <Coins className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>300 Moedas</span>
            </button>
          </div>

          {/* Item 3: Instant +100 XP Pack */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 fill-amber-400/30 text-amber-400" />
              </div>
              <div>
                <h4 className="font-extrabold text-white text-sm">Pacote de +100 XP</h4>
                <p className="text-[11px] text-slate-400">
                  {lang === 'en' ? 'Increases total XP instantly and levels up your progress.' : 'Aumenta a sua barra de evolução e nível imediatamente.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleBuyXp}
              className="px-3.5 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-extrabold text-xs transition shrink-0 flex items-center gap-1.5"
            >
              <Coins className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>100 Moedas</span>
            </button>
          </div>

          {/* Item 4: 2x Double XP Boost (12 Hours) */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shrink-0 shadow">
                <Sparkles className="w-5 h-5 fill-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-white text-sm">XP em Dobro (2x)</h4>
                  {isDoubleXpActive && (
                    <span className="text-[9px] font-black bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded-full uppercase">
                      Ativo (~{doubleXpRemainingHours}h)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">
                  {lang === 'en' ? 'Doubles all XP earned in lessons, quizzes and PvP for 12 hours.' : 'Ganha XP em dobro em lições, quizzes e duelos por 12 horas.'}
                </p>
              </div>
            </div>

            <button
              onClick={handleBuyDoubleXp}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs transition shrink-0 flex items-center gap-1.5 shadow"
            >
              <Coins className="w-3.5 h-3.5 fill-slate-950" />
              <span>250 Moedas</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 text-center text-[10px] text-slate-400">
          Moedas QA podem ser acumuladas estudando ou compradas no plano PRO.
        </div>

      </div>
    </div>
  );
};
