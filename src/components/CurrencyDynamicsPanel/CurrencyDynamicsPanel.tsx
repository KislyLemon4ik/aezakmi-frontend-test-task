import { useEffect, useState } from 'react'
import { getFlagUrl } from '../../api/currencyFlags'
import {
  fetchCurrencyHistory,
  formatRate,
  PERIOD_LABELS,
} from '../../api/exchangeRates'
import type { ChartPeriod, CurrencyHistory, RatesStatus } from '../../types/currency'
import { CurrencyChart } from '../CurrencyChart/CurrencyChart'
import './CurrencyDynamicsPanel.css'

const PERIODS: ChartPeriod[] = ['1W', '1M', '3M', '6M', '1Y']

type CurrencyDynamicsPanelProps = {
  code: string
  onClose: () => void
}

export function CurrencyDynamicsPanel({ code, onClose }: CurrencyDynamicsPanelProps) {
  const [period, setPeriod] = useState<ChartPeriod>('1M')
  const [history, setHistory] = useState<CurrencyHistory | null>(null)
  const [status, setStatus] = useState<RatesStatus>('idle')

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      setStatus('loading')

      try {
        const data = await fetchCurrencyHistory(code, period)
        if (!cancelled) {
          setHistory(data)
          setStatus('success')
        }
      } catch {
        if (!cancelled) {
          setHistory(null)
          setStatus('error')
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [code, period])

  const isPositive = (history?.changePercent ?? 0) >= 0

  return (
    <aside className="dynamics-panel">
      <div className="dynamics-panel__header">
        <img
          className="dynamics-panel__flag"
          src={getFlagUrl(code)}
          alt=""
          width={24}
          height={18}
        />
        <h2 className="dynamics-panel__title">
          {code} / USD
        </h2>
        <button
          className="dynamics-panel__close"
          type="button"
          onClick={onClose}
          aria-label="Close"
        >
          <svg
            className="dynamics-panel__close-icon"
            width="14"
            height="14"
            viewBox="0 0 14 14"
            aria-hidden="true"
          >
            <path
              d="M1 1L13 13M13 1L1 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <p className="dynamics-panel__subtitle">{PERIOD_LABELS[period]}</p>

      {status === 'loading' ? (
        <div className="dynamics-panel__state">Loading chart...</div>
      ) : null}

      {status === 'error' ? (
        <div className="dynamics-panel__state dynamics-panel__state--error">
          Failed to load dynamics
        </div>
      ) : null}

      {status === 'success' && history ? (
        <>
          <div className="dynamics-panel__value-row">
            <span className="dynamics-panel__value">{formatRate(history.latest)}</span>
            <span
              className={
                isPositive
                  ? 'dynamics-panel__change dynamics-panel__change--up'
                  : 'dynamics-panel__change dynamics-panel__change--down'
              }
            >
              {isPositive ? '▲' : '▼'} {isPositive ? '+' : ''}
              {history.changePercent.toFixed(2)}%
            </span>
          </div>

          <div className="dynamics-panel__chart-wrap">
            <CurrencyChart points={history.points} />
          </div>
        </>
      ) : null}

      <div className="dynamics-panel__periods">
        {PERIODS.map((item) => (
          <button
            key={item}
            type="button"
            className={
              item === period
                ? 'dynamics-panel__period dynamics-panel__period--active'
                : 'dynamics-panel__period'
            }
            onClick={() => setPeriod(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </aside>
  )
}
