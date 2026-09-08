import type { ScenarioResult } from '../domain/types'
import { Icon } from './Icon'

const timeLabel = (month: number) => month === 0 ? 'Inicio' : month < 12 ? `Mes ${month}` : `Año ${Math.round(month / 12)}`

export function LifeTimeline({ result, onSelect }: { result: ScenarioResult; onSelect: (id: string) => void }) {
  return (
    <section className="life-timeline" aria-labelledby="timeline-title">
      <div className="timeline-intro"><h2 id="timeline-title">La vida pasa</h2><span>Explora cada hito</span></div>
      <button className="timeline-play" aria-label="Reproducir recorrido"><Icon name="play" /></button>
      <div className="timeline-track" role="list" aria-label="Hitos de vida y vivienda">
        {result.timeline.slice(0, 6).map((event) => { const selected = event.id === result.state.activeTimelineId; return <button key={event.id} className={`life-event status-${event.status}${selected ? ' is-selected' : ''}`} onClick={() => onSelect(event.id)} aria-pressed={selected} aria-label={`${event.label}. ${timeLabel(event.month)}. ${event.description}`}><span className="event-dot" /><span><small>{timeLabel(event.month)}</small><strong>{event.label}</strong><em>{event.description}</em></span></button> })}
      </div>
    </section>
  )
}
