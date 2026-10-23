/** Код валюты → код страны/региона для flagcdn */
export const currencyToFlagCode: Record<string, string> = {
  AUD: 'au',
  BGN: 'bg',
  BRL: 'br',
  CAD: 'ca',
  CHF: 'ch',
  CNY: 'cn',
  CZK: 'cz',
  DKK: 'dk',
  EUR: 'eu',
  GBP: 'gb',
  HKD: 'hk',
  HUF: 'hu',
  IDR: 'id',
  ILS: 'il',
  INR: 'in',
  ISK: 'is',
  JPY: 'jp',
  KRW: 'kr',
  MXN: 'mx',
  MYR: 'my',
  NOK: 'no',
  NZD: 'nz',
  PHP: 'ph',
  PLN: 'pl',
  RON: 'ro',
  SEK: 'se',
  SGD: 'sg',
  THB: 'th',
  TRY: 'tr',
  USD: 'us',
  ZAR: 'za',
}

export function getFlagUrl(currencyCode: string): string {
  const flagCode = currencyToFlagCode[currencyCode] ?? 'un'
  return `https://flagcdn.com/24x18/${flagCode}.png`
}
