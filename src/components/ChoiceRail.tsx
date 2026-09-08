import type { ActionId, ContentConfig, HousingPathId, ScenarioResult } from '../domain/types'
import { Icon } from './Icon'
import { OriginBadge } from './OriginBadge'

const actionMeta: Record<ActionId, { label: string; description: string; icon: 'sprout' | 'land' | 'home' | 'hard-hat' | 'family' }> = {
  'save-more': { label: 'Seguir ahorrando', description: 'Aumenta el colchón antes de comprometerte.', icon: 'sprout' },
  'buy-land': { label: 'Comprar terreno', description: 'El primer paso hacia un proyecto propio.', icon: 'land' },
  'rent-home': { label: 'Alquilar una vivienda', description: 'Gana independencia con un costo mensual.', icon: 'home' },
  'build-first-floor': { label: 'Construir primer piso', description: 'Empieza una construcción progresiva.', icon: 'hard-hat' },
  'keep-family-home': { label: 'Seguir con familia', description: 'Conserva apoyo y fortalece tu base.', icon: 'family' },
}

function actionOptions(path: HousingPathId | null, stage: ScenarioResult['state']['sceneStage']): ActionId[] {
  if (stage === 'land') return ['build-first-floor', 'save-more', 'rent-home']
  if (stage === 'structure') return ['save-more', 'rent-home']
  if (path === 'renting') return ['save-more', 'buy-land', 'keep-family-home']
  if (path === 'none') return ['rent-home', 'buy-land', 'save-more']
  return ['save-more', 'buy-land', 'rent-home']
}

export function ChoiceRail({ result, config, onPathChange, onAction }: { result: ScenarioResult; config: ContentConfig; onPathChange: (path: HousingPathId) => void; onAction: (action: ActionId) => void }) {
  const selectedPath = result.state.housingPath
  const options = actionOptions(selectedPath, result.state.sceneStage)
  return (
    <section className="choice-rail" aria-labelledby="choice-heading">
      <div className="choice-question">
        <span className="question-index">01</span>
        <div><span className="eyebrow">Punto de partida</span><h2 id="choice-heading">¿Dónde vives actualmente?</h2><p>Elige el lugar desde donde quieres explorar. Puedes cambiarlo después.</p></div>
      </div>
      <div className="path-list" role="list" aria-label="Situaciones habitacionales">
        {config.housingPaths.map((path) => <button className={selectedPath === path.id ? 'path-row is-selected' : 'path-row'} key={path.id} onClick={() => onPathChange(path.id)} aria-pressed={selectedPath === path.id}><span className="path-icon"><Icon name={path.icon} size={22} /></span><span className="path-copy"><strong>{path.label}</strong><span>{path.description}</span></span><OriginBadge origin={path.origin} /><span className="path-indicator">{selectedPath === path.id ? <Icon name="check" size={17} /> : <Icon name="chevron-right" size={18} />}</span></button>)}
      </div>
      <div className="next-choice">
        <div className="next-choice-heading"><span className="question-index">02</span><div><span className="eyebrow">Siguiente movimiento</span><h3>{result.nextPrompt}</h3></div></div>
        <div className="action-list">{options.map((action) => { const meta = actionMeta[action]; return <button className={result.state.selectedAction === action ? 'action-row is-selected' : 'action-row'} key={action} onClick={() => onAction(action)} aria-pressed={result.state.selectedAction === action}><span className="action-icon"><Icon name={meta.icon} size={22} /></span><span className="action-copy"><strong>{meta.label}</strong><span>{meta.description}</span></span><span className="action-arrow"><Icon name="arrow-right" size={19} /></span></button> })}</div>
      </div>
    </section>
  )
}
