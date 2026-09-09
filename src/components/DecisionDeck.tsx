import { AnimatePresence, motion } from 'motion/react'
import type { ActionId, ContentConfig, HousingPathId, ScenarioResult } from '../domain/types'
import { itemVariants, listVariants, springs } from '../motion/tokens'
import { Icon } from './Icon'

const fallbackImages: Record<HousingPathId, string> = {
  family: '/assets/path-family.webp', renting: '/assets/path-renting.webp', land: '/assets/path-land.webp', none: '/assets/path-none.webp',
}

type Choice = { label: string; short: string; image: string; alt: string; tone: string }

const actionInfo: Partial<Record<ActionId, Choice>> = {
  'save-more': { label: 'Seguir ahorrando', short: 'Fortalece tu base antes de decidir', image: '/assets/action-save.webp', alt: 'Frasco de ahorro con monedas y un brote.', tone: 'green' },
  'buy-land': { label: 'Comprar terreno', short: 'Activa el primer gran paso del proyecto', image: '/assets/path-land.webp', alt: 'Terreno delimitado para iniciar un proyecto.', tone: 'orange' },
  'rent-home': { label: 'Alquilar vivienda', short: 'Prueba la independencia con costo mensual', image: '/assets/path-renting.webp', alt: 'Edificio de viviendas en alquiler.', tone: 'blue' },
  'build-first-floor': { label: 'Construir primer piso', short: 'Levanta cimientos, muros y techo', image: '/assets/action-build.webp', alt: 'Construcción de un primer piso.', tone: 'orange' },
  'keep-family-home': { label: 'Seguir con familia', short: 'Conserva el apoyo y gana margen', image: '/assets/path-family.webp', alt: 'Familia reunida en su vivienda.', tone: 'green' },
}

function options(result: ScenarioResult): ActionId[] {
  if (result.state.sceneStage === 'land') return ['build-first-floor', 'save-more']
  if (result.state.sceneStage === 'structure') return ['save-more', 'rent-home']
  if (result.state.housingPath === 'renting') return ['save-more', 'buy-land']
  if (result.state.housingPath === 'none') return ['rent-home', 'buy-land']
  return ['save-more', 'buy-land']
}

export function DecisionDeck({ result, config, onPathChange, onAction, onOpenRoof }: { result: ScenarioResult; config: ContentConfig; onPathChange: (id: HousingPathId) => void; onAction: (id: ActionId) => void; onOpenRoof: () => void }) {
  const actions = options(result)
  const roofReady = result.state.sceneStage === 'structure'
  const roofLabel = config.roofOptions.find((item) => item.id === result.state.roofOption)?.label ?? 'Sin definir'

  return (
    <section className="decision-deck" aria-label="Decisiones de la simulación">
      <div className="decision-row path-row">
        <div className="decision-question"><span>01</span><h2>¿Dónde vives actualmente?</h2></div>
        <motion.div className="path-options" role="list" aria-label="Situaciones habitacionales" variants={listVariants} initial="hidden" animate="shown">
          {config.housingPaths.map((path) => {
            const selected = result.state.housingPath === path.id
            return (
              <motion.button
                type="button"
                variants={itemVariants}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.985, y: 0 }}
                transition={springs.snap}
                className={selected ? 'visual-choice is-selected' : 'visual-choice'}
                key={path.id}
                onClick={() => onPathChange(path.id)}
                aria-pressed={selected}
                aria-label={`${path.label}. ${path.description}`}
              >
                {/* Un único subrayado viaja entre las cuatro opciones. */}
                {selected ? <motion.span className="choice-underline" layoutId="path-underline" transition={springs.snap} aria-hidden="true" /> : null}
                <span className="visual-choice-image">
                  <img src={path.image ?? fallbackImages[path.id]} alt={path.imageAlt ?? path.label} />
                  <AnimatePresence>
                    {selected ? (
                      <motion.span className="choice-check" initial={{ scale: 0, rotate: -25 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={springs.snap}>
                        <Icon name="check" size={15} />
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </span>
                <span className="visual-choice-copy"><strong>{path.label}</strong><small>{path.description}</small></span>
              </motion.button>
            )
          })}
        </motion.div>
      </div>

      <div className="decision-row action-row">
        <div className="decision-question"><span>02</span><h2>¿Qué quieres probar ahora?</h2></div>
        <motion.div className="action-options" role="list" aria-label="Próximas decisiones" variants={listVariants} initial="hidden" animate="shown">
          <AnimatePresence mode="popLayout" initial={false}>
            {actions.map((id) => {
              const action = actionInfo[id]
              if (!action) return null
              const selected = result.state.selectedAction === id
              return (
                <motion.button
                  type="button"
                  layout
                  key={id}
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.985, y: 0 }}
                  transition={springs.smooth}
                  className={`action-choice tone-${action.tone}${selected ? ' is-selected' : ''}`}
                  onClick={() => onAction(id)}
                  aria-pressed={selected}
                  aria-label={`${action.label}. ${action.short}`}
                >
                  <img src={action.image} alt={action.alt} />
                  <span><strong>{action.label}</strong><small>{action.short}</small></span>
                  <Icon name={selected ? 'check' : 'arrow-right'} size={18} />
                </motion.button>
              )
            })}
            {roofReady ? (
              <motion.button
                type="button"
                layout
                key="roof"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.985, y: 0 }}
                transition={springs.smooth}
                className="action-choice tone-orange is-roof"
                onClick={onOpenRoof}
                aria-label={`Elegir cómo simular el vaciado del techo. Opción actual: ${roofLabel}`}
              >
                <span className="roof-mark" aria-hidden="true"><Icon name="hard-hat" size={26} /></span>
                <span><strong>Vaciado del techo</strong><small>Opción actual: {roofLabel}</small></span>
                <Icon name="arrow-right" size={18} />
              </motion.button>
            ) : null}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  )
}
