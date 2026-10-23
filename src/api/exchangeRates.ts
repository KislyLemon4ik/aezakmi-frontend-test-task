import type { ChartPeriod, CurrencyHistory, CurrencyRate } from '../types/currency'

const FRANKFURTER_URL = 'https://api.frankfurter.dev/v1'

type FrankfurterLatestResponse = {
  amount: number
  base: string
  date: string
  rates: Record<string, number>
}

type FrankfurterHistoryResponse = {
  amount: number
  base: string
  start_date: string
  end_date: string
  rates: Record<string, Record<string, number>>
}

/** Список валют как в макете */
const DISPLAY_CURRENCIES = ['AUD', 'BGN', 'BRL', 'CAD', 'CHF', 'EUR', 'GBP', 'JPY']

const SURRENDER_SPREAD = 1.02
const BUY_SPREAD = 0.98

function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function toRateRow(code: string, course: number, fetchedAt: Date): CurrencyRate {
  return {
    code,
    course,
    surrender: course * SURRENDER_SPREAD,
    buy: course * BUY_SPREAD,
    change: 0,
    time: formatTime(fetchedAt),
  }
}

export async function fetchExchangeRates(): Promise<CurrencyRate[]> {
  const symbols = DISPLAY_CURRENCIES.join(',')
  const response = await fetch(
    `${FRANKFURTER_URL}/latest?from=USD&to=${symbols}`,
  )

  if (!response.ok) {
    throw new Error('Failed to load exchange rates')
  }

  const data = (await response.json()) as FrankfurterLatestResponse
  const fetchedAt = new Date()

  return DISPLAY_CURRENCIES.filter((code) => data.rates[code] != null).map(
    (code) => toRateRow(code, data.rates[code], fetchedAt),
  )
}

export function formatRate(value: number): string {
  return value.toFixed(4)
}

const PERIOD_DAYS: Record<ChartPeriod, number> = {
  '1W': 7,
  '1M': 30,
  '3M': 90,
  '6M': 180,
  '1Y': 365,
}

export const PERIOD_LABELS: Record<ChartPeriod, string> = {
  '1W': 'Weekly dynamics',
  '1M': 'Monthly dynamics',
  '3M': '3-month dynamics',
  '6M': '6-month dynamics',
  '1Y': 'Yearly dynamics',
}

function formatApiDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export async function fetchCurrencyHistory(
  code: string,
  period: ChartPeriod,
): Promise<CurrencyHistory> {
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - PERIOD_DAYS[period])

  const response = await fetch(
    `${FRANKFURTER_URL}/${formatApiDate(start)}..${formatApiDate(end)}?from=USD&to=${code}`,
  )

  if (!response.ok) {
    throw new Error('Failed to load currency history')
  }

  const data = (await response.json()) as FrankfurterHistoryResponse
  const points = Object.entries(data.rates)
    .map(([date, rates]) => ({
      date,
      value: rates[code],
    }))
    .filter((point) => typeof point.value === 'number')
    .sort((a, b) => a.date.localeCompare(b.date))

  if (points.length === 0) {
    throw new Error('No history data')
  }

  const first = points[0].value
  const latest = points[points.length - 1].value
  const changePercent = ((latest - first) / first) * 100

  return { points, latest, changePercent }
}
