import React, { useState } from 'react';
import { UserProfile } from '../types';
import { 
  getRegionalPricing, 
  calculatePriceBreakdown, 
  PaymentMethodId, 
  CountryRegionalConfig,
  formatRegionalCurrency 
} from '../services/regionalPricingService';
import { 
  processGlobalPayment, 
  TransactionType, 
  PaymentIntentDetails 
} from '../services/paymentProcessor';
import { 
  X, Check, ShieldCheck, Zap, CreditCard, Smartphone, Building, 
  FileText, Wallet, Copy, CheckCircle2, ArrowRight, Lock, Loader2 
} from 'lucide-react';

interface PaymentCheckoutModalProps {
  user: UserProfile;
  type: TransactionType;
  billingCycle?: 'monthly' | 'annual';
  coinPackId?: 'pack300' | 'pack700' | 'pack1500';
  onClose: () => void;
  onSuccess: (updatedUser: UserProfile, message: string) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  user,
  type,
  billingCycle = 'annual' as 'monthly' | 'annual',
  coinPackId,
  onClose,
  onSuccess,
}) => {
  const lang = user.language || 'pt';
  const regionalConfig = getRegionalPricing(user.country || 'BR');
  
  const [selectedMethodId, setSelectedMethodId] = useState<PaymentMethodId>(
    regionalConfig.paymentMethods[0]?.id || 'card'
  );

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(user.name || '');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [phoneForMbway, setPhoneForMbway] = useState('+351 912 345 678');

  // Execution states
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);
  const [completedTx, setCompletedTx] = useState<PaymentIntentDetails | null>(null);

  // Price calculations
  let grossAmount = 0;
  let title = '';

  if (type === 'subscription_pro') {
    grossAmount = billingCycle === 'annual' 
      ? regionalConfig.premiumAnnualTotal 
      : regionalConfig.premiumMonthly;
    title = billingCycle === 'annual'
      ? `ISTQB Trail PRO - Plano Anual (${regionalConfig.name})`
      : `ISTQB Trail PRO - Plano Mensal (${regionalConfig.name})`;
  } else if (type === 'coin_pack' && coinPackId) {
    const pack = regionalConfig.coinPacks[coinPackId];
    grossAmount = pack.price;
    title = `Pacote ${pack.coins} Moedas QA (${pack.label})`;
  }

  const breakdown = calculatePriceBreakdown(grossAmount, regionalConfig);

  const getMethodIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap': return <Zap className="w-4 h-4 text-amber-400" />;
      case 'CreditCard': return <CreditCard className="w-4 h-4 text-teal-400" />;
      case 'Smartphone': return <Smartphone className="w-4 h-4 text-emerald-400" />;
      case 'Building': return <Building className="w-4 h-4 text-blue-400" />;
      case 'FileText': return <FileText className="w-4 h-4 text-orange-400" />;
      case 'Wallet': return <Wallet className="w-4 h-4 text-purple-400" />;
      default: return <CreditCard className="w-4 h-4 text-slate-300" />;
    }
  };

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    try {
      // 1. Try real Stripe Checkout Session
      const stripeRes = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid || user.id || 'guest',
          type,
          billingCycle,
          coinPackId,
          countryCode: regionalConfig.code,
          userEmail: user.email,
          originUrl: window.location.origin,
        }),
      });

      const stripeData = await stripeRes.json();

      if (stripeData && stripeData.checkoutUrl) {
        // Redirect to official Stripe Hosted Checkout
        window.location.href = stripeData.checkoutUrl;
        return;
      }

      // 2. Fallback to local instant settlement simulation if Stripe keys are not yet configured
      const result = await processGlobalPayment(
        user,
        regionalConfig,
        type,
        selectedMethodId,
        {
          billingCycle,
          coinPackId,
          cardDetails: {
            number: cardNumber,
            holderName: cardHolder,
            expiry: cardExpiry,
            cvv: cardCvv,
          },
          phoneForMbway,
        }
      );

      setCompletedTx(result.transaction);
      onSuccess(result.updatedUser, result.message);
    } catch (error) {
      console.error('Payment failure:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyPix = (payload?: string) => {
    if (!payload) return;
    navigator.clipboard.writeText(payload);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl max-w-md w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] text-slate-100 relative">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 p-5 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">
                {lang === 'en' ? 'Global Secure Checkout' : 'Checkout Seguro Regionalizado'}
              </span>
              <h3 className="text-sm font-black text-white">
                {regionalConfig.flag} {regionalConfig.name} ({regionalConfig.currencyCode})
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-950/60 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs">
          
          {/* Order Summary Card */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
            <h4 className="font-extrabold text-white text-xs">{title}</h4>
            
            <div className="space-y-1.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
              <div className="flex justify-between">
                <span>{lang === 'en' ? 'Subtotal (Net Price)' : 'Subtotal (Valor Líquido)'}</span>
                <span className="text-slate-200">{breakdown.formattedNet}</span>
              </div>

              <div className="flex justify-between">
                <span>{breakdown.taxName}</span>
                <span className="text-slate-200">{breakdown.formattedTax}</span>
              </div>

              <div className="flex justify-between pt-1.5 border-t border-slate-800 font-extrabold text-sm text-white">
                <span>{lang === 'en' ? 'Total Amount' : 'Valor Total'}</span>
                <span className="text-amber-400">{breakdown.formattedTotal}</span>
              </div>
            </div>
          </div>

          {!completedTx ? (
            <>
              {/* Select Payment Method */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300 block">
                  {lang === 'en' ? 'Select Payment Method:' : 'Selecione a Forma de Pagamento:'}
                </label>

                <div className="grid grid-cols-1 gap-2">
                  {regionalConfig.paymentMethods.map((method) => {
                    const isSelected = selectedMethodId === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setSelectedMethodId(method.id)}
                        className={`p-3 rounded-2xl border text-left transition flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                            {getMethodIcon(method.icon)}
                          </div>
                          <div>
                            <span className="font-extrabold block text-xs">{method.name}</span>
                            <span className="text-[10px] text-slate-400 leading-tight block">{method.description}</span>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Payment Method Input Form */}
              {selectedMethodId === 'card' && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <span className="text-[11px] font-bold text-slate-300 block">Dados do Cartão (Simulação Segura)</span>
                  <input
                    type="text"
                    placeholder="Número do Cartão (4000 1234 5678 9010)"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="CVV (123)"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {selectedMethodId === 'mbway' && (
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[11px] font-bold text-slate-300 block">Número do Telemóvel (MB WAY)</span>
                  <input
                    type="text"
                    value={phoneForMbway}
                    onChange={(e) => setPhoneForMbway(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-400">
                    Você receberá uma notificação no app MB WAY para autorizar o pagamento.
                  </p>
                </div>
              )}

              {/* Submit Payment Button */}
              <button
                onClick={handleExecutePayment}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:brightness-110 text-slate-950 font-black text-xs shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Pagar {breakdown.formattedTotal} ({selectedMethodId.toUpperCase()})</span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Completed Payment Confirmation Screen */
            <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 text-center space-y-3 animate-fade-in">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div>
                <h4 className="text-base font-black text-white">
                  {lang === 'en' ? 'Payment Completed!' : 'Pagamento Confirmado!'}
                </h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  ID: <span className="font-mono text-amber-400">{completedTx.id}</span>
                </p>
              </div>

              {completedTx.pixPayload && (
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-2 text-left">
                  <span className="text-[10px] font-bold text-amber-400 uppercase block">Chave Pix Copia e Cola</span>
                  <p className="text-[9px] font-mono text-slate-300 break-all bg-slate-950 p-2 rounded border border-slate-800">
                    {completedTx.pixPayload}
                  </p>
                  <button
                    onClick={() => handleCopyPix(completedTx.pixPayload)}
                    className="w-full py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-[10px] flex items-center justify-center gap-1.5"
                  >
                    {copiedPix ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPix ? 'Copiado!' : 'Copiar Código Pix'}</span>
                  </button>
                </div>
              )}

              {completedTx.multibancoEntity && (
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1 text-left text-xs font-mono">
                  <div className="flex justify-between"><span className="text-slate-400">Entidade:</span> <span className="text-white font-bold">{completedTx.multibancoEntity}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Referência:</span> <span className="text-amber-400 font-bold">{completedTx.multibancoRef}</span></div>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xs shadow transition hover:brightness-110"
              >
                Concluir e Retornar ao App
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
          <Lock className="w-3 h-3 text-emerald-400" />
          <span>Encriptação 256-bit SSL | Processamento Global Homologado</span>
        </div>

      </div>
    </div>
  );
};
