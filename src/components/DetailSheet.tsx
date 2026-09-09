import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { compareScenarios } from '../domain/simulation'
import type { ContentConfig, RoofOptionConfig, ScenarioResult, SheetId, StressEventId } from '../domain/types'
import { pressable, springs } from '../motion/tokens'
import { Icon } from './Icon'

const money = (value: number) => `S/ ${Math.round(value).toLocaleString('es-PE')}`

const originLabel: Record<string, string> = {
  REAL: 'Dato real',
  SEEDED_REFERENCE: 'Referencia sembrada',
  MOCK: 'Solo demostración',
}

function OriginBadge({ origin, note }: { origin: string; note?: string }) {
  return <span className={`origin-badge origin-${origin.toLowerCase()}`} title={note}>{originLabel[origin] ?? origin}</span>
}

const titles: Record<Exclude<SheetId, null>, string> = {
  comparison: 'Comparar caminos con los mismos supuestos',
  timeline: 'Detalle del hito',
  stress: 'Modo «La vida pasa»',
  insight: '¿Por qué aparece esta sugerencia?',
  roof: 'Llegó el momento del techo',
}

interface DetailSheetProps {
  sheet: SheetId
  result: ScenarioResult
  config: ContentConfig
  onClose: () => void
  onStress: (id: StressEventId) => void
  onRoof: (id: RoofOptionConfig['id']) => void
  onConfirmStructuralPlan: () => void
}

export function DetailSheet({ sheet, result, config, onClose, onStress, onRoof, onConfirmStructuralPlan }: DetailSheetProps) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!sheet) return
    closeRef.current?.focus()
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [sheet, onClose])

  const event = result.timeline.find((item) => item.id === result.state.activeTimelineId) ?? result.timeline.at(0)
  const insight = result.activeInsight

  return (
    <AnimatePresence>
      {sheet ? (
    <motion.div
      className="sheet-backdrop"
      role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.16 }}
    >
      <motion.section
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={springs.smooth}
      >
        <header className="sheet-head">
          <h2 id="sheet-title">{titles[sheet]}</h2>
          <motion.button type="button" ref={closeRef} onClick={onClose} aria-label="Cerrar detalle" {...pressable}><Icon name="close" size={20} /></motion.button>
        </header>

        <motion.div
          className="sheet-body"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.smooth, delay: 0.05 }}
        >
          {sheet === 'comparison' ? (
            <>
              <p className="sheet-lead">No hay un ganador universal. Estos tres caminos usan los mismos supuestos locales y se proyectan a 24 meses.</p>
              <table className="compare-table">
                <thead>
                  <tr><th scope="col">Camino</th><th scope="col">Costo mensual</th><th scope="col">Ahorro proyectado</th><th scope="col">Patrimonio</th></tr>
                </thead>
                <tbody>
                  {compareScenarios(result.state, config).map((row) => (
                    <tr key={row.id}>
                      <th scope="row"><strong>{row.label}</strong><span>{row.description}</span></th>
                      <td>{money(row.monthlyCost)}</td>
                      <td>{money(row.projectedSavings)}</td>
                      <td>{money(row.projectedPatrimony)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="sheet-source"><OriginBadge origin="SEEDED_REFERENCE" note={config.assumptions.source.note} /> {config.assumptions.source.sourceName}. {config.assumptions.source.note}</p>
            </>
          ) : null}

          {sheet === 'timeline' && event ? (
            <>
              <p className="sheet-lead">{event.description}</p>
              <dl className="fact-grid">
                <div><dt>Momento</dt><dd>{event.month === 0 ? 'Inicio' : `Mes ${event.month}`}</dd></div>
                <div><dt>Tipo de hito</dt><dd>{event.kind}</dd></div>
                <div><dt>Estado</dt><dd>{event.status === 'at-risk' ? 'En riesgo' : event.status === 'done' ? 'Completado' : event.status === 'current' ? 'En curso' : 'Planificado'}</dd></div>
              </dl>
              <h3>Rango del paso simulado</h3>
              <ul className="range-list">
                <li><span>Económico</span><strong>{money(result.costRange.low)}</strong></li>
                <li><span>Probable</span><strong>{money(result.costRange.expected)}</strong></li>
                <li><span>Conservador</span><strong>{money(result.costRange.high)}</strong></li>
              </ul>
              <p className="sheet-source"><OriginBadge origin={event.origin} note={config.assumptions.source.note} /> {config.assumptions.source.note}</p>
            </>
          ) : null}

          {sheet === 'stress' ? (
            <>
              <p className="sheet-lead">Estos eventos <strong>no son predicciones</strong>. Sirven para ver cuánto margen te queda si la vida no sale como la planeaste.</p>
              <ul className="stress-list">
                {config.stressEvents.map((item) => {
                  const active = result.state.stressEvents.includes(item.id)
                  return (
                    <li key={item.id}>
                      <button type="button" className={active ? 'stress-item is-on' : 'stress-item'} onClick={() => onStress(item.id)} aria-pressed={active}>
                        <span className="stress-check" aria-hidden="true">{active ? <Icon name="check" size={16} /> : null}</span>
                        <span><strong>{item.label}</strong><small>{item.description}</small></span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              <p className="sheet-source"><OriginBadge origin="SEEDED_REFERENCE" /> Supuestos editables desde el Studio.</p>
            </>
          ) : null}

          {sheet === 'insight' && insight ? (
            <>
              <p className="sheet-lead">{insight.message}</p>
              <p className="sheet-detail">{insight.detail}</p>
              <h3>Qué podrías probar</h3>
              <ul className="suggestion-list">{insight.suggestions.map((item) => <li key={item}>{item}</li>)}</ul>
              <p className="rule-line"><code>{insight.ruleId}</code> — regla explícita y auditable, sin puntaje oculto.</p>
              {insight.ruleId === 'FUTURE_STRUCTURAL_CAPACITY' && !result.state.structuralPlanConfirmed ? (
                <button type="button" className="btn btn-primary" onClick={onConfirmStructuralPlan}>Marcar la ampliación como objetivo</button>
              ) : null}
            </>
          ) : null}

          {sheet === 'roof' ? (
            <>
              <p className="sheet-lead">¿Cómo quieres simular el vaciado? Solo se estiman consecuencias económicas y logísticas: esta simulación no dimensiona elementos estructurales.</p>
              <ul className="roof-list">
                {config.roofOptions.map((item) => {
                  const active = result.state.roofOption === item.id
                  return (
                    <li key={item.id}>
                      <button type="button" className={active ? 'roof-item is-on' : 'roof-item'} onClick={() => onRoof(item.id)} aria-pressed={active}>
                        <span><strong>{item.label}</strong><small>{item.detail}</small></span>
                        <span className="roof-factor">×{item.costFactor.toFixed(2)}<small>{item.durationMonths} mes(es)</small></span>
                      </button>
                    </li>
                  )
                })}
              </ul>
              <p className="sheet-source"><OriginBadge origin="SEEDED_REFERENCE" /> Factores de referencia, no cotizaciones vigentes.</p>
            </>
          ) : null}
        </motion.div>
      </motion.section>
    </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
