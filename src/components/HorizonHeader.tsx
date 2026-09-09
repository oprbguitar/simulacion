import { AnimatePresence, motion } from 'motion/react'
import type { ScenarioResult } from '../domain/types'
import { AnimatedNumber, DeltaChip } from '../motion/primitives'
import { dry, itemVariants, listVariants, pressable } from '../motion/tokens'
import { Icon } from './Icon'

const money = (value: number) => `S/ ${Math.round(value).toLocaleString('es-PE')}`
const months = (value: number) => `${value.toFixed(1)} meses`

interface HorizonHeaderProps {
  result: ScenarioResult
  /** Resultado del paso anterior del historial; da la variación mostrada. */
  previous: ScenarioResult | null
  canUndo: boolean
  canRedo: boolean
  onUndo: () => void
  onRedo: () => void
}

export function HorizonHeader({ result, previous, canUndo, canRedo, onUndo, onRedo }: HorizonHeaderProps) {
  const year = Math.floor(result.state.currentMonth / 12) + 1
  const month = (result.state.currentMonth % 12) + 1
  const lowReserve = result.reserveMonths < 3

  // Variación entre el paso anterior del historial y el actual. Sale del
  // dominio, no de un render previo: undo/redo la recalculan igual.
  const savingsDelta = previous ? Math.round(result.state.liquidSavings - previous.state.liquidSavings) : 0
  const patrimonyDelta = previous ? Math.round(result.patrimony - previous.patrimony) : 0
  const step = result.state.currentMonth

  return (
    <header className="sim-header">
      <a className="sim-brand" href="/" aria-label="Horizonte, simulador de vida y vivienda">
        <strong>HORIZONTE</strong><span>Simulador de vida y vivienda</span>
      </a>
      <motion.div className="sim-metrics" aria-label="Resumen de la simulación" variants={listVariants} initial="hidden" animate="shown">
        <motion.div className="sim-metric" variants={itemVariants}>
          <Icon name="calendar" size={20} />
          <span><small>Periodo</small><strong>Año {year} · Mes {month}</strong></span>
        </motion.div>

        <motion.div className="sim-metric metric-savings" variants={itemVariants}>
          <Icon name="wallet" size={20} />
          <span><small>Ahorro</small><strong><AnimatedNumber value={result.state.liquidSavings} format={money} /></strong></span>
          <AnimatePresence>{savingsDelta ? <DeltaChip key={`s${step}-${savingsDelta}`} delta={savingsDelta} format={money} /> : null}</AnimatePresence>
        </motion.div>

        <motion.div className="sim-metric" variants={itemVariants}>
          <Icon name="sprout" size={20} />
          <span><small>Ingreso mensual</small><strong><AnimatedNumber value={result.state.monthlyIncome} format={money} /></strong></span>
        </motion.div>

        <motion.div className={lowReserve ? 'sim-metric metric-alert' : 'sim-metric'} variants={itemVariants} animate={lowReserve ? { x: [0, -2, 2, 0] } : {}} transition={{ duration: 0.28 }}>
          <Icon name="shield" size={20} />
          <span><small>Reserva</small><strong><AnimatedNumber value={result.reserveMonths} format={months} /></strong></span>
        </motion.div>

        <motion.div className="sim-metric" variants={itemVariants}>
          <Icon name="home" size={20} />
          <span><small>Patrimonio simulado</small><strong><AnimatedNumber value={result.patrimony} format={money} /></strong></span>
          <AnimatePresence>{patrimonyDelta ? <DeltaChip key={`p${step}-${patrimonyDelta}`} delta={patrimonyDelta} format={money} /> : null}</AnimatePresence>
        </motion.div>
      </motion.div>
      <nav className="sim-tools" aria-label="Herramientas">
        <motion.button type="button" onClick={onUndo} disabled={!canUndo} aria-label="Deshacer último paso" title="Deshacer" {...pressable} transition={dry}><Icon name="undo" /></motion.button>
        <motion.button type="button" onClick={onRedo} disabled={!canRedo} aria-label="Rehacer último paso" title="Rehacer" {...pressable} transition={dry}><Icon name="redo" /></motion.button>
        <motion.a href="/_studio" aria-label="Editar supuestos" title="Editar supuestos" {...pressable} transition={dry}><Icon name="settings" /></motion.a>
      </nav>
    </header>
  )
}
