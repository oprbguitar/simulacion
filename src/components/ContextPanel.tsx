import { AnimatePresence, motion } from 'motion/react'
import type { ScenarioResult } from '../domain/types'
import { BorderBeam, TextSweep } from '../motion/primitives'
import { dry, pressable, springs } from '../motion/tokens'
import { Icon } from './Icon'

function resilience(result: ScenarioResult) {
  const score = Math.max(0, Math.min(100, Math.round((result.reserveMonths / 9) * 100)))
  return { score, label: score >= 67 ? 'Sólida' : score >= 34 ? 'Media' : 'Frágil', tone: score >= 67 ? 'good' : score >= 34 ? 'warn' : 'risk' }
}

interface ContextPanelProps {
  result: ScenarioResult
  onContinue: () => void
  onProtectReserve: () => void
  onCompare: () => void
  onExplain: () => void
}

export function ContextPanel({ result, onContinue, onProtectReserve, onCompare, onExplain }: ContextPanelProps) {
  const status = resilience(result)
  const insight = result.activeInsight
  const insightKey = insight ? insight.ruleId : 'sin-sugerencia'

  return (
    <aside className="context-panel" aria-labelledby="insight-title">
      <div className="insight-block">
        <p className="insight-kicker">
          <Icon name="lightbulb" size={17} />
          {/* El barrido corre dos ciclos cuando cambia la regla activa:
              avisa de que hay una sugerencia nueva, no decora en bucle. */}
          <TextSweep trigger={insightKey}><span>¿Has pensado en esto?</span></TextSweep>
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={insightKey}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={springs.smooth}
          >
            <h2 id="insight-title">{insight ? insight.title : 'Vas con margen'}</h2>
            <p className="insight-message">{insight ? insight.message : result.nextPrompt}</p>
            {insight ? <button type="button" className="link-button" onClick={onExplain}>Ver por qué aparece esta sugerencia</button> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="insight-actions">
        <motion.button type="button" className="btn btn-primary" onClick={onContinue} title="Avanzar seis meses en la simulación" {...pressable}>
          <BorderBeam />
          Continuar<span className="btn-extra"> 6 meses</span>
        </motion.button>
        <motion.button type="button" className="btn" onClick={onProtectReserve} {...pressable}>Guardar reserva</motion.button>
        <motion.button type="button" className="btn" onClick={onCompare} aria-label="Comparar alternativa" {...pressable}><Icon name="compare" size={17} />Comparar</motion.button>
      </div>

      <motion.div className={`resilience-meter tone-${status.tone}`} layout transition={dry}>
        <span className="resilience-score">{status.score}<small>/100</small></span>
        <span className="resilience-copy">
          <strong>Resiliencia {status.label.toLowerCase()}</strong>
          <span className="level-track" role="img" aria-label={`Resiliencia ${status.score} de 100, derivada de tu reserva`}>
            <motion.i initial={false} animate={{ width: `${status.score}%` }} transition={springs.soft} />
          </span>
        </span>
      </motion.div>
    </aside>
  )
}
