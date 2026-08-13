import Stripe from 'stripe';
import { REGIONAL_PRICING_DATABASE, DEFAULT_COUNTRY } from './regionalPricingService';

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.trim() === '') {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(key, {
      apiVersion: '2025-01-27.acacia' as any,
    });
  }
  return stripeClient;
}

export interface CreateStripeSessionInput {
  userId: string;
  type: 'subscription_pro' | 'coin_pack';
  billingCycle?: 'monthly' | 'annual';
  coinPackId?: 'pack300' | 'pack700' | 'pack1500';
  countryCode?: string;
  userEmail?: string;
  originUrl: string;
}

export async function createStripeCheckoutSession(input: CreateStripeSessionInput) {
  const stripe = getStripeClient();
  if (!stripe) {
    return {
      fallback: true,
      message: 'STRIPE_SECRET_KEY não configurada no servidor.',
    };
  }

  const country = input.countryCode && REGIONAL_PRICING_DATABASE[input.countryCode]
    ? REGIONAL_PRICING_DATABASE[input.countryCode]
    : REGIONAL_PRICING_DATABASE[DEFAULT_COUNTRY];

  const currency = country.currencyCode.toLowerCase();
  
  let unitAmount = 0; // In smallest currency unit (e.g. cents)
  let productName = '';
  let productDescription = '';
  let isSubscription = false;
  let coinsToAdd = 0;
  let examTokensToAdd = 0;

  if (input.type === 'subscription_pro') {
    isSubscription = true;
    const cycle = input.billingCycle || 'annual';
    const amount = cycle === 'annual' ? country.premiumAnnualTotal : country.premiumMonthly;
    unitAmount = Math.round(amount * 100);
    productName = cycle === 'annual'
      ? `ISTQB Trail PRO (Anual - ${country.name})`
      : `ISTQB Trail PRO (Mensal - ${country.name})`;
    productDescription = 'Acesso ilimitado a vidas, simulados e aceleradores de estudo ISTQB CTFL v4.0.1';
  } else if (input.type === 'coin_pack' && input.coinPackId) {
    const pack = country.coinPacks[input.coinPackId];
    unitAmount = Math.round(pack.price * 100);
    productName = `Pacote ${pack.coins} Moedas QA (${pack.label})`;
    productDescription = `Moedas virtuais para simulados e reforço no ISTQB Trail`;
    coinsToAdd = pack.coins;
    examTokensToAdd = pack.examTokens || 0;
  }

  const successUrl = `${input.originUrl}?payment_status=success&session_id={CHECKOUT_SESSION_ID}`;
  const cancelUrl = `${input.originUrl}?payment_status=cancelled`;

  const sessionConfig: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ['card'],
    mode: isSubscription ? 'subscription' : 'payment',
    customer_email: input.userEmail,
    line_items: [
      {
        price_data: {
          currency: currency,
          product_data: {
            name: productName,
            description: productDescription,
          },
          unit_amount: unitAmount,
          ...(isSubscription ? {
            recurring: {
              interval: input.billingCycle === 'monthly' ? 'month' : 'year',
            }
          } : {}),
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId: input.userId || 'guest',
      transactionType: input.type,
      billingCycle: input.billingCycle || 'none',
      coinsToAdd: String(coinsToAdd),
      examTokensToAdd: String(examTokensToAdd),
      countryCode: country.code,
    },
    success_url: successUrl,
    cancel_url: cancelUrl,
  };

  const session = await stripe.checkout.sessions.create(sessionConfig);

  return {
    fallback: false,
    sessionId: session.id,
    checkoutUrl: session.url,
  };
}
