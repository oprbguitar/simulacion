import { useMemo, useRef, useState } from 'react'
import { Icon } from '../components/Icon'
import { LifeScene } from '../components/LifeScene'
import { cloneContentConfig, defaultContent, validateContentConfig } from '../domain/content'
import { clearStoredContent, loadStoredContent, saveStoredContent } from '../domain/configStorage'
import { createInitialScenario, selectHousingPath, simulateAction, simulateScenario } from '../domain/simulation'
import type { ActionId, ContentConfig, DataOrigin, HousingPathId, SimulationAssumptions } from '../domain/types'
import { StudioCharts } from './StudioCharts'

type NumericField = Exclude<keyof SimulationAssumptions, 'source'>
type InspectorTab = 'finances' | 'housing' | 'build' | 'source'
type MobileView = 'scenario' | 'results' | 'data'

const pathOptions: Array<{ id: HousingPathId; label: string; icon: 'family' | 'renting' | 'land' | 'none' }> = [
  { id: 'family', label: 'Familia', icon: 'family' }, { id: 'renting', label: 'Alquiler', icon: 'renting' }, { id: 'land', label: 'Terreno', icon: 'land' }, { id: 'none', label: 'Comparar', icon: 'none' },
]
const actionOptions: Array<{ id: ActionId; label: string }> = [
  { id: 'save-more', label: 'Ahorrar 6 meses' }, { id: 'buy-land', label: 'Comprar terreno' }, { id: 'rent-home', label: 'Alquilar vivienda' }, { id: 'build-first-floor', label: 'Construir primer piso' },
]
const inspectorTabs: Array<{ id: InspectorTab; label: string }> = [
  { id: 'finances', label: 'Finanzas' }, { id: 'housing', label: 'Vivienda' }, { id: 'build', label: 'Obra' }, { id: 'source', label: 'Fuente' },
]

function buildPreview(config: ContentConfig, path: HousingPathId, action: ActionId) {
  let state = selectHousingPath(createInitialScenario(config), path)
  if (action === 'build-first-floor' && state.sceneStage !== 'land') state = simulateAction(state, 'buy-land', config)
  return simulateScenario(simulateAction(state, action, config), config)
}

export function Studio() {
  const [config, setConfig] = useState(loadStoredContent)
  const [past, setPast] = useState<ContentConfig[]>([])
  const [future, setFuture] = useState<ContentConfig[]>([])
  const [status, setStatus] = useState('Supuestos locales sincronizados')
  const [path, setPath] = useState<HousingPathId>('family')
  const [action, setAction] = useState<ActionId>('buy-land')
  const [tab, setTab] = useState<InspectorTab>('finances')
  const [mobileView, setMobileView] = useState<MobileView>('results')
  const importRef = useRef<HTMLInputElement>(null)
  const preview = useMemo(() => buildPreview(config, path, action), [config, path, action])

  const update = (next: ContentConfig) => {
    setPast((items) => [...items, config])
    setConfig(next)
    setFuture([])
    setStatus(saveStoredContent(next) ? 'Guardado local · simulador actualizado' : 'Cambio aplicado · no se pudo guardar')
  }
  const updateAssumption = (field: NumericField, value: string) => {
    const numeric = Number(value)
    if (!Number.isFinite(numeric) || numeric < 0) return
    update({ ...config, assumptions: { ...config.assumptions, [field]: numeric } })
  }
  const updateSource = (field: 'sourceName' | 'note', value: string) => update({ ...config, assumptions: { ...config.assumptions, source: { ...config.assumptions.source, [field]: value } } })
  const updateOrigin = (origin: DataOrigin) => update({ ...config, assumptions: { ...config.assumptions, source: { ...config.assumptions.source, origin } } })
  const moveStage = (index: number, delta: -1 | 1) => {
    const target = index + delta
    if (target < 0 || target >= config.constructionStages.length) return
    const stages = [...config.constructionStages]
    ;[stages[index], stages[target]] = [stages[target], stages[index]]
    update({ ...config, constructionStages: stages })
  }
  const undo = () => {
    const previous = past.at(-1)
    if (!previous) return
    setFuture((items) => [config, ...items]); setConfig(previous); saveStoredContent(previous); setPast((items) => items.slice(0, -1)); setStatus('Deshacer aplicado y guardado')
  }
  const redo = () => {
    const next = future.at(0)
    if (!next) return
    setPast((items) => [...items, config]); setConfig(next); saveStoredContent(next); setFuture((items) => items.slice(1)); setStatus('Rehacer aplicado y guardado')
  }
  const reset = () => {
    setPast((items) => [...items, config]); setConfig(cloneContentConfig(defaultContent)); setFuture([]); clearStoredContent(); setStatus('Valores iniciales restaurados')
  }
  const exportJson = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'horizonte-content-v1.json'; anchor.click(); URL.revokeObjectURL(url); setStatus('JSON exportado')
  }
  const importJson = async (file: File) => {
    try {
      const checked = validateContentConfig(JSON.parse(await file.text()) as unknown)
      if (!checked.success) { setStatus(`Importación rechazada: ${checked.error}`); return }
      update(cloneContentConfig(checked.data)); setStatus('JSON importado, validado y guardado')
    } catch { setStatus('Importación rechazada: JSON inválido') }
  }

  return (
    <main className="studio-v2" data-mobile-view={mobileView}>
      <header className="sv-header">
        <a href="/" className="sv-brand"><strong>HORIZONTE</strong><span>STUDIO</span></a>
        <div className="sv-status"><i />{status}</div>
        <div className="sv-history"><button onClick={undo} disabled={!past.length} aria-label="Deshacer cambio"><Icon name="undo" /></button><button onClick={redo} disabled={!future.length} aria-label="Rehacer cambio"><Icon name="redo" /></button><a href="/_legacy">Ver simulador <Icon name="arrow-right" /></a></div>
      </header>
      <nav className="sv-mobile-tabs" aria-label="Superficie del Studio">
        {(['scenario', 'results', 'data'] as MobileView[]).map((view) => <button key={view} onClick={() => setMobileView(view)} aria-pressed={mobileView === view}>{view === 'scenario' ? 'Escenario' : view === 'results' ? 'Resultados' : 'Datos'}</button>)}
      </nav>
      <div className="sv-layout">
        <aside className="sv-scenarios" aria-labelledby="scenario-title">
          <div className="sv-section-title"><span>01</span><div><h1 id="scenario-title">Escenario</h1><p>Define la ruta que quieres probar.</p></div></div>
          <fieldset><legend>Punto de partida</legend><div className="sv-paths">{pathOptions.map((item) => <button type="button" key={item.id} className={path === item.id ? 'is-selected' : ''} onClick={() => setPath(item.id)} aria-pressed={path === item.id}><Icon name={item.icon} /><span>{item.label}</span></button>)}</div></fieldset>
          <fieldset><legend>Siguiente decisión</legend><div className="sv-actions">{actionOptions.map((item) => <button type="button" key={item.id} className={action === item.id ? 'is-selected' : ''} onClick={() => setAction(item.id)} aria-pressed={action === item.id}><span>{item.label}</span><Icon name="chevron-right" /></button>)}</div></fieldset>
          <div className="sv-caveat"><Icon name="info" /><p>Escenario educativo. No es cotización ni cálculo estructural.</p></div>
        </aside>

        <section className="sv-results" aria-labelledby="results-title">
          <div className="sv-results-head"><div><span>PREVIEW VIVO</span><h2 id="results-title">{preview.sceneLabel}</h2></div><dl><div><dt>Ahorro</dt><dd>S/ {preview.state.liquidSavings.toLocaleString('es-PE')}</dd></div><div><dt>Patrimonio</dt><dd>S/ {preview.patrimony.toLocaleString('es-PE')}</dd></div><div><dt>Reserva</dt><dd>{preview.reserveMonths.toFixed(1)} meses</dd></div></dl></div>
          <div className="sv-preview"><LifeScene result={preview} onLayerChange={() => undefined} /></div>
          <StudioCharts result={preview} />
        </section>

        <aside className="sv-inspector" aria-labelledby="data-title">
          <div className="sv-section-title"><span>02</span><div><h2 id="data-title">Datos para simular</h2><p>Valores locales y editables.</p></div></div>
          <div className="sv-inspector-tabs" role="tablist" aria-label="Grupos de supuestos">{inspectorTabs.map((item) => <button role="tab" key={item.id} aria-selected={tab === item.id} onClick={() => setTab(item.id)}>{item.label}</button>)}</div>
          <div className="sv-fields" role="tabpanel">
            {tab === 'finances' ? <><Field label="Ahorro inicial" value={config.assumptions.initialSavings} onChange={(v) => updateAssumption('initialSavings', v)} /><Field label="Ingreso mensual" value={config.assumptions.monthlyIncome} onChange={(v) => updateAssumption('monthlyIncome', v)} /><Field label="Gasto esencial" value={config.assumptions.essentialMonthlySpend} onChange={(v) => updateAssumption('essentialMonthlySpend', v)} /><Field label="Deuda mensual" value={config.assumptions.debtMonthly} onChange={(v) => updateAssumption('debtMonthly', v)} /><Field label="Ahorro extra mensual" value={config.assumptions.monthlySavingBoost} onChange={(v) => updateAssumption('monthlySavingBoost', v)} /></> : null}
            {tab === 'housing' ? <><Field label="Alquiler mensual" value={config.assumptions.rentMonthly} onChange={(v) => updateAssumption('rentMonthly', v)} /><Field label="Costo viviendo con familia" value={config.assumptions.familyHousingCost} onChange={(v) => updateAssumption('familyHousingCost', v)} /><Field label="Precio del terreno" value={config.assumptions.landPurchaseCost} onChange={(v) => updateAssumption('landPurchaseCost', v)} /><Field label="Valor patrimonial terreno" value={config.assumptions.landAssetValue} onChange={(v) => updateAssumption('landAssetValue', v)} /><Field label="Mantenimiento mensual" value={config.assumptions.maintenanceMonthly} onChange={(v) => updateAssumption('maintenanceMonthly', v)} /></> : null}
            {tab === 'build' ? <><Field label="Inicial de construcción" value={config.assumptions.constructionInitialPayment} onChange={(v) => updateAssumption('constructionInitialPayment', v)} /><Field label="Valor de la construcción" value={config.assumptions.constructionAssetValue} onChange={(v) => updateAssumption('constructionAssetValue', v)} /><Field label="Cuota mensual de obra" value={config.assumptions.constructionMonthlyCost} onChange={(v) => updateAssumption('constructionMonthlyCost', v)} /><FactorField label="Factor económico" value={config.assumptions.costRangeLowFactor} onChange={(v) => updateAssumption('costRangeLowFactor', v)} /><FactorField label="Factor conservador" value={config.assumptions.costRangeHighFactor} onChange={(v) => updateAssumption('costRangeHighFactor', v)} /><StageRail stages={config.constructionStages} onMove={moveStage} /></> : null}
            {tab === 'source' ? <><label className="sv-field"><span>Tipo de fuente</span><select value={config.assumptions.source.origin} onChange={(e) => updateOrigin(e.target.value as DataOrigin)}><option value="SEEDED_REFERENCE">Referencia inicial</option><option value="MOCK">Dato de prueba</option><option value="REAL">Dato real ingresado</option></select></label><label className="sv-field"><span>Nombre de la fuente</span><input value={config.assumptions.source.sourceName} onChange={(e) => updateSource('sourceName', e.target.value)} /></label><label className="sv-field sv-field-wide"><span>Nota y alcance</span><textarea rows={3} value={config.assumptions.source.note} onChange={(e) => updateSource('note', e.target.value)} /></label><div className="sv-source-rule"><Icon name="shield" /><p>Toda cifra externa debe guardar fuente, fecha, ubicación, unidad y confianza. Este prototipo conserva una fuente común para sus supuestos.</p></div></> : null}
            <div className="sv-live-impact"><span>IMPACTO DEL ESCENARIO</span><dl><div><dt>Liquidez final</dt><dd>S/ {preview.state.liquidSavings.toLocaleString('es-PE')}</dd></div><div><dt>Flujo libre</dt><dd>S/ {preview.monthlyCashflow.toLocaleString('es-PE')}</dd></div><div><dt>Costo probable</dt><dd>S/ {preview.costRange.expected.toLocaleString('es-PE')}</dd></div></dl><p>Cada cambio se guarda localmente y alimenta el simulador principal.</p></div>
          </div>
          <div className="sv-file-actions"><button onClick={reset}><Icon name="rotate" />Restablecer</button><button onClick={exportJson}><Icon name="arrow-right" />Exportar</button><button onClick={() => importRef.current?.click()}><Icon name="layers" />Importar</button><input ref={importRef} className="visually-hidden" type="file" accept="application/json" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importJson(file) }} /></div>
        </aside>
      </div>
    </main>
  )
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (value: string) => void }) {
  return <label className="sv-field"><span>{label}</span><span className="sv-input"><i>S/</i><input aria-label={label} type="number" min="0" step="100" value={value} onChange={(event) => onChange(event.target.value)} /></span></label>
}

function FactorField({ label, value, onChange }: { label: string; value: number; onChange: (value: string) => void }) {
  return <label className="sv-field"><span>{label}</span><span className="sv-input"><i>×</i><input aria-label={label} type="number" min="0" step="0.05" value={value} onChange={(event) => onChange(event.target.value)} /></span></label>
}

function StageRail({ stages, onMove }: { stages: ContentConfig['constructionStages']; onMove: (index: number, delta: -1 | 1) => void }) {
  return <div className="sv-stage-rail"><strong>Orden de etapas</strong><div>{stages.map((stage, index) => <span key={stage.id}><small>{String(index + 1).padStart(2, '0')}</small>{stage.shortLabel}<button onClick={() => onMove(index, -1)} disabled={index === 0} aria-label={`Mover ${stage.label} a la izquierda`}><Icon name="chevron-left" /></button><button onClick={() => onMove(index, 1)} disabled={index === stages.length - 1} aria-label={`Mover ${stage.label} a la derecha`}><Icon name="chevron-right" /></button></span>)}</div></div>
}
