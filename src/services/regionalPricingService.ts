export type PaymentMethodId = 
  | 'pix' 
  | 'mbway' 
  | 'multibanco' 
  | 'card' 
  | 'apple_google_pay' 
  | 'boleto' 
  | 'oxxo' 
  | 'spei' 
  | 'pse' 
  | 'sepa';

export interface LocalPaymentMethod {
  id: PaymentMethodId;
  name: string;
  description: string;
  icon: string;
  isInstant: boolean;
  requiresBillingInfo?: boolean;
}

export interface CoinPackConfig {
  id: string;
  coins: number;
  price: number;
  label: string;
  examTokens: number;
  bonusTag?: string;
  bestValue?: boolean;
}

export interface CountryRegionalConfig {
  code: string;
  name: string;
  flag: string;
  tier: 'tier_1' | 'tier_2' | 'tier_3' | 'tier_4';
  currencyCode: string;
  currencySymbol: string;
  estimatedTaxPercent: number; // VAT or local sales tax %
  taxName: string; // e.g., 'IVA', 'VAT', 'Sales Tax', 'ISS/PIS'
  premiumMonthly: number;
  premiumAnnualTotal: number;
  premiumAnnualMonthlyEquivalent: number;
  coinPacks: {
    pack300: CoinPackConfig;
    pack700: CoinPackConfig;
    pack1500: CoinPackConfig;
  };
  paymentMethods: LocalPaymentMethod[];
}

export const REGIONAL_PRICING_DATABASE: Record<string, CountryRegionalConfig> = {
  BR: {
    code: 'BR',
    name: 'Brasil',
    flag: '🇧🇷',
    tier: 'tier_3',
    currencyCode: 'BRL',
    currencySymbol: 'R$',
    estimatedTaxPercent: 5.0,
    taxName: 'ISS / impostos locais',
    premiumMonthly: 29.90,
    premiumAnnualTotal: 238.80,
    premiumAnnualMonthlyEquivalent: 19.90,
    coinPacks: {
      pack300: { id: 'pack300', coins: 300, price: 9.90, label: '1 Simulado Avulso', examTokens: 1 },
      pack700: { id: 'pack700', coins: 700, price: 19.90, label: 'Pacote Intermediário', examTokens: 2, bonusTag: '+20% Bônus' },
      pack1500: { id: 'pack1500', coins: 1500, price: 39.90, label: 'Cofre de Moedas QA', examTokens: 5, bonusTag: '+50% Bônus (Cofre)', bestValue: true },
    },
    paymentMethods: [
      { id: 'pix', name: 'Pix', description: 'Aprovação instantânea por QR Code ou chave Copia e Cola', icon: 'Zap', isInstant: true },
      { id: 'card', name: 'Cartão de Crédito', description: 'Até 12x sem juros (Visa, Mastercard, Elo)', icon: 'CreditCard', isInstant: true },
      { id: 'boleto', name: 'Boleto Bancário', description: 'Confirmação em 1 a 2 dias úteis', icon: 'FileText', isInstant: false },
    ],
  },
  PT: {
    code: 'PT',
    name: 'Portugal',
    flag: '🇵🇹',
    tier: 'tier_2',
    currencyCode: 'EUR',
    currencySymbol: '€',
    estimatedTaxPercent: 23.0,
    taxName: 'IVA (23%)',
    premiumMonthly: 5.99,
    premiumAnnualTotal: 47.88,
    premiumAnnualMonthlyEquivalent: 3.99,
    coinPacks: {
      pack300: { id: 'pack300', coins: 300, price: 1.99, label: '1 Simulado Avulso', examTokens: 1 },
      pack700: { id: 'pack700', coins: 700, price: 3.99, label: 'Pacote Intermédio', examTokens: 2, bonusTag: '+20% Bónus' },
      pack1500: { id: 'pack1500', coins: 1500, price: 7.99, label: 'Cofre de Moedas QA', examTokens: 5, bonusTag: '+50% Bónus (Cofre)', bestValue: true },
    },
    paymentMethods: [
      { id: 'mbway', name: 'MB WAY', description: 'Aprovação direta no smartphone', icon: 'Smartphone', isInstant: true },
      { id: 'multibanco', name: 'Multibanco', description: 'Referência Entidade/Referência para homebanking', icon: 'Building', isInstant: true },
      { id: 'card', name: 'Cartão de Crédito/Débito', description: 'Visa, Mastercard, Maestro', icon: 'CreditCard', isInstant: true },
    ],
  },
  ES: {
    code: 'ES',
    name: 'España / Unión Europea',
    flag: '🇪🇸',
    tier: 'tier_2',
    currencyCode: 'EUR',
    currencySymbol: '€',
    estimatedTaxPercent: 21.0,
    taxName: 'IVA (21%)',
    premiumMonthly: 6.99,
    premiumAnnualTotal: 53.88,
    premiumAnnualMonthlyEquivalent: 4.49,
    coinPacks: {
      pack300: { id: 'pack300', coins: 300, price: 2.29, label: '1 Examen Esporádico', examTokens: 1 },
      pack700: { id: 'pack700', coins: 700, price: 4.49, label: 'Paquete Intermedio', examTokens: 2, bonusTag: '+20% Bonus' },
      pack1500: { id: 'pack1500', coins: 1500, price: 8.99, label: 'Cofre de Monedas QA', examTokens: 5, bonusTag: '+50% Bonus', bestValue: true },
    },
    paymentMethods: [
      { id: 'card', name: 'Tarjeta de Crédito / Débito', description: 'Visa, Mastercard, American Express', icon: 'CreditCard', isInstant: true },
      { id: 'apple_google_pay', name: 'Apple Pay / Google Pay', description: 'Pago rápido de 1-Touch', icon: 'Wallet', isInstant: true },
      { id: 'sepa', name: 'Débito Directo SEPA', description: 'Transferencia bancaria europea', icon: 'Building', isInstant: false },
    ],
  },
  US: {
    code: 'US',
    name: 'United States / Global',
    flag: '🇺🇸',
    tier: 'tier_1',
    currencyCode: 'USD',
    currencySymbol: '$',
    estimatedTaxPercent: 7.0,
    taxName: 'State Sales Tax (~7%)',
    premiumMonthly: 6.99,
    premiumAnnualTotal: 53.88,
    premiumAnnualMonthlyEquivalent: 4.49,
    coinPacks: {
      pack300: { id: 'pack300', coins: 300, price: 2.29, label: '1 Sporadic Mock Exam', examTokens: 1 },
      pack700: { id: 'pack700', coins: 700, price: 4.49, label: 'Medium Coin Stash', examTokens: 2, bonusTag: '+20% Bonus' },
      pack1500: { id: 'pack1500', coins: 1500, price: 8.99, label: 'QA Coins Vault', examTokens: 5, bonusTag: '+50% Bonus', bestValue: true },
    },
    paymentMethods: [
      { id: 'card', name: 'Credit / Debit Card', description: 'Visa, Mastercard, Amex, Discover', icon: 'CreditCard', isInstant: true },
      { id: 'apple_google_pay', name: 'Apple Pay / Google Pay', description: 'Instant 1-Click checkout', icon: 'Wallet', isInstant: true },
    ],
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    tier: 'tier_1',
    currencyCode: 'GBP',
    currencySymbol: '£',
    estimatedTaxPercent: 20.0,
    taxName: 'UK VAT (20%)',
    premiumMonthly: 4.99,
    premiumAnnualTotal: 39.48,
    premiumAnnualMonthlyEquivalent: 3.29,
    coinPacks: {
      pack300: { id: 'pack300', coins: 300, price: 1.69, label: '1 Sporadic Mock Exam', examTokens: 1 },
      pack700: { id: 'pack700', coins: 700, price: 3.29, label: 'Medium Coin Stash', examTokens: 2, bonusTag: '+20% Bonus' },
      pack1500: { id: 'pack1500', coins: 1500, price: 6.49, label: 'QA Coins Vault', examTokens: 5, bonusTag: '+50% Bonus', bestValue: true },
    },
    paymentMethods: [
      { id: 'card', name: 'Credit / Debit Card', description: 'Visa, Mastercard, Amex', icon: 'CreditCard', isInstant: true },
      { id: 'apple_google_pay', name: 'Apple Pay / Google Pay', description: 'Express checkout', icon: 'Wallet', isInstant: true },
    ],
  },
  MX: {
    code: 'MX',
    name: 'México',
    flag: '🇲🇽',
    tier: 'tier_3',
    currencyCode: 'MXN',
    currencySymbol: '$',
    estimatedTaxPercent: 16.0,
    taxName: 'IVA (16%)',
    premiumMonthly: 129.00,
    premiumAnnualTotal: 1068.00,
    premiumAnnualMonthlyEquivalent: 89.00,
    coinPacks: {
      pack300: { id: 'pack300', coins: 300, price: 39.00, label: '1 Examen Esporádico', examTokens: 1 },
      pack700: { id: 'pack700', coins: 700, price: 89.00, label: 'Paquete Intermedio', examTokens: 2, bonusTag: '+20% Bonus' },
      pack1500: { id: 'pack1500', coins: 1500, price: 179.00, label: 'Cofre de Monedas QA', examTokens: 5, bonusTag: '+50% Bonus', bestValue: true },
    },
    paymentMethods: [
      { id: 'oxxo', name: 'Pago en OXXO', description: 'Pago en efectivo con código de barras', icon: 'Building', isInstant: false },
      { id: 'spei', name: 'SPEI (Transferencia)', description: 'Transferencia bancaria directa SPEI', icon: 'Zap', isInstant: true },
      { id: 'card', name: 'Tarjeta de Crédito / Débito', description: 'Visa, Mastercard', icon: 'CreditCard', isInstant: true },
    ],
  },
  CO: {
    code: 'CO',
    name: 'Colombia',
    flag: '🇨🇴',
    tier: 'tier_4',
    currencyCode: 'COP',
    currencySymbol: '$',
    estimatedTaxPercent: 19.0,
    taxName: 'IVA (19%)',
    premiumMonthly: 24900,
    premiumAnnualTotal: 202800,
    premiumAnnualMonthlyEquivalent: 16900,
    coinPacks: {
      pack300: { id: 'pack300', coins: 300, price: 7900, label: '1 Examen Esporádico', examTokens: 1 },
      pack700: { id: 'pack700', coins: 700, price: 16900, label: 'Paquete Intermedio', examTokens: 2, bonusTag: '+20% Bonus' },
      pack1500: { id: 'pack1500', coins: 1500, price: 33900, label: 'Cofre de Monedas QA', examTokens: 5, bonusTag: '+50% Bonus', bestValue: true },
    },
    paymentMethods: [
      { id: 'pse', name: 'PSE / Nequi / Daviplata', description: 'Débito bancario en línea e itinerante', icon: 'Smartphone', isInstant: true },
      { id: 'card', name: 'Tarjeta de Crédito / Débito', description: 'Visa, Mastercard', icon: 'CreditCard', isInstant: true },
    ],
  },
};

export const DEFAULT_COUNTRY = 'BR';

/**
 * Gets the regional pricing details for any given country code.
 */
export function getRegionalPricing(countryCode?: string): CountryRegionalConfig {
  if (!countryCode || !REGIONAL_PRICING_DATABASE[countryCode]) {
    return REGIONAL_PRICING_DATABASE[DEFAULT_COUNTRY];
  }
  return REGIONAL_PRICING_DATABASE[countryCode];
}

/**
 * Formats monetary value with correct symbol and regional spacing rules.
 */
export function formatRegionalCurrency(amount: number, config: CountryRegionalConfig): string {
  const symbol = config.currencySymbol;
  if (config.currencyCode === 'COP' || config.currencyCode === 'CLP' || config.currencyCode === 'JPY') {
    return `${symbol} ${Math.round(amount).toLocaleString('es-CO')}`;
  }
  if (config.currencyCode === 'MXN' || config.currencyCode === 'ARS') {
    return `${symbol} ${amount.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  if (config.currencyCode === 'BRL' || config.currencyCode === 'EUR') {
    return `${symbol} ${amount.toFixed(2).replace('.', ',')}`;
  }
  return `${symbol}${amount.toFixed(2)}`;
}

/**
 * Itemized price breakdown calculation with net price and local tax estimation.
 */
export interface ItemizedPriceBreakdown {
  grossPrice: number; // Total user pays
  netPrice: number; // Price before estimated tax
  taxAmount: number; // Tax component
  taxName: string;
  currencySymbol: string;
  formattedTotal: string;
  formattedNet: string;
  formattedTax: string;
  monthlyEquivalentFormatted?: string;
  savingsPercentageAnnual?: number;
}

export function calculatePriceBreakdown(
  grossPrice: number, 
  config: CountryRegionalConfig,
  monthlyEquivalentGross?: number
): ItemizedPriceBreakdown {
  const taxRate = config.estimatedTaxPercent / 100;
  const netPrice = grossPrice / (1 + taxRate);
  const taxAmount = grossPrice - netPrice;

  let savingsPercent: number | undefined = undefined;
  if (monthlyEquivalentGross) {
    const regularAnnualCost = config.premiumMonthly * 12;
    const discountedAnnualCost = config.premiumAnnualTotal;
    savingsPercent = Math.round(((regularAnnualCost - discountedAnnualCost) / regularAnnualCost) * 100);
  }

  return {
    grossPrice,
    netPrice,
    taxAmount,
    taxName: config.taxName,
    currencySymbol: config.currencySymbol,
    formattedTotal: formatRegionalCurrency(grossPrice, config),
    formattedNet: formatRegionalCurrency(netPrice, config),
    formattedTax: formatRegionalCurrency(taxAmount, config),
    monthlyEquivalentFormatted: monthlyEquivalentGross ? formatRegionalCurrency(monthlyEquivalentGross, config) : undefined,
    savingsPercentageAnnual: savingsPercent,
  };
}
