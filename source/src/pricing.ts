import type { Partner, Vehicle } from './data';

/**
 * Simulates the partner-rates endpoint (GET /api/partner/rates).
 *
 * PRODUCTION: this calculation runs on the server, behind partner
 * authentication, and the response is sent only to that partner.
 * Guest-facing components never receive this object, so hiding it is
 * not a matter of CSS — in Guest View it is simply not passed down.
 */
export interface PartnerRate {
  publicPrice: number | null; // price the guest pays
  netPrice: number | null;    // what the partner pays REV8
  commission: number | null;  // partner margin
  commissionPct: number;
}

export function getPartnerRate(v: Vehicle, partner: Partner): PartnerRate {
  if (v.publicPrice === null) return { publicPrice: null, netPrice: null, commission: null, commissionPct: partner.commissionPct };
  const { net, commission } = calc(v.publicPrice, partner.commissionPct);
  return { publicPrice: v.publicPrice, netPrice: net, commission, commissionPct: partner.commissionPct };
}

export function calc(publicPrice: number, pct: number) {
  const commission = Math.round((publicPrice * pct) / 100);
  return { net: publicPrice - commission, commission };
}

export const fmt = (n: number, lang: string) =>
  new Intl.NumberFormat(lang === 'es' ? 'es-ES' : lang === 'zh' ? 'zh-CN' : 'en-GB', { style: 'currency', currency: 'CNY', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 }).format(n);
