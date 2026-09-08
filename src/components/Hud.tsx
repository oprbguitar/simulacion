import { Icon } from './Icon'
import { OriginBadge } from './OriginBadge'
import type { ScenarioResult } from '../domain/types'

function soles(value: number): string {
  return `S/ ${Math.round(value).toLocaleString('es-PE')}`
}

export function Hud({ result, onUndo, onRedo, canUndo, canRedo }: { result: ScenarioResult; onUndo: () => void; onRedo: () => void; canUndo: boolean; canRedo: boolean }) {
  const metrics = [
    { label: 'Ahorro disponible', value: soles(result.state.liquidSavings), icon: 'wallet' as const, tone: 'green' },
    { label: 'Ingreso mensual', value: soles(result.state.monthlyIncome), icon: 'sprout' as const, tone: 'blue' },
    { label: 'Reserva', value: `${result.reserveMonths.toFixed(1)} meses`, icon: 'shield' as const, tone: result.reserveMonths < 3 ? 'orange' : 'green' },
    { label: 'Patrimonio simulado', value: soles(result.patrimony), icon: 'home' as const, tone: 'ink' },
  ]
  return (
    <section className="hud-band" aria-label="Resumen de tu simulación">
      <div className="hud-metrics">
        {metrics.map((metric) => (
          <div className={`hud-metric tone-${metric.tone}`} key={metric.label}>
            <span className="hud-icon"><Icon name={metric.icon} size={18} /></span>
            <span className="hud-copy"><span className="hud-label">{metric.label}</span><strong>{metric.value}</strong></span>
          </div>
        ))}
      </div>
      <div className="hud-actions">
        <OriginBadge origin="SEEDED_REFERENCE" />
        <span className="hud-separator" aria-hidden="true" />
        <button className="icon-button" onClick={onUndo} disabled={!canUndo} aria-label="Deshacer último paso" title="Deshacer último paso"><Icon name="undo" size={18} /></button>
        <button className="icon-button" onClick={onRedo} disabled={!canRedo} aria-label="Rehacer último paso" title="Rehacer último paso"><Icon name="redo" size={18} /></button>
      </div>
    </section>
  )
}
