import type { ScenarioResult } from '../domain/types'
import { Icon } from './Icon'

function monthLabel(month: number): string {
  if (month === 0) return 'Ahora'
  const year = Math.floor(month / 12)
  const remainder = month % 12
  return remainder === 0 ? `Año ${year}` : `Mes ${month}`
}

export function Timeline({ result, onSelect }: { result: ScenarioResult; onSelect: (id: string) => void }) {
  const selected = result.timeline.find((event) => event.id === result.state.activeTimelineId) ?? result.timeline.at(0)
  return (
    <section className="timeline-panel" aria-labelledby="timeline-title">
      <div className="timeline-heading"><div><span className="eyebrow">Tu proyecto cambia con el tiempo</span><h2 id="timeline-title">Línea de tiempo</h2></div><span className="timeline-range">2026 → 2030 <Icon name="calendar" size={16} /></span></div>
      <div className="timeline-rail" role="list" aria-label="Hitos de la simulación">
        <div className="timeline-line" aria-hidden="true" />
        {result.timeline.map((event) => <button className={`timeline-node status-${event.status}`} key={event.id} onClick={() => onSelect(event.id)} aria-pressed={selected?.id === event.id} aria-label={`${event.label}, ${monthLabel(event.month)}. ${event.description}`}><span className="node-dot"><Icon name={event.kind === 'construction_stage' ? 'hard-hat' : event.kind === 'expense' ? 'wallet' : event.kind === 'risk_event' ? 'warning' : 'sprout'} size={16} /></span><span className="node-text"><strong>{event.label}</strong><span>{monthLabel(event.month)}</span></span></button>)}
      </div>
      {selected && <div className="timeline-detail"><span className="detail-mark" aria-hidden="true" /><div><strong>{selected.label}</strong><p>{selected.description}</p></div><span className={`status-label status-label-${selected.status}`}>{selected.status === 'at-risk' ? 'En riesgo' : selected.status === 'current' ? 'En curso' : selected.status === 'done' ? 'Completado' : 'Por venir'}</span></div>}
    </section>
  )
}
