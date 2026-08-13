import { db, doc, setDoc } from '../lib/firebase';
import { UserProfile } from '../types';
import { 
  CountryRegionalConfig, 
  PaymentMethodId, 
  formatRegionalCurrency,
  calculatePriceBreakdown
} from './regionalPricingService';
import { saveUserProfileToFirestore } from '../utils/firestoreService';

export type TransactionType = 'subscription_pro' | 'coin_pack' | 'mock_exam_token';

export interface PaymentIntentDetails {
  id: string;
  type: TransactionType;
  title: string;
  amount: number;
  currencyCode: string;
  currencySymbol: string;
  countryCode: string;
  paymentMethodId: PaymentMethodId;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  billingCycle?: 'monthly' | 'annual';
  coinsToAdd?: number;
  examTokensToAdd?: number;
  pixPayload?: string;
  mbwayPhonePrompt?: string;
  multibancoEntity?: string;
  multibancoRef?: string;
  voucherCode?: string;
  createdAt: string;
}

export interface CardDetails {
  number: string;
  holderName: string;
  expiry: string;
  cvv: string;
}

export async function processGlobalPayment(
  user: UserProfile,
  regionalConfig: CountryRegionalConfig,
  type: TransactionType,
  paymentMethodId: PaymentMethodId,
  options: {
    billingCycle?: 'monthly' | 'annual';
    coinPackId?: 'pack300' | 'pack700' | 'pack1500';
    cardDetails?: CardDetails;
    phoneForMbway?: string;
  }
): Promise<{ success: boolean; transaction: PaymentIntentDetails; updatedUser: UserProfile; message: string }> {
  const txId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  let grossPrice = 0;
  let title = '';
  let coinsToAdd = 0;
  let examTokensToAdd = 0;

  if (type === 'subscription_pro') {
    const cycle = options.billingCycle || 'annual';
    grossPrice = cycle === 'annual' ? regionalConfig.premiumAnnualTotal : regionalConfig.premiumMonthly;
    title = cycle === 'annual' 
      ? `Assinatura ISTQB Trail PRO (Anual - ${regionalConfig.name})`
      : `Assinatura ISTQB Trail PRO (Mensal - ${regionalConfig.name})`;
  } else if (type === 'coin_pack' && options.coinPackId) {
    const pack = regionalConfig.coinPacks[options.coinPackId];
    grossPrice = pack.price;
    title = `Pacote de ${pack.coins} Moedas QA (${pack.label})`;
    coinsToAdd = pack.coins;
    examTokensToAdd = pack.examTokens || 0;
  }

  // Generate payment method specific identifiers
  let pixPayload: string | undefined;
  let mbwayPhonePrompt: string | undefined;
  let multibancoEntity: string | undefined;
  let multibancoRef: string | undefined;
  let voucherCode: string | undefined;

  if (paymentMethodId === 'pix') {
    pixPayload = `00020126580014br.gov.bcb.pix0136istqbtrail-pay-${txId}5204000053039865405${grossPrice.toFixed(2)}5802BR5920ISTQB Trail Education6009Sao Paulo62070503***6304ABCD`;
  } else if (paymentMethodId === 'mbway') {
    mbwayPhonePrompt = options.phoneForMbway || '+351 912 345 678';
  } else if (paymentMethodId === 'multibanco') {
    multibancoEntity = '11223';
    multibancoRef = `${Math.floor(100000000 + Math.random() * 900000000)}`;
  } else if (paymentMethodId === 'oxxo' || paymentMethodId === 'boleto') {
    voucherCode = `${Math.floor(10000000000000 + Math.random() * 90000000000000)}`;
  }

  const transaction: PaymentIntentDetails = {
    id: txId,
    type,
    title,
    amount: grossPrice,
    currencyCode: regionalConfig.currencyCode,
    currencySymbol: regionalConfig.currencySymbol,
    countryCode: regionalConfig.code,
    paymentMethodId,
    status: 'completed', // Simulated instant settlement
    billingCycle: options.billingCycle,
    coinsToAdd,
    examTokensToAdd,
    pixPayload,
    mbwayPhonePrompt,
    multibancoEntity,
    multibancoRef,
    voucherCode,
    createdAt: now,
  };

  // Build updated user state
  let updatedUser: UserProfile = { ...user };

  if (type === 'subscription_pro') {
    updatedUser = {
      ...updatedUser,
      plan: 'premium',
      livesCurrent: updatedUser.livesMax || 5, // Refill lives on PRO upgrade
    };
  } else if (type === 'coin_pack') {
    updatedUser = {
      ...updatedUser,
      coins: (updatedUser.coins || 0) + coinsToAdd,
      extraMockExamTokens: (updatedUser.extraMockExamTokens || 0) + examTokensToAdd,
    };
  }

  // Save transaction to Firestore if user is authenticated
  if (user.uid) {
    try {
      const txRef = doc(db, 'transactions', txId);
      await setDoc(txRef, {
        ...transaction,
        userId: user.uid,
        userEmail: user.email,
        userName: user.name,
      });
    } catch (err) {
      console.error('Firestore transaction save error:', err);
    }
    await saveUserProfileToFirestore(updatedUser);
  }

  const formattedAmount = formatRegionalCurrency(grossPrice, regionalConfig);
  const successMessage = type === 'subscription_pro'
    ? `Plano PRO ativado com sucesso em ${regionalConfig.name} (${formattedAmount})!`
    : `+${coinsToAdd} Moedas QA adicionadas com sucesso!`;

  return {
    success: true,
    transaction,
    updatedUser,
    message: successMessage,
  };
}
