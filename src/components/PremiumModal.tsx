import React, { useState } from 'react';
import { UserProfile } from '../types';
import { getCountryPricing, formatPrice, getEconomicAnalysis } from '../utils/pricing';
import { PaymentCheckoutModal } from './PaymentCheckoutModal';
import { TransactionType } from '../services/paymentProcessor';
import { 
  X, Crown, Zap, Heart, Sparkles, Coins, Globe, CreditCard, CheckCircle2, ShoppingBag, ArrowUpCircle
} from 'lucide-react';
import { translations } from '../utils/i18n';

interface PremiumModalProps {
  user: UserProfile;
  onClose: () => void;
  onTogglePlan: (newPlan: 'free' | 'premium') => void;
  onUserUpdate?: (updatedUser: UserProfile) => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  user,
  onClose,
  onTogglePlan,
  onUserUpdate,
}) => {
  const lang = user.language || 'pt';
  const t = translations[lang];

  const [activeTab, setActiveTab] = useState<'plans' | 'items' | 'coins'>('plans');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [xpAnimation, setXpAnimation] = useState<boolean>(false);

  // Checkout modal state
  const [checkoutState, setCheckoutState] = useState<{
    type: TransactionType;
    coinPackId?: 'pack300' | 'pack700' | 'pack1500';
  } | null>(null);

  const pricing = getCountryPricing(user.country || 'BR');
  const economicAnalysis = getEconomicAnalysis(pricing, lang);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleUpgrade = () => {
    if (user.plan === 'premium') {
      onTogglePlan('free');
      setPaymentSuccessMsg(lang === 'en' ? 'Switched to Free Plan.' : 'Plano alterado para Gratuito.');
      setTimeout(() => setPaymentSuccessMsg(null), 3500);
    } else {
      setCheckoutState({ type: 'subscription_pro' });
    }
  };

  const handleBuyCoins = (packId: 'pack300' | 'pack700' | 'pack1500') => {
    setCheckoutState({ type: 'coin_pack', coinPackId: packId });
  };

  // Buy 1 Life (50 Coins)
  const handleBuyLife = () => {
    if (!onUserUpdate) return;
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
    if (!onUserUpdate) return;
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
    if (!onUserUpdate) return;
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

    showToast(lang === 'en' ? '⚡ +100 XP added instantly!' : '⚡ +100 XP adicionados instantaneamente!');
  };

  // Buy 2x Double XP Boost (250 Coins)
  const handleBuyDoubleXp = () => {
    if (!onUserUpdate) return;
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
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-slate-100 relative">
        
        {/* Glow Header */}
        <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-amber-950 p-4 sm:p-5 text-center border-b border-amber-500/20 relative overflow-hidden shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-950/60 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 mb-1.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <ShoppingBag className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
            iTrail <span className="text-amber-400">{lang === 'en' ? 'Shop & Premium PRO' : 'Loja Oficial & Premium PRO'}</span>
          </h2>

          {/* Country Indicator Badge */}
          <div className="mt-2 inline-flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-xl border border-slate-800 text-[11px] text-slate-300">
            <Globe className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span className="font-bold text-white">
              {pricing.flag} {pricing.name} ({pricing.currencySymbol} {pricing.currencyCode})
            </span>
          </div>

          {/* Tab Switcher */}
          <div className="mt-3 flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 text-xs font-bold gap-1">
            <button
              onClick={() => setActiveTab('plans')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === 'plans'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="truncate">{lang === 'en' ? 'Plans' : 'Planos PRO'}</span>
            </button>

            <button
              onClick={() => setActiveTab('items')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === 'items'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{lang === 'en' ? 'Single Items' : 'Itens Avulsos'}</span>
            </button>

            <button
              onClick={() => setActiveTab('coins')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1 ${
                activeTab === 'coins'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Coins className="w-3.5 h-3.5 fill-current shrink-0" />
              <span className="truncate">{user.coins || 0} {lang === 'en' ? 'Coins' : 'Moedas'}</span>
            </button>
          </div>

        </div>

        {/* Success Alert */}
        {paymentSuccessMsg && (
          <div className="bg-emerald-500 text-slate-950 px-4 py-2 text-xs font-extrabold flex items-center justify-center gap-2 animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
            <span>{paymentSuccessMsg}</span>
          </div>
        )}

        {/* Toast Notification */}
        {toastMsg && (
          <div className="bg-teal-500 text-slate-950 px-4 py-2 text-xs font-extrabold flex items-center justify-center gap-2 animate-fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* XP Boost Animation Indicator */}
        {xpAnimation && (
          <div className="bg-gradient-to-r from-yellow-500 to-amber-500 text-slate-950 px-4 py-2 text-xs font-black flex items-center justify-center gap-2 animate-bounce shrink-0">
            <ArrowUpCircle className="w-5 h-5 stroke-[3] animate-spin" />
            <span>⚡ BARRA DE XP AUMENTOU (+100 XP)!</span>
          </div>
        )}

        {/* Content Body - Properly Scrollable Container */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          
          {/* TAB 1: SUBSCRIPTION PLANS */}
          {activeTab === 'plans' && (
            <>
              {/* Billing Cycle Switcher */}
              <div className="flex justify-center">
                <div className="inline-flex items-center bg-slate-950 p-1 rounded-xl border border-amber-500/30 text-xs">
                  <button
                    onClick={() => setBillingCycle('annual')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      billingCycle === 'annual'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'en' ? 'Annual' : 'Anual'} <span className="text-[9px] font-extrabold bg-emerald-500 text-slate-950 px-1 rounded ml-1">-33%</span>
                  </button>
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      billingCycle === 'monthly'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {lang === 'en' ? 'Monthly' : 'Mensal'}
                  </button>
                </div>
              </div>

              {/* Price Banner */}
              <div className="text-center bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
                <span className="text-2xl sm:text-3xl font-black text-white">
                  {billingCycle === 'annual'
                    ? formatPrice(pricing.premiumAnnualMonthlyEquivalent, pricing)
                    : formatPrice(pricing.premiumMonthly, pricing)}
                </span>
                <span className="text-xs text-slate-400 font-medium"> / {lang === 'en' ? 'month' : 'mês'}</span>
                {billingCycle === 'annual' && (
                  <span className="block text-[10px] text-amber-400 font-bold mt-0.5">
                    {lang === 'en' ? 'Billed annually' : 'Cobrado anualmente'} ({formatPrice(pricing.premiumAnnualTotal, pricing)}/{lang === 'en' ? 'year' : 'ano'})
                  </span>
                )}
              </div>

              {/* Comparison Matrix */}
              <div className="space-y-2 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="font-bold text-slate-300">{lang === 'en' ? 'Quiz Hearts & Lives' : 'Vidas nos Quizzes'}</span>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">Free: 5 Vidas</span>
                    <span className="text-amber-400 font-black block">PRO: ∞ Vidas Infinitas</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span className="font-bold text-slate-300">{lang === 'en' ? 'Mock Exams' : 'Simulados Oficiais'}</span>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">Free: 1 / mês</span>
                    <span className="text-amber-400 font-black block">PRO: 5 / mês</span>
                  </div>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-800">
                  <span className="font-bold text-slate-300">{lang === 'en' ? 'Free Review Mode' : 'Modo Revisão Livre'}</span>
                  <div className="text-right">
                    <span className="text-slate-500 block text-[10px]">Free: {lang === 'en' ? 'Limited' : 'Limitado'}</span>
                    <span className="text-amber-400 font-black block">PRO: {lang === 'en' ? 'Unlimited Access' : 'Acesso Ilimitado'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-slate-300">{lang === 'en' ? 'Clan Battles & Bonus' : 'Clãs & Bônus de Batalha'}</span>
                  <div className="text-right">
                    <span className="text-amber-400 font-bold block">2x Moedas em Clãs</span>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block">
                  {lang === 'en' ? 'Local Payment Methods' : 'Formas de Pagamento Locais'} ({pricing.name})
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {pricing.paymentMethods.map((pm) => (
                    <div key={pm.id} className="p-2 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-2 text-[11px] font-bold text-slate-200">
                      <CreditCard className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span className="truncate">{pm.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Economic Rationale Box */}
              <div className="bg-amber-950/20 border border-amber-500/30 p-3.5 rounded-2xl text-[11px] leading-relaxed space-y-1 text-slate-300">
                <h4 className="font-extrabold text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{economicAnalysis.title}</span>
                </h4>
                <p className="text-slate-300">{economicAnalysis.verdict}</p>
              </div>
            </>
          )}

          {/* TAB 2: SINGLE ITEMS & POWER-UPS */}
          {activeTab === 'items' && (
            <div className="space-y-3">
              {/* Wallet Balance Bar */}
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-amber-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coins className="w-6 h-6 fill-amber-400 text-amber-400" />
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block leading-none">{lang === 'en' ? 'Current Balance' : 'Saldo Atual'}</span>
                    <span className="text-base font-black text-white leading-none">{user.coins || 0} Moedas QA</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('coins')}
                  className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs shadow transition shrink-0"
                >
                  + {lang === 'en' ? 'Get Coins' : 'Comprar Moedas'}
                </button>
              </div>

              {/* Item 1: Buy 1 Life */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 fill-rose-500/30" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-white text-xs sm:text-sm">{lang === 'en' ? '+1 Life' : '1 Vida Adicional'}</h4>
                      <span className="text-[10px] text-slate-400 font-bold">({user.livesCurrent || 0}/{user.livesMax || 5})</span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {lang === 'en' ? 'Recovers 1 lost heart life.' : 'Recupera 1 vida de coração para usar nos quizzes.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBuyLife}
                  disabled={(user.livesCurrent || 0) >= (user.livesMax || 5)}
                  className={`px-3 py-2 rounded-xl font-extrabold text-xs transition shrink-0 flex items-center gap-1 ${
                    (user.livesCurrent || 0) >= (user.livesMax || 5)
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-rose-500/20 border border-rose-500/40 text-rose-300 hover:bg-rose-500/30'
                  }`}
                >
                  <Coins className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>50</span>
                </button>
              </div>

              {/* Item 2: +1 Extra Mock Exam Token */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 flex items-center justify-center shrink-0">
                    <Crown className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-white text-xs sm:text-sm">{lang === 'en' ? '+1 Extra Exam' : '+1 Simulado Extra'}</h4>
                      {user.extraMockExamTokens ? (
                        <span className="text-[9px] font-extrabold bg-teal-950 text-teal-300 border border-teal-500/40 px-1.5 py-0.5 rounded-full">
                          {user.extraMockExamTokens}
                        </span>
                      ) : null}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {lang === 'en' ? 'Unlocks 1 additional exam.' : 'Libera +1 simulado oficial completo.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBuyMockExam}
                  className="px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-extrabold text-xs transition shrink-0 flex items-center gap-1"
                >
                  <Coins className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>300</span>
                </button>
              </div>

              {/* Item 3: Instant +100 XP Pack */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
                    <Zap className="w-5 h-5 fill-amber-400/30 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-white text-xs sm:text-sm">{lang === 'en' ? '+100 XP Boost' : 'Pacote de +100 XP'}</h4>
                    <p className="text-[10px] text-slate-400">
                      {lang === 'en' ? 'Increases total XP instantly.' : 'Aumenta a sua barra de evolução imediatamente.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBuyXp}
                  className="px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-extrabold text-xs transition shrink-0 flex items-center gap-1"
                >
                  <Coins className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>100</span>
                </button>
              </div>

              {/* Item 4: 2x Double XP Boost */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-slate-950 flex items-center justify-center shrink-0 shadow">
                    <Sparkles className="w-5 h-5 fill-slate-950" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-extrabold text-white text-xs sm:text-sm">{lang === 'en' ? '2x XP (12h)' : 'XP em Dobro (2x)'}</h4>
                      {isDoubleXpActive && (
                        <span className="text-[9px] font-black bg-emerald-500 text-slate-950 px-1.5 py-0.5 rounded-full uppercase">
                          Ativo (~{doubleXpRemainingHours}h)
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400">
                      {lang === 'en' ? 'Doubles all XP earned for 12 hours.' : 'Ganha XP em dobro em lições, quizzes e duelos por 12h.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleBuyDoubleXp}
                  className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs transition shrink-0 flex items-center gap-1 shadow"
                >
                  <Coins className="w-3.5 h-3.5 fill-slate-950" />
                  <span>250</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: BUY COIN PACKS */}
          {activeTab === 'coins' && (
            <div className="space-y-4">
              
              {/* How to Earn Coins Free */}
              <div className="bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-[11px]">
                <h4 className="font-extrabold text-teal-400">{lang === 'en' ? 'Earn Free QA Coins by Studying:' : 'Como ganhar Moedas QA de graça?'}</h4>
                <ul className="space-y-1 text-slate-300 list-disc list-inside">
                  <li>{lang === 'en' ? 'Complete Chapter Quiz: +50 Coins' : 'Completar Quizzes de Capítulo: +50 Moedas'}</li>
                  <li>{lang === 'en' ? 'Pass Mock Exam: +100 Coins (+200 for 100%)' : 'Aprovação em Simulado: +100 Moedas (+200 em nota 100%)'}</li>
                  <li>{lang === 'en' ? 'Win 1v1 PvP Duel: +25 Coins' : 'Vencer Duelo 1v1: +25 Moedas'}</li>
                </ul>
              </div>

              {/* Buy Coin Packs with Real Money */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-200 block">
                  {lang === 'en' ? 'Buy Coins with Real Currency' : 'Comprar Moedas com Dinheiro Real'} ({pricing.currencyCode})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Pack 1 */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between text-center space-y-2">
                    <div>
                      <Coins className="w-6 h-6 text-amber-400 fill-amber-400 mx-auto" />
                      <span className="text-base font-black text-white block mt-1">300 Moedas</span>
                      <span className="text-[10px] text-slate-400 block">= 1 Simulado</span>
                    </div>
                    <button
                      onClick={() => handleBuyCoins('pack300')}
                      className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition"
                    >
                      {formatPrice(pricing.coinPacks.pack300.price, pricing)}
                    </button>
                  </div>

                  {/* Pack 2 */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-amber-500/40 relative flex flex-col justify-between text-center space-y-2">
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full uppercase">
                      Popular
                    </span>
                    <div>
                      <Coins className="w-6 h-6 text-amber-400 fill-amber-400 mx-auto mt-1" />
                      <span className="text-base font-black text-white block mt-1">700 Moedas</span>
                      <span className="text-[10px] text-emerald-400 font-bold block">+20% Bônus</span>
                    </div>
                    <button
                      onClick={() => handleBuyCoins('pack700')}
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:brightness-110 text-slate-950 font-black text-xs transition"
                    >
                      {formatPrice(pricing.coinPacks.pack700.price, pricing)}
                    </button>
                  </div>

                  {/* Pack 3 */}
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between text-center space-y-2">
                    <div>
                      <Coins className="w-6 h-6 text-amber-400 fill-amber-400 mx-auto" />
                      <span className="text-base font-black text-white block mt-1">1.500 Moedas</span>
                      <span className="text-[10px] text-emerald-400 font-bold block">+50% Bônus</span>
                    </div>
                    <button
                      onClick={() => handleBuyCoins('pack1500')}
                      className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-black text-xs transition"
                    >
                      {formatPrice(pricing.coinPacks.pack1500.price, pricing)}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Action Button for Subscription Plan */}
        {activeTab === 'plans' && (
          <div className="p-4 border-t border-slate-800 bg-slate-950 shrink-0">
            <button
              onClick={handleUpgrade}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <Crown className="w-4 h-4 sm:w-5 sm:h-5 fill-slate-950" />
              <span>
                {user.plan === 'premium' 
                  ? (lang === 'en' ? 'Switch to Free Plan' : 'Alternar para Plano Gratuito (Simulação)') 
                  : `${lang === 'en' ? 'Activate Premium PRO' : 'Ativar Plano Premium'} (${formatPrice(billingCycle === 'annual' ? pricing.premiumAnnualMonthlyEquivalent : pricing.premiumMonthly, pricing)}/${lang === 'en' ? 'mo' : 'mês'})`}
              </span>
            </button>
          </div>
        )}

      </div>

      {/* Payment Checkout Modal Overlay */}
      {checkoutState && (
        <PaymentCheckoutModal
          user={user}
          type={checkoutState.type}
          billingCycle={billingCycle}
          coinPackId={checkoutState.coinPackId}
          onClose={() => setCheckoutState(null)}
          onSuccess={(updatedUser, message) => {
            if (onUserUpdate) {
              onUserUpdate(updatedUser);
            }
            if (checkoutState.type === 'subscription_pro' && updatedUser.plan === 'premium') {
              onTogglePlan('premium');
            }
            setPaymentSuccessMsg(message);
            setCheckoutState(null);
            setTimeout(() => setPaymentSuccessMsg(null), 3500);
          }}
        />
      )}
    </div>
  );
};
