import { motion, useReducedMotion } from 'motion/react'
import type { ScenarioResult } from '../domain/types'
import { itemVariants, listVariants, pressable, springs } from '../motion/tokens'
import { Icon } from './Icon'

const timeLabel = (month: number) => (month === 0 ? 'Inicio' : month < 12 ? `Mes ${month}` : `Año ${Math.round(month / 12)}`)

const statusLabel: Record<string, string> = { done: 'Completado', current: 'En curso', planned: 'Planificado', 'at-risk': 'En riesgo' }

interface LifeTimelineProps {
  result: ScenarioResult
  stressMode: boolean
  onSelect: (id: string) => void
  onOpenDetail: () => void
  onOpenStress: () => void
}

export function LifeTimeline({ result, stressMode, onSelect, onOpenDetail, onOpenStress }: LifeTimelineProps) {
  const reduce = useReducedMotion()
  // Proporción de hitos ya recorridos: el hilo se dibuja hasta ahí.
  const total = Math.max(result.timeline.length - 1, 1)
  const doneCount = result.timeline.filter((event) => event.status === 'done' || event.status === 'current').length
  const progress = Math.min(1, Math.max(0.04, (doneCount - 0.5) / total))

  return (
    <section className="life-timeline" aria-labelledby="timeline-title">
      <div className="timeline-intro">
        <h2 id="timeline-title">Tu línea de tiempo</h2>
        <span>Toca un hito para ver el detalle</span>
      </div>

      <div className="timeline-track" role="list" aria-label="Hitos de vida y vivienda">
        {/* Hilo recorrido: crece sobre el riel al avanzar la simulación. */}
        <motion.span
          className="timeline-thread"
          aria-hidden="true"
          initial={reduce ? false : { scaleX: 0 }}
          animate={{ scaleX: progress }}
          transition={reduce ? { duration: 0 } : { duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
        />

        <motion.div className="timeline-events" variants={listVariants} initial="hidden" animate="shown">
          {result.timeline.map((event) => {
            const selected = event.id === result.state.activeTimelineId
            return (
              <motion.button
                type="button"
                key={event.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.99, y: 0 }}
                transition={springs.snap}
                className={`life-event status-${event.status}${selected ? ' is-selected' : ''}`}
                onClick={() => { onSelect(event.id); onOpenDetail() }}
                aria-pressed={selected}
                aria-label={`${event.label}. ${timeLabel(event.month)}. ${statusLabel[event.status]}. ${event.description}`}
              >
                <span className="event-meta"><small>{timeLabel(event.month)}</small><strong>{event.label}</strong></span>
                <span className="event-dot" aria-hidden="true" />
                <span className="event-desc">{event.description}</span>
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      <div className="timeline-tools">
        <motion.button type="button" className={stressMode ? 'stress-toggle is-on' : 'stress-toggle'} onClick={onOpenStress} aria-pressed={stressMode} {...pressable}>
          <span className="switch" aria-hidden="true">
            <motion.i initial={false} animate={{ x: stressMode ? 18 : 0 }} transition={springs.snap} />
          </span>
          <span className="stress-copy"><strong>Modo «La vida pasa»</strong><small>Simulaciones, no predicciones</small></span>
        </motion.button>
        <motion.button type="button" className="timeline-detail-button" onClick={onOpenDetail} {...pressable}>
          <Icon name="info" size={18} />Detalle
        </motion.button>
      </div>
    </section>
  )
}
