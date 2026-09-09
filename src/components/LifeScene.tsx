import { AnimatePresence, motion } from 'motion/react'
import type { LayerId, SceneStage, ScenarioResult } from '../domain/types'
import { AnimatedNumber, Ripple } from '../motion/primitives'
import { dry, itemVariants, listVariants, springs } from '../motion/tokens'
import { usePointerParallax } from '../motion/useParallax'
import { Icon } from './Icon'

interface SceneLayer {
  id: LayerId
  title: string
  copy: string
  tone: string
  /** Zona de la ilustración, en porcentaje: left, top, width, height. */
  zone: [number, number, number, number]
}

const layers: SceneLayer[] = [
  { id: 'finishes', title: 'Casa familiar', copy: 'Tu punto de partida', tone: 'green', zone: [6, 32, 42, 42] },
  { id: 'site', title: 'Terreno', copy: 'El espacio donde crecer', tone: 'blue', zone: [47, 28, 25, 40] },
  { id: 'structure', title: 'Cimientos', copy: 'La base que da seguridad', tone: 'orange', zone: [30, 66, 40, 30] },
  { id: 'systems', title: 'Hogar futuro', copy: 'Tu meta por construir', tone: 'gray', zone: [5, 66, 24, 30] },
]

const stageLayer: Record<SceneStage, LayerId> = {
  family: 'finishes',
  rental: 'finishes',
  land: 'site',
  foundation: 'structure',
  structure: 'structure',
  home: 'systems',
}

const money = (value: number) => `S/ ${Math.round(value).toLocaleString('es-PE')}`

export function LifeScene({ result, onLayerChange, showCost = false }: { result: ScenarioResult; onLayerChange: (layer: LayerId) => void; showCost?: boolean }) {
  const focusId = result.state.selectedLayer ?? stageLayer[result.state.sceneStage]
  const focus = layers.find((layer) => layer.id === focusId) ?? layers[0]
  const [left, top, width, height] = focus.zone
  const parallax = usePointerParallax(12)

  return (
    <section
      className={`life-scene stage-${result.state.sceneStage}`}
      aria-labelledby="scene-title"
      onPointerMove={parallax.onPointerMove}
      onPointerLeave={parallax.onPointerLeave}
    >
      <h1 className="sr-only">Horizonte: simulador visual de vivienda</h1>

      {/* La ilustración se desplaza unos píxeles con el puntero: da
          profundidad al corte sin convertirse en movimiento ambiental. */}
      <motion.div className="scene-media" style={parallax.style} aria-hidden={false}>
        <img src="/assets/horizonte-life-scene-v1.webp" alt="Casa familiar peruana en corte, con patio, terreno, cimientos y un hogar futuro dibujado bajo tierra." />
      </motion.div>

      {/* Una onda por cambio de etapa: el ojo encuentra qué se movió. */}
      <AnimatePresence><Ripple key={result.state.sceneStage} /></AnimatePresence>

      {/* El marco de foco viaja con resorte entre zonas de la escena. */}
      <motion.div
        className={`scene-focus tone-${focus.tone}`}
        animate={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` }}
        transition={springs.smooth}
        aria-hidden="true"
      >
        <span className="focus-tag">{focus.title}</span>
      </motion.div>

      <div className="scene-state" aria-live="polite">
        <span><Icon name={result.state.sceneStage === 'rental' ? 'renting' : result.state.sceneStage === 'family' ? 'family' : 'home'} /></span>
        <div>
          <small>Tu historia en marcha</small>
          <AnimatePresence mode="wait" initial={false}>
            <motion.h2
              key={result.sceneLabel}
              id="scene-title"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={springs.snap}
            >
              {result.sceneLabel}
            </motion.h2>
          </AnimatePresence>
          <AnimatePresence mode="wait" initial={false}>
            <motion.p key={result.contextLine} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={dry}>
              {result.contextLine}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showCost && result.state.projectCost > 0 ? (
          <motion.div className="scene-cost" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} transition={springs.smooth}>
            <small>Costo aproximado del paso</small>
            <strong>
              <AnimatedNumber value={result.costRange.low} format={money} /> – <AnimatedNumber value={result.costRange.high} format={money} />
            </strong>
            <span>Escenario probable <AnimatedNumber value={result.costRange.expected} format={money} /> · supuesto local editable</span>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className="scene-progress" aria-hidden="true"><span /></div>

      <motion.div className="scene-labels" aria-label="Capas de la escena" variants={listVariants} initial="hidden" animate="shown">
        {layers.map((layer) => (
          <motion.button
            type="button"
            key={layer.id}
            variants={itemVariants}
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            className={`scene-label tone-${layer.tone}`}
            onClick={() => onLayerChange(layer.id)}
            aria-pressed={focusId === layer.id}
            aria-label={`${layer.title}. ${layer.copy}`}
          >
            <span className="label-line" aria-hidden="true" /><span className="label-dot" aria-hidden="true" />
            <span className="label-copy"><strong>{layer.title}</strong><small>{layer.copy}</small></span>
          </motion.button>
        ))}
      </motion.div>

      <p className="scene-disclaimer">Simulación educativa · montos referenciales</p>
    </section>
  )
}
