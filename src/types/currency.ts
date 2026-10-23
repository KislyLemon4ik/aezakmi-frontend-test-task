export type CurrencyRate = {
  code: string
  course: number
  surrender: number
  buy: number
  change: number
  time: string
}

export type RatesStatus = 'idle' | 'loading' | 'success' | 'error'

export type ChartPeriod = '1W' | '1M' | '3M' | '6M' | '1Y'

export type HistoryPoint = {
  date: string
  value: number
}

export type CurrencyHistory = {
  points: HistoryPoint[]
  latest: number
  changePercent: number
}
