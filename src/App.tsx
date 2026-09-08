import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { DecisionDeck } from './components/DecisionDeck'
import { HorizonHeader } from './components/HorizonHeader'
import { LifeScene } from './components/LifeScene'
import { LifeTimeline } from './components/LifeTimeline'
import { ResiliencePanel } from './components/ResiliencePanel'
import { loadStoredContent } from './domain/configStorage'
import { createInitialScenario, selectHousingPath, simulateAction, simulateScenario, toggleStressEvent } from './domain/simulation'
import type { ActionId, HousingPathId, LayerId, ScenarioState, StressEventId } from './domain/types'

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
  const result = useMemo(() => simulateScenario(scenario, config), [scenario, config])
  const commit = (next: ScenarioState) => commitState(next, scenario, setScenario, setPast, setFuture)
  const onPathChange = (path: HousingPathId) => commit(selectHousingPath(scenario, path))
  const onAction = (action: ActionId) => commit(simulateAction(scenario, action, config))
  const onStress = (id: StressEventId) => commit(toggleStressEvent(scenario, id, config))
  const onTimeline = (id: string) => setScenario((current) => ({ ...current, activeTimelineId: id }))
  const onLayer = (layer: LayerId) => setScenario((current) => ({ ...current, selectedLayer: layer }))
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
      <HorizonHeader result={result} canUndo={past.length > 0} canRedo={future.length > 0} onUndo={undo} onRedo={redo} />
      <main className="sim-main">
        <LifeScene result={result} onLayerChange={onLayer} />
        <div className="sim-workbench">
          <DecisionDeck result={result} config={config} onPathChange={onPathChange} onAction={onAction} />
          <ResiliencePanel result={result} config={config} onStress={onStress} />
        </div>
        <LifeTimeline result={result} onSelect={onTimeline} />
      </main>
    </div>
  )
}
