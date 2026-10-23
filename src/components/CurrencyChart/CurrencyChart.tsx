import type { HistoryPoint } from '../../types/currency'
import './CurrencyChart.css'

type CurrencyChartProps = {
  points: HistoryPoint[]
}

export function CurrencyChart({ points }: CurrencyChartProps) {
  const width = 320
  const height = 160
  const paddingX = 0
  const paddingY = 8

  if (points.length < 2) {
    return <div className="currency-chart currency-chart--empty">Not enough data</div>
  }

  const values = points.map((point) => point.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  const coords = points.map((point, index) => {
    const x =
      paddingX + (index / (points.length - 1)) * (width - paddingX * 2)
    const y =
      height -
      paddingY -
      ((point.value - min) / range) * (height - paddingY * 2)
    return { x, y }
  })

  const linePath = coords
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
    .join(' ')

  const areaPath = [
    `M ${coords[0].x} ${height - paddingY}`,
    ...coords.map((point) => `L ${point.x} ${point.y}`),
    `L ${coords[coords.length - 1].x} ${height - paddingY}`,
    'Z',
  ].join(' ')

  return (
    <svg
      className="currency-chart"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      role="img"
      aria-label="Currency dynamics chart"
    >
      <defs>
        <linearGradient id="currencyChartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34c759" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#34c759" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill="url(#currencyChartFill)" />
      <path d={linePath} fill="none" stroke="#34c759" strokeWidth="2.5" />
    </svg>
  )
}
