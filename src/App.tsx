import { useMemo, useState, type Dispatch, type SetStateAction } from 'react'
import { ChoiceRail } from './components/ChoiceRail'
import { ComparisonStrip } from './components/ComparisonStrip'
import { HouseScene } from './components/HouseScene'
import { Icon } from './components/Icon'
import { Hud } from './components/Hud'
import { InsightStrip } from './components/InsightStrip'
import { OriginBadge } from './components/OriginBadge'
import { StressTester } from './components/StressTester'
import { Timeline } from './components/Timeline'
import { cloneContentConfig, defaultContent } from './domain/content'
import { compareScenarios, createInitialScenario, selectHousingPath, simulateAction, simulateScenario, toggleStressEvent } from './domain/simulation'
import type { ActionId, HousingPathId, LayerId, ScenarioState, StressEventId } from './domain/types'

function commitState(next: ScenarioState, current: ScenarioState, setCurrent: (value: ScenarioState) => void, setPast: Dispatch<SetStateAction<ScenarioState[]>>, setFuture: Dispatch<SetStateAction<ScenarioState[]>>) {
  setPast((items) => [...items, current])
  setCurrent(next)
  setFuture([])
}

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 48 32" width="42" height="30"><path d="m2 26 14-18 9 9L35 2l11 24z" fill="#2f9e44" /><path d="m10 26 9-11 7 7 6-11 7 15z" fill="#1971c2" /></svg></span>
}

export function App() {
  const [config] = useState(() => cloneContentConfig(defaultContent))
  const [scenario, setScenario] = useState(() => createInitialScenario(defaultContent))
  const [past, setPast] = useState<ScenarioState[]>([])
  const [future, setFuture] = useState<ScenarioState[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const result = useMemo(() => simulateScenario(scenario, config), [scenario, config])
  const comparisons = useMemo(() => compareScenarios(scenario, config), [scenario, config])

  const commit = (next: ScenarioState) => commitState(next, scenario, setScenario, setPast, setFuture)
  const handlePathChange = (path: HousingPathId) => commit(selectHousingPath(scenario, path))
  const handleAction = (action: ActionId) => commit(simulateAction(scenario, action, config))
  const handleStress = (id: StressEventId) => commit(toggleStressEvent(scenario, id, config))
  const handleTimeline = (id: string) => setScenario((current) => ({ ...current, activeTimelineId: id }))
  const handleLayer = (layer: LayerId) => setScenario((current) => ({ ...current, selectedLayer: layer }))
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
    <main className="app-shell">
      <header className="topbar">
        <a href="/" className="brand" aria-label="Horizonte, volver al simulador"><BrandMark /><span><strong>{config.productName}</strong><small>Simulador de vida y vivienda</small></span></a>
        <div className="topbar-context"><span className="context-dot" /> Proyecto local <OriginBadge origin="MOCK" /></div>
        <a href="/_studio" className="studio-link"><Icon name="settings" size={16} /> Editar supuestos</a>
      </header>
      <Hud result={result} onUndo={undo} onRedo={redo} canUndo={past.length > 0} canRedo={future.length > 0} />
      <section className="intro-band"><div className="intro-copy"><h1>Tu siguiente paso <em>se puede explorar.</em></h1><p>Elige una imagen, prueba una decisión y observa cómo cambian tu hogar, tu dinero y tu tiempo.</p></div><div className="intro-note"><Icon name="info" size={18} /><span>Los montos son referenciales del prototipo. No son una predicción ni una cotización.</span></div></section>
      <section className="play-band">
        <div className="play-grid"><HouseScene result={result} onLayerChange={handleLayer} /><ChoiceRail result={result} config={config} onPathChange={handlePathChange} onAction={handleAction} /></div>
      </section>
      <section className="timeline-band"><Timeline result={result} onSelect={handleTimeline} /></section>
      <section className="lower-band"><div className="lower-grid"><InsightStrip insights={result.insights} /><StressTester config={config} state={scenario} onToggle={handleStress} /></div><div className="after-actions"><span><Icon name="shield" size={16} /> Tu escenario se mantiene en este dispositivo.</span><div><button className="quiet-button" onClick={() => setShowCompare((value) => !value)} aria-expanded={showCompare}><Icon name="layers" size={16} /> {showCompare ? 'Ocultar alternativas' : 'Comparar alternativas'}</button><button className="primary-button" onClick={() => handleAction('save-more')}><span>Seguir con la ruta</span><Icon name="arrow-right" size={18} /></button></div></div></section>
      {showCompare && <section className="comparison-band"><ComparisonStrip scenarios={comparisons} /></section>}
      <footer className="footer"><span><BrandMark /> Horizonte · prototipo educativo</span><span><OriginBadge origin="SEEDED_REFERENCE" /> Supuestos editables · Fase 0/1</span></footer>
    </main>
  )
}
