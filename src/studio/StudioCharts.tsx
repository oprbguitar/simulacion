import type { ScenarioResult } from '../domain/types'

const soles = (value: number) => `S/ ${Math.round(value).toLocaleString('es-PE')}`
const pct = (value: number, max: number) => `${Math.max(2, Math.min(100, (value / Math.max(1, max)) * 100))}%`

export function StudioCharts({ result }: { result: ScenarioResult }) {
  const commitments = Math.max(0, result.state.monthlyIncome - result.monthlyCashflow)
  const flowMax = Math.max(result.state.monthlyIncome, commitments, Math.abs(result.monthlyCashflow), 1)
  const balanceMax = Math.max(result.state.liquidSavings, result.state.assetValue, 1)
  const rangeMax = Math.max(result.costRange.high, 1)

  return (
    <section className="sv-charts" aria-label="Resultados gráficos del escenario">
      <figure className="sv-chart flow-chart">
        <figcaption><span>Flujo mensual</span><strong>{soles(result.monthlyCashflow)} libres</strong></figcaption>
        <div className="bar-list">
          <ChartBar label="Ingreso" value={result.state.monthlyIncome} max={flowMax} tone="teal" />
          <ChartBar label="Compromisos" value={commitments} max={flowMax} tone="orange" />
          <ChartBar label="Margen" value={Math.max(0, result.monthlyCashflow)} max={flowMax} tone="green" />
        </div>
      </figure>
      <figure className="sv-chart balance-chart">
        <figcaption><span>Posición actual</span><strong>{result.reserveMonths.toFixed(1)} meses de reserva</strong></figcaption>
        <div className="balance-bars">
          <ChartBar label="Liquidez" value={result.state.liquidSavings} max={balanceMax} tone="teal" />
          <ChartBar label="Activo" value={result.state.assetValue} max={balanceMax} tone="graphite" />
        </div>
      </figure>
      <figure className="sv-chart range-chart">
        <figcaption><span>Rango del paso</span><strong>Sin falsa precisión</strong></figcaption>
        <div className="bar-list" aria-label={`Económico ${soles(result.costRange.low)}, probable ${soles(result.costRange.expected)}, conservador ${soles(result.costRange.high)}`}>
          <ChartBar label="Económico" value={result.costRange.low} max={rangeMax} tone="teal" />
          <ChartBar label="Probable" value={result.costRange.expected} max={rangeMax} tone="orange" />
          <ChartBar label="Conservador" value={result.costRange.high} max={rangeMax} tone="graphite" />
        </div>
      </figure>
    </section>
  )
}

function ChartBar({ label, value, max, tone }: { label: string; value: number; max: number; tone: string }) {
  return <div className="chart-bar"><span>{label}</span><div><i className={`tone-${tone}`} style={{ width: pct(value, max) }} /></div><strong>{soles(value)}</strong></div>
}
