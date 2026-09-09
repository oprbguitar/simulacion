import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { ContextPanel } from './components/ContextPanel'
import { DecisionDeck } from './components/DecisionDeck'
import { DetailSheet } from './components/DetailSheet'
import { HorizonHeader } from './components/HorizonHeader'
import { LifeScene } from './components/LifeScene'
import { LifeTimeline } from './components/LifeTimeline'
import { loadStoredContent } from './domain/configStorage'
import { confirmStructuralPlan, createInitialScenario, selectHousingPath, setRoofOption, simulateAction, simulateScenario, toggleStressEvent } from './domain/simulation'
import type { ActionId, HousingPathId, LayerId, RoofOptionConfig, ScenarioState, SheetId, StressEventId } from './domain/types'

function commitState(next: ScenarioState, current: ScenarioState, setCurrent: (value: ScenarioState) => void, setPast: Dispatch<SetStateAction<ScenarioState[]>>, setFuture: Dispatch<SetStateAction<ScenarioState[]>>) {
  setPast((items) => [...items, current])
  setCurrent(next)
  setFuture([])
}

export function App() {
  const [config] = useState(loadStoredContent)
  const [scenario, setScenario] = useState(() => selectHousingPath(createInitialScenario(config), 'family'))
  const [past, setPast] = useState<ScenarioState[]>([])
  const [future, setFuture] = useState<ScenarioState[]>([])
  const [sheet, setSheet] = useState<SheetId>(null)
  const result = useMemo(() => simulateScenario(scenario, config), [scenario, config])
  // El paso anterior del historial alimenta las fichas de variación del
  // encabezado. `simulateScenario` es puro, así que recalcularlo es barato.
  const previousStep = past.at(-1)
  const previousResult = useMemo(() => (previousStep ? simulateScenario(previousStep, config) : null), [previousStep, config])

  const commit = (next: ScenarioState) => commitState(next, scenario, setScenario, setPast, setFuture)
  const onPathChange = (path: HousingPathId) => commit(selectHousingPath(scenario, path))
  const onAction = (action: ActionId) => commit(simulateAction(scenario, action, config))
  const onStress = (id: StressEventId) => commit(toggleStressEvent(scenario, id, config))
  const onRoof = (id: RoofOptionConfig['id']) => commit(setRoofOption(scenario, id, config))
  const onTimeline = (id: string) => setScenario((current) => ({ ...current, activeTimelineId: id }))
  const onLayer = (layer: LayerId) => setScenario((current) => ({ ...current, selectedLayer: layer }))
  const onConfirmStructuralPlan = () => { commit(confirmStructuralPlan(scenario)); setSheet(null) }

  const stressMode = scenario.stressEvents.length > 0

  const undo = () => {
    const previous = past.at(-1)
    if (!previous) return
    setFuture((items) => [scenario, ...items])
    setScenario(previous)
    setPast((items) => items.slice(0, -1))
  }
  const redo = () => {
    const next = future.at(0)
    if (!next) return
    setPast((items) => [...items, scenario])
    setScenario(next)
    setFuture((items) => items.slice(1))
  }

  return (
    <div className="sim-shell">
      <HorizonHeader result={result} previous={previousResult} canUndo={past.length > 0} canRedo={future.length > 0} onUndo={undo} onRedo={redo} />
      <main className="sim-main">
        <LifeScene result={result} onLayerChange={onLayer} showCost />
        <div className="sim-workbench">
          <DecisionDeck result={result} config={config} onPathChange={onPathChange} onAction={onAction} onOpenRoof={() => setSheet('roof')} />
          <ContextPanel
            result={result}
            onContinue={() => onAction('advance-time')}
            onProtectReserve={() => onAction('protect-reserve')}
            onCompare={() => setSheet('comparison')}
            onExplain={() => setSheet('insight')}
          />
        </div>
        <LifeTimeline result={result} stressMode={stressMode} onSelect={onTimeline} onOpenDetail={() => setSheet('timeline')} onOpenStress={() => setSheet('stress')} />
      </main>
      <DetailSheet
        sheet={sheet}
        result={result}
        config={config}
        onClose={() => setSheet(null)}
        onStress={onStress}
        onRoof={onRoof}
        onConfirmStructuralPlan={onConfirmStructuralPlan}
      />
    </div>
  )
}
