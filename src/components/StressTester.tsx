import type { ContentConfig, ScenarioState, StressEventId } from '../domain/types'
import { Icon } from './Icon'

export function StressTester({ config, state, onToggle }: { config: ContentConfig; state: ScenarioState; onToggle: (id: StressEventId) => void }) {
  const active = state.stressEvents.length > 0
  return (
    <section className={active ? 'stress-panel is-active' : 'stress-panel'} aria-labelledby="stress-title">
      <div className="stress-heading"><span className="stress-icon"><Icon name={active ? 'warning' : 'shield'} size={22} /></span><div><h2 id="stress-title">La vida pasa</h2><p>Prueba situaciones inesperadas. Son simulaciones, no predicciones.</p></div><span className={active ? 'toggle-visual is-on' : 'toggle-visual'} aria-hidden="true"><span /></span></div>
      <div className="stress-events">{config.stressEvents.map((event) => { const isOn = state.stressEvents.includes(event.id); return <button className={isOn ? 'stress-event is-on' : 'stress-event'} key={event.id} onClick={() => onToggle(event.id)} aria-pressed={isOn}><span className="stress-event-icon"><Icon name={event.id === 'medical-shock' ? 'shield' : 'wallet'} size={18} /></span><span><strong>{event.label}</strong><small>{event.description}</small></span><span className="event-check">{isOn ? <Icon name="check" size={16} /> : <span className="empty-check" />}</span></button> })}</div>
      <p className="stress-note">El impacto se aplica al ahorro y al tiempo de tu ruta de forma determinista.</p>
    </section>
  )
}
