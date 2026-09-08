import type { ContentConfig, ScenarioResult, StressEventId } from '../domain/types'
import { Icon } from './Icon'

function resilience(result: ScenarioResult) {
  const score = Math.max(0, Math.min(100, Math.round((result.reserveMonths / 9) * 100)))
  return { score, label: score >= 67 ? 'Sólida' : score >= 34 ? 'Media' : 'Frágil' }
}

export function ResiliencePanel({ result, config, onStress }: { result: ScenarioResult; config: ContentConfig; onStress: (id: StressEventId) => void }) {
  const status = resilience(result)
  const signals = [
    result.state.housingPath === 'family' ? 'Tienes apoyo habitacional.' : 'Tu vivienda tiene costo propio.',
    result.reserveMonths >= 3 ? 'Tu reserva cubre al menos 3 meses.' : 'Tu reserva está por debajo de 3 meses.',
    result.state.assetValue > 0 ? 'Ya hay patrimonio en esta ruta.' : 'Aún no sumas propiedad simulada.',
  ]
  return (
    <aside className="resilience-panel" aria-labelledby="resilience-title">
      <div className="resilience-heading"><div><small>Índice derivado de tu reserva</small><h2 id="resilience-title">Tu resiliencia hoy</h2></div><strong>{status.score}<span>/100</span></strong></div>
      <div className="resilience-level"><span>{status.label}</span><div className="level-track" aria-label={`Resiliencia ${status.score} de 100`}><i style={{ width: `${status.score}%` }} /></div></div>
      <ul>{signals.map((signal, index) => <li key={signal}><Icon name={index === 1 && result.reserveMonths < 3 ? 'warning' : index === 2 ? 'home' : 'shield'} />{signal}</li>)}</ul>
      <div className="stress-quick" aria-label="Probar imprevistos">
        {config.stressEvents.map((event) => { const active = result.state.stressEvents.includes(event.id); return <button key={event.id} onClick={() => onStress(event.id)} aria-pressed={active} className={active ? 'is-active' : ''}><Icon name={event.id === 'medical-shock' ? 'shield' : 'wallet'} /><span>{event.label}</span></button> })}
      </div>
    </aside>
  )
}
