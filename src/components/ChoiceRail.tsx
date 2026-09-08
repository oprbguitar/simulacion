import type { ActionId, ContentConfig, HousingPathConfig, HousingPathId, ScenarioResult } from '../domain/types'
import { Icon } from './Icon'
import { OriginBadge } from './OriginBadge'

type ActionAccent = 'green' | 'orange' | 'blue'

interface ActionMeta {
  label: string
  description: string
  detail: string
  icon: 'sprout' | 'land' | 'home' | 'hard-hat' | 'family'
  image: string
  imageAlt: string
  accent: ActionAccent
}

const pathFallbacks: Record<HousingPathId, { image: string; imageAlt: string; detail: string }> = {
  family: { image: '/assets/path-family.png', imageAlt: 'Familia reunida en una vivienda.', detail: 'Una base familiar puede liberar margen para ordenar tu siguiente paso.' },
  renting: { image: '/assets/path-renting.png', imageAlt: 'Edificio de departamentos en una ciudad costera.', detail: 'La independencia viene acompañada de un costo mensual que conviene mirar con tu reserva.' },
  land: { image: '/assets/path-land.png', imageAlt: 'Terreno delimitado listo para comenzar un proyecto.', detail: 'El terreno da un lugar concreto desde donde planificar la construcción.' },
  none: { image: '/assets/path-none.png', imageAlt: 'Casa abierta que representa una futura vivienda.', detail: 'Comparar antes de decidir te permite cuidar tu margen y tu tiempo.' },
}

const actionMeta: Record<ActionId, ActionMeta> = {
  'save-more': {
    label: 'Seguir ahorrando',
    description: 'Aumenta el colchón antes de comprometerte.',
    detail: 'Seis meses más de ahorro aumentan tu liquidez y te dejan más margen para elegir el siguiente paso.',
    icon: 'sprout',
    image: '/assets/action-save.png',
    imageAlt: 'Frasco con monedas y un brote que representa el ahorro.',
    accent: 'green',
  },
  'buy-land': {
    label: 'Comprar terreno',
    description: 'El primer paso hacia un proyecto propio.',
    detail: 'La compra simulada convierte parte de tu liquidez en un activo y activa el siguiente hito del proyecto.',
    icon: 'land',
    image: '/assets/path-land.png',
    imageAlt: 'Terreno delimitado listo para comenzar un proyecto.',
    accent: 'orange',
  },
  'rent-home': {
    label: 'Alquilar una vivienda',
    description: 'Gana independencia con un costo mensual.',
    detail: 'Alquilar mueve la simulación hacia una vivienda independiente y suma un costo recurrente a tu flujo mensual.',
    icon: 'home',
    image: '/assets/path-renting.png',
    imageAlt: 'Edificio pequeño de departamentos en una ciudad costera.',
    accent: 'blue',
  },
  'build-first-floor': {
    label: 'Construir primer piso',
    description: 'Empieza una construcción progresiva.',
    detail: 'La construcción simulada muestra una primera estructura y hace visible el costo de avanzar mientras mantienes una reserva.',
    icon: 'hard-hat',
    image: '/assets/action-build.png',
    imageAlt: 'Trabajador levantando muros sobre una losa de cimentación.',
    accent: 'orange',
  },
  'keep-family-home': {
    label: 'Seguir con familia',
    description: 'Conserva apoyo y fortalece tu base.',
    detail: 'Mantener esta base conserva apoyo habitacional y te permite priorizar liquidez antes de independizarte.',
    icon: 'family',
    image: '/assets/path-family.png',
    imageAlt: 'Familia reunida en la sala de una vivienda.',
    accent: 'green',
  },
}

function actionOptions(path: HousingPathId | null, stage: ScenarioResult['state']['sceneStage']): ActionId[] {
  if (stage === 'land') return ['build-first-floor', 'save-more', 'rent-home']
  if (stage === 'structure') return ['save-more', 'rent-home']
  if (path === 'renting') return ['save-more', 'buy-land', 'keep-family-home']
  if (path === 'none') return ['rent-home', 'buy-land', 'save-more']
  return ['save-more', 'buy-land', 'rent-home']
}

function money(value: number): string {
  return `S/ ${Math.round(value).toLocaleString('es-PE')}`
}

function pathImage(path: HousingPathConfig) {
  const fallback = pathFallbacks[path.id] ?? pathFallbacks.none
  return {
    image: path.image ?? fallback.image,
    imageAlt: path.imageAlt ?? fallback.imageAlt,
    detail: path.detail ?? fallback.detail,
  }
}

export function ChoiceRail({ result, config, onPathChange, onAction }: { result: ScenarioResult; config: ContentConfig; onPathChange: (path: HousingPathId) => void; onAction: (action: ActionId) => void }) {
  const selectedPath = result.state.housingPath
  const selectedPathConfig = config.housingPaths.find((path) => path.id === selectedPath)
  const options = actionOptions(selectedPath, result.state.sceneStage)
  const selectedAction = result.state.selectedAction ? actionMeta[result.state.selectedAction] : null
  const selectedPathVisual = selectedPathConfig ? pathImage(selectedPathConfig) : null
  const detailTitle = selectedAction?.label ?? selectedPathConfig?.label ?? 'Elige una imagen para comenzar'
  const detailCopy = selectedAction?.detail ?? selectedPathVisual?.detail ?? 'Selecciona una situación habitacional. El detalle y la escena se actualizarán aquí mismo.'
  const detailOrigin = selectedPathConfig?.origin ?? 'MOCK'

  return (
    <section className="choice-rail" aria-labelledby="choice-heading">
      <div className="path-selection">
        <div className="choice-question">
          <span className="question-index">01</span>
          <div>
            <span className="eyebrow">Punto de partida</span>
            <h2 id="choice-heading">¿Dónde vives actualmente?</h2>
            <p>Elige una imagen. Puedes cambiarla después y comparar otra ruta.</p>
          </div>
        </div>
        <div className="path-list" role="list" aria-label="Situaciones habitacionales">
          {config.housingPaths.map((path) => {
            const visual = pathImage(path)
            const isSelected = selectedPath === path.id
            return (
              <button className={isSelected ? 'path-card is-selected' : 'path-card'} key={path.id} onClick={() => onPathChange(path.id)} aria-pressed={isSelected} aria-label={`${path.label}. ${path.description}`}>
                <span className="path-card-media"><img src={visual.image} alt={visual.imageAlt} /></span>
                <span className="path-card-copy"><strong>{path.label}</strong><span>{path.description}</span></span>
                <span className="path-card-state" aria-hidden="true">{isSelected ? <Icon name="check" size={17} /> : <Icon name="chevron-right" size={17} />}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="selection-detail" aria-live="polite">
        <div className="detail-lead">
          <span className="eyebrow">Detalle de esta ruta</span>
          <h3>{detailTitle}</h3>
          <p>{detailCopy}</p>
        </div>
        <dl className="detail-facts">
          <div><dt>Estado visual</dt><dd>{result.sceneLabel}</dd></div>
          <div><dt>Ahorro líquido</dt><dd>{money(result.state.liquidSavings)}</dd></div>
          <div><dt>{result.state.selectedAction ? 'Paso simulado' : 'Reserva actual'}</dt><dd>{result.state.selectedAction ? money(result.costRange.expected) : `${result.reserveMonths.toLocaleString('es-PE')} meses`}</dd></div>
        </dl>
        <div className="detail-footer"><span>{selectedPath ? 'El detalle se actualiza al probar cada decisión.' : 'La escena cambiará cuando elijas tu punto de partida.'}</span><OriginBadge origin={detailOrigin} /></div>
      </div>

      <div className="next-choice">
        <div className="next-choice-heading">
          <span className="question-index">02</span>
          <div><span className="eyebrow">Siguiente movimiento</span><h3>{result.nextPrompt}</h3></div>
        </div>
        {selectedPath ? (
          <div className="action-list" role="list" aria-label="Decisiones siguientes">
            {options.map((action) => {
              const meta = actionMeta[action]
              const isSelected = result.state.selectedAction === action
              return (
                <button className={`action-card accent-${meta.accent}${isSelected ? ' is-selected' : ''}`} key={action} onClick={() => onAction(action)} aria-pressed={isSelected} aria-label={`${meta.label}. ${meta.description}`}>
                  <span className="action-card-media"><img src={meta.image} alt={meta.imageAlt} /></span>
                  <span className="action-copy"><strong>{meta.label}</strong><span>{meta.description}</span></span>
                  <span className="action-arrow"><Icon name={isSelected ? 'check' : 'arrow-right'} size={19} /></span>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="action-empty"><Icon name="info" size={20} /><div><strong>Primero elige una situación.</strong><p>Después aparecerán hasta tres decisiones posibles para esa ruta.</p></div></div>
        )}
      </div>
    </section>
  )
}
