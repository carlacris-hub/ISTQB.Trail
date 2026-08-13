export interface CountryPricing {
  code: string;
  name: string;
  flag: string;
  currencyCode: string;
  currencySymbol: string;
  premiumMonthly: number;
  premiumAnnualMonthlyEquivalent: number;
  premiumAnnualTotal: number;
  coinPacks: {
    pack300: { coins: 300; price: number; label: string; examTokens: 1 };
    pack700: { coins: 700; price: number; label: string; examTokens: 2; bonus: '20% Bônus' };
    pack1500: { coins: 1500; price: number; label: string; examTokens: 5; bonus: '50% Bônus (Cofre)' };
  };
  paymentMethods: {
    id: 'pix' | 'mbway' | 'multibanco' | 'card' | 'apple_google_pay' | 'boleto' | 'oxxo_pse';
    name: string;
    icon: string; // lucide icon identifier or description
    instant: boolean;
  }[];
}

export const COUNTRY_PRICING_MAP: Record<string, CountryPricing> = {
  BR: {
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    currencyCode: 'BRL',
    currencySymbol: 'R$',
    premiumMonthly: 29.90,
    premiumAnnualMonthlyEquivalent: 19.90,
    premiumAnnualTotal: 238.80,
    coinPacks: {
      pack300: { coins: 300, price: 9.90, label: '1 Simulado Esporádico', examTokens: 1 },
      pack700: { coins: 700, price: 19.90, label: 'Pacote Intermediário', examTokens: 2, bonus: '20% Bônus' },
      pack1500: { coins: 1500, price: 39.90, label: 'Cofre de Moedas QA', examTokens: 5, bonus: '50% Bônus (Cofre)' },
    },
    paymentMethods: [
      { id: 'pix', name: 'Pix (Aprovação Instantânea)', icon: 'Zap', instant: true },
      { id: 'card', name: 'Cartão de Crédito (Até 12x)', icon: 'CreditCard', instant: true },
      { id: 'boleto', name: 'Boleto Bancário (1-2 dias)', icon: 'FileText', instant: false },
    ],
  },
  PT: {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    currencyCode: 'EUR',
    currencySymbol: '€',
    premiumMonthly: 5.99,
    premiumAnnualMonthlyEquivalent: 3.99,
    premiumAnnualTotal: 47.88,
    coinPacks: {
      pack300: { coins: 300, price: 1.99, label: '1 Simulado Esporádico', examTokens: 1 },
      pack700: { coins: 700, price: 3.99, label: 'Pacote Intermediário', examTokens: 2, bonus: '20% Bônus' },
      pack1500: { coins: 1500, price: 7.99, label: 'Cofre de Moedas QA', examTokens: 5, bonus: '50% Bônus (Cofre)' },
    },
    paymentMethods: [
      { id: 'mbway', name: 'MB WAY (Pagamento Instantâneo)', icon: 'Smartphone', instant: true },
      { id: 'multibanco', name: 'Multibanco (Referência MB)', icon: 'Building', instant: true },
      { id: 'card', name: 'Cartão de Crédito/Débito', icon: 'CreditCard', instant: true },
    ],
  },
  ES: {
    code: 'ES',
    name: 'Espanha / Unión Europea',
    flag: '🇪🇸',
    currencyCode: 'EUR',
    currencySymbol: '€',
    premiumMonthly: 6.99,
    premiumAnnualMonthlyEquivalent: 4.49,
    premiumAnnualTotal: 53.88,
    coinPacks: {
      pack300: { coins: 300, price: 2.29, label: '1 Examen Esporádico', examTokens: 1 },
      pack700: { coins: 700, price: 4.49, label: 'Paquete Intermedio', examTokens: 2, bonus: '20% Bônus' },
      pack1500: { coins: 1500, price: 8.99, label: 'Cofre de Monedas QA', examTokens: 5, bonus: '50% Bônus (Cofre)' },
    },
    paymentMethods: [
      { id: 'card', name: 'Tarjeta de Crédito / Débito', icon: 'CreditCard', instant: true },
      { id: 'apple_google_pay', name: 'Apple Pay / Google Pay', icon: 'Wallet', instant: true },
    ],
  },
  US: {
    code: 'US',
    name: 'United States / Global',
    flag: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    premiumMonthly: 6.99,
    premiumAnnualMonthlyEquivalent: 4.49,
    premiumAnnualTotal: 53.88,
    coinPacks: {
      pack300: { coins: 300, price: 2.29, label: '1 Sporadic Mock Exam', examTokens: 1 },
      pack700: { coins: 700, price: 4.49, label: 'Medium Coin Stash', examTokens: 2, bonus: '20% Bônus' },
      pack1500: { coins: 1500, price: 8.99, label: 'QA Coins Vault', examTokens: 5, bonus: '50% Bônus (Cofre)' },
    },
    paymentMethods: [
      { id: 'card', name: 'Credit / Debit Card', icon: 'CreditCard', instant: true },
      { id: 'apple_google_pay', name: 'Apple Pay / Google Pay', icon: 'Wallet', instant: true },
    ],
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    currencyCode: 'GBP',
    currencySymbol: '£',
    premiumMonthly: 4.99,
    premiumAnnualMonthlyEquivalent: 3.29,
    premiumAnnualTotal: 39.48,
    coinPacks: {
      pack300: { coins: 300, price: 1.69, label: '1 Sporadic Mock Exam', examTokens: 1 },
      pack700: { coins: 700, price: 3.29, label: 'Medium Coin Stash', examTokens: 2, bonus: '20% Bônus' },
      pack1500: { coins: 1500, price: 6.49, label: 'QA Coins Vault', examTokens: 5, bonus: '50% Bônus (Cofre)' },
    },
    paymentMethods: [
      { id: 'card', name: 'Credit / Debit Card', icon: 'CreditCard', instant: true },
      { id: 'apple_google_pay', name: 'Apple Pay / Google Pay', icon: 'Wallet', instant: true },
    ],
  },
  MX: {
    code: 'MX',
    name: 'México',
    flag: '🇲🇽',
    currencyCode: 'MXN',
    currencySymbol: '$',
    premiumMonthly: 129.00,
    premiumAnnualMonthlyEquivalent: 89.00,
    premiumAnnualTotal: 1068.00,
    coinPacks: {
      pack300: { coins: 300, price: 39.00, label: '1 Examen Esporádico', examTokens: 1 },
      pack700: { coins: 700, price: 89.00, label: 'Paquete Intermedio', examTokens: 2, bonus: '20% Bônus' },
      pack1500: { coins: 1500, price: 179.00, label: 'Cofre de Monedas QA', examTokens: 5, bonus: '50% Bônus (Cofre)' },
    },
    paymentMethods: [
      { id: 'oxxo_pse', name: 'OXXO / SPEI', icon: 'Building', instant: true },
      { id: 'card', name: 'Tarjeta de Crédito', icon: 'CreditCard', instant: true },
    ],
  },
  CO: {
    code: 'CO',
    name: 'Colombia',
    flag: '🇨🇴',
    currencyCode: 'COP',
    currencySymbol: '$',
    premiumMonthly: 24900,
    premiumAnnualMonthlyEquivalent: 16900,
    premiumAnnualTotal: 202800,
    coinPacks: {
      pack300: { coins: 300, price: 7900, label: '1 Examen Esporádico', examTokens: 1 },
      pack700: { coins: 700, price: 16900, label: 'Paquete Intermedio', examTokens: 2, bonus: '20% Bônus' },
      pack1500: { coins: 1500, price: 33900, label: 'Cofre de Monedas QA', examTokens: 5, bonus: '50% Bônus (Cofre)' },
    },
    paymentMethods: [
      { id: 'oxxo_pse', name: 'PSE / Nequi', icon: 'Smartphone', instant: true },
      { id: 'card', name: 'Tarjeta de Crédito', icon: 'CreditCard', instant: true },
    ],
  },
};

export const DEFAULT_COUNTRY_CODE = 'BR';

export function getCountryPricing(countryCode?: string): CountryPricing {
  if (!countryCode || !COUNTRY_PRICING_MAP[countryCode]) {
    return COUNTRY_PRICING_MAP[DEFAULT_COUNTRY_CODE];
  }
  return COUNTRY_PRICING_MAP[countryCode];
}

export function formatPrice(amount: number, pricing: CountryPricing): string {
  if (pricing.currencyCode === 'COP') {
    return `${pricing.currencySymbol} ${amount.toLocaleString('es-CO')}`;
  }
  if (pricing.currencyCode === 'MXN' || pricing.currencyCode === 'ARS') {
    return `${pricing.currencySymbol} ${amount.toLocaleString('es-MX', { minimumFractionDigits: 0 })}`;
  }
  if (pricing.currencyCode === 'BRL') {
    return `${pricing.currencySymbol} ${amount.toFixed(2).replace('.', ',')}`;
  }
  if (pricing.currencyCode === 'EUR') {
    return `${pricing.currencySymbol} ${amount.toFixed(2).replace('.', ',')}`;
  }
  return `${pricing.currencySymbol}${amount.toFixed(2)}`;
}

/**
 * Economic rationale analysis comparing Sporadic Exam Coin Purchases vs Premium Monthly Plan.
 */
export function getEconomicAnalysis(pricing: CountryPricing, lang: 'pt' | 'en' = 'pt') {
  const singleExamPrice = pricing.coinPacks.pack300.price;
  const premiumMonthlyPrice = pricing.premiumMonthly;
  const costPerExamInPremium = (premiumMonthlyPrice / 5).toFixed(2);

  if (lang === 'en') {
    return {
      title: 'Economic Value Comparison',
      singleExamLabel: `1 Sporadic Exam Token = ${formatPrice(singleExamPrice, pricing)}`,
      premiumLabel: `Premium Monthly (${formatPrice(premiumMonthlyPrice, pricing)}/mo) = 5 Mock Exams included (~${pricing.currencySymbol}${costPerExamInPremium}/exam) + Unlimited Lives + AI Tutor + Double XP`,
      verdict: `Purchasing a single exam for ${formatPrice(singleExamPrice, pricing)} is ideal for quick one-off checks. However, upgrading to Premium saves over 40% per exam and includes all PRO perks!`,
    };
  }

  return {
    title: 'Análise de Custo-Benefício Econômico',
    singleExamLabel: `1 Simulado Esporádico = ${formatPrice(singleExamPrice, pricing)} (300 Moedas QA)`,
    premiumLabel: `Plano PRO Mensal (${formatPrice(premiumMonthlyPrice, pricing)}/mês) = 5 Simulados inclusos (~${pricing.currencySymbol}${costPerExamInPremium} por simulado) + Vidas Infinitas + Tutor IA + 2x XP`,
    verdict: `Comprar 1 simulado avulso por ${formatPrice(singleExamPrice, pricing)} é barato e perfeito para um teste pontual. Mas o Plano PRO é muito mais vantajoso: sai por apenas ~${pricing.currencySymbol}${costPerExamInPremium} por simulado e liberta todos os recursos da plataforma!`,
  };
}
