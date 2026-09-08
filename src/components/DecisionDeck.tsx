import type { CSSProperties } from 'react'
import type { ActionId, ContentConfig, HousingPathId, ScenarioResult } from '../domain/types'
import { Icon } from './Icon'

const fallbackImages: Record<HousingPathId, string> = {
  family: '/assets/path-family.png', renting: '/assets/path-renting.png', land: '/assets/path-land.png', none: '/assets/path-none.png',
}

const actionInfo: Record<ActionId, { label: string; short: string; image: string; alt: string; tone: string }> = {
  'save-more': { label: 'Seguir ahorrando', short: 'Fortalece tu base', image: '/assets/action-save.png', alt: 'Frasco de ahorro con monedas y un brote.', tone: 'green' },
  'buy-land': { label: 'Comprar terreno', short: 'Activa el primer gran paso', image: '/assets/path-land.png', alt: 'Terreno delimitado para iniciar un proyecto.', tone: 'orange' },
  'rent-home': { label: 'Alquilar vivienda', short: 'Prueba independencia', image: '/assets/path-renting.png', alt: 'Edificio de viviendas en alquiler.', tone: 'blue' },
  'build-first-floor': { label: 'Construir primer piso', short: 'Levanta la estructura', image: '/assets/action-build.png', alt: 'Construcción de un primer piso.', tone: 'orange' },
  'keep-family-home': { label: 'Seguir con familia', short: 'Conserva apoyo y margen', image: '/assets/path-family.png', alt: 'Familia reunida en su vivienda.', tone: 'green' },
}

function options(result: ScenarioResult): ActionId[] {
  if (result.state.sceneStage === 'land') return ['build-first-floor', 'save-more']
  if (result.state.sceneStage === 'structure') return ['save-more', 'rent-home']
  if (result.state.housingPath === 'renting') return ['save-more', 'buy-land']
  if (result.state.housingPath === 'none') return ['rent-home', 'buy-land']
  return ['save-more', 'buy-land']
}

export function DecisionDeck({ result, config, onPathChange, onAction }: { result: ScenarioResult; config: ContentConfig; onPathChange: (id: HousingPathId) => void; onAction: (id: ActionId) => void }) {
  const actions = options(result)
  return (
    <section className="decision-deck" aria-label="Decisiones de la simulación">
      <div className="decision-row path-row">
        <div className="decision-question"><span>01</span><h2>¿Dónde vives actualmente?</h2></div>
        <div className="path-options" role="list" aria-label="Situaciones habitacionales">
          {config.housingPaths.map((path, index) => {
            const selected = result.state.housingPath === path.id
            return <button style={{ '--item-index': index } as CSSProperties} className={selected ? 'visual-choice is-selected' : 'visual-choice'} key={path.id} onClick={() => onPathChange(path.id)} aria-pressed={selected} aria-label={`${path.label}. ${path.description}`}>
              <span className="visual-choice-image"><img src={path.image ?? fallbackImages[path.id]} alt={path.imageAlt ?? path.label} />{selected ? <span className="choice-check"><Icon name="check" /></span> : null}</span>
              <strong>{path.label}</strong><small>{path.description}</small>
            </button>
          })}
        </div>
      </div>
      <div className="decision-row action-row">
        <div className="decision-question"><span>02</span><h2>¿Qué quieres probar ahora?</h2></div>
        <div className="action-options" role="list" aria-label="Próximas decisiones">
          {actions.map((id, index) => { const action = actionInfo[id]; const selected = result.state.selectedAction === id; return (
            <button style={{ '--item-index': index + 4 } as CSSProperties} className={`action-choice tone-${action.tone}${selected ? ' is-selected' : ''}`} key={id} onClick={() => onAction(id)} aria-pressed={selected} aria-label={`${action.label}. ${action.short}`}>
              <img src={action.image} alt={action.alt} /><span><strong>{action.label}</strong><small>{action.short}</small></span><Icon name={selected ? 'check' : 'arrow-right'} />
            </button>
          ) })}
        </div>
      </div>
    </section>
  )
}
