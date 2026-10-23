import { useEffect, useState } from 'react'
import { CurrencyDynamicsPanel } from '../../components/CurrencyDynamicsPanel/CurrencyDynamicsPanel'
import { fetchExchangeRates, formatRate } from '../../api/exchangeRates'
import { getFlagUrl } from '../../api/currencyFlags'
import type { CurrencyRate, RatesStatus } from '../../types/currency'
import './CurrenciesPage.css'

function formatHeaderDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function CurrenciesPage() {
  const [rates, setRates] = useState<CurrencyRate[]>([])
  const [status, setStatus] = useState<RatesStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [headerDate] = useState(() => formatHeaderDate(new Date()))
  const [selectedCode, setSelectedCode] = useState<string | null>(null)

  const loadRates = async () => {
    setStatus('loading')
    setErrorMessage('')

    try {
      const data = await fetchExchangeRates()
      setRates(data)
      setStatus('success')
    } catch {
      setStatus('error')
      setErrorMessage('Не удалось загрузить курсы. Попробуйте ещё раз.')
    }
  }

  useEffect(() => {
    void loadRates()
  }, [])

  const handleRowClick = (code: string) => {
    setSelectedCode((current) => (current === code ? null : code))
  }

  return (
    <section className="currencies-page">
      <header className="currencies-header">
        <h1 className="currencies-title">Exchange rates</h1>
        <span className="currencies-date">{headerDate}</span>
      </header>

      {status === 'loading' ? (
        <div className="currencies-state">Loading rates...</div>
      ) : null}

      {status === 'error' ? (
        <div className="currencies-state currencies-state--error">
          <p>{errorMessage}</p>
          <button type="button" className="currencies-retry" onClick={() => void loadRates()}>
            Retry
          </button>
        </div>
      ) : null}

      {status === 'success' ? (
        <div
          className={
            selectedCode
              ? 'currencies-content currencies-content--with-panel'
              : 'currencies-content'
          }
        >
          <div className="currencies-table-card">
            <table className="currencies-table">
              <thead>
                <tr>
                  <th>Currency</th>
                  <th>Surrender</th>
                  <th>Buy</th>
                  <th>Course</th>
                  <th>Change</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate) => (
                  <tr
                    key={rate.code}
                    className={
                      selectedCode === rate.code
                        ? 'currencies-row currencies-row--active'
                        : 'currencies-row'
                    }
                    onClick={() => handleRowClick(rate.code)}
                  >
                    <td>
                      <div className="currencies-currency">
                        <img
                          className="currencies-flag"
                          src={getFlagUrl(rate.code)}
                          alt=""
                          width={24}
                          height={18}
                        />
                        <span>{rate.code}</span>
                      </div>
                    </td>
                    <td>{formatRate(rate.surrender)}</td>
                    <td>{formatRate(rate.buy)}</td>
                    <td>{formatRate(rate.course)}</td>
                    <td>{formatRate(rate.change)}</td>
                    <td>{rate.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedCode ? (
            <CurrencyDynamicsPanel
              code={selectedCode}
              onClose={() => setSelectedCode(null)}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
