import { useMemo, useRef, useState } from 'react'
import { HouseScene } from '../components/HouseScene'
import { Icon } from '../components/Icon'
import { OriginBadge } from '../components/OriginBadge'
import { cloneContentConfig, defaultContent, validateContentConfig } from '../domain/content'
import { createInitialScenario, selectHousingPath, simulateAction, simulateScenario } from '../domain/simulation'
import type { ContentConfig, DataOrigin } from '../domain/types'

type NumericField = 'initialSavings' | 'monthlyIncome' | 'essentialMonthlySpend' | 'rentMonthly'

export function Studio() {
  const [config, setConfig] = useState<ContentConfig>(() => cloneContentConfig(defaultContent))
  const [past, setPast] = useState<ContentConfig[]>([])
  const [future, setFuture] = useState<ContentConfig[]>([])
  const [status, setStatus] = useState('Borrador local listo')
  const importRef = useRef<HTMLInputElement>(null)
  const preview = useMemo(() => {
    const initial = selectHousingPath(createInitialScenario(config), 'family')
    return simulateScenario(simulateAction(initial, 'buy-land', config), config)
  }, [config])

  const update = (next: ContentConfig) => {
    setPast((items) => [...items, config])
    setConfig(next)
    setFuture([])
    setStatus('Cambios sin publicar · solo este dispositivo')
  }
  const updateAssumption = (field: NumericField, value: string) => {
    const numeric = Number(value)
    if (!Number.isFinite(numeric) || numeric < 0) return
    update({ ...config, assumptions: { ...config.assumptions, [field]: numeric } })
  }
  const updateInsight = (message: string) => {
    const first = config.insights.at(0)
    if (!first) return
    update({ ...config, insights: [{ ...first, message }, ...config.insights.slice(1)] })
  }
  const updateOrigin = (origin: DataOrigin) => update({ ...config, assumptions: { ...config.assumptions, source: { ...config.assumptions.source, origin } } })
  const moveStage = (index: number, delta: -1 | 1) => {
    const target = index + delta
    if (target < 0 || target >= config.constructionStages.length) return
    const stages = [...config.constructionStages]
    const current = stages.at(index)
    const replacement = stages.at(target)
    if (!current || !replacement) return
    stages[index] = replacement
    stages[target] = current
    update({ ...config, constructionStages: stages })
  }
  const undo = () => {
    const previous = past.at(-1)
    if (!previous) return
    setFuture((items) => [config, ...items])
    setConfig(previous)
    setPast((items) => items.slice(0, -1))
    setStatus('Deshacer aplicado')
  }
  const redo = () => {
    const next = future.at(0)
    if (!next) return
    setPast((items) => [...items, config])
    setConfig(next)
    setFuture((items) => items.slice(1))
    setStatus('Rehacer aplicado')
  }
  const reset = () => { setPast((items) => [...items, config]); setConfig(cloneContentConfig(defaultContent)); setFuture([]); setStatus('Se restauraron los valores iniciales') }
  const exportJson = () => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'horizonte-content-v1.json'
    anchor.click()
    URL.revokeObjectURL(url)
    setStatus('JSON exportado')
  }
  const importJson = async (file: File) => {
    try {
      const parsed: unknown = JSON.parse(await file.text())
      const checked = validateContentConfig(parsed)
      if (!checked.success) { setStatus(`Importación rechazada: ${checked.error}`); return }
      update(cloneContentConfig(checked.data))
      setStatus('JSON importado y validado')
    } catch { setStatus('Importación rechazada: el archivo no es JSON válido') }
  }

  return <main className="studio-shell"><header className="studio-topbar"><a href="/" className="brand"><span className="brand-mark"><Icon name="sprout" size={24} /></span><span><strong>Horizonte Studio</strong><small>Contenido y supuestos locales</small></span></a><div className="studio-top-actions"><span className="studio-status"><span className="status-pulse" /> {status}</span><button className="icon-button" onClick={undo} disabled={!past.length} aria-label="Deshacer cambio"><Icon name="undo" size={17} /></button><button className="icon-button" onClick={redo} disabled={!future.length} aria-label="Rehacer cambio"><Icon name="redo" size={17} /></button><a href="/" className="quiet-button">Volver al simulador</a></div></header><div className="studio-grid"><aside className="studio-nav"><span className="eyebrow">Colección local</span><h1>Editar el mundo</h1><nav aria-label="Secciones del studio"><a className="studio-nav-link is-active" href="#preview"><Icon name="home" size={17} /> Escena y preview</a><a className="studio-nav-link" href="#assumptions"><Icon name="wallet" size={17} /> Supuestos</a><a className="studio-nav-link" href="#timeline-editor"><Icon name="calendar" size={17} /> Timeline</a><a className="studio-nav-link" href="#insight-editor"><Icon name="lightbulb" size={17} /> Insights</a></nav><div className="studio-safety"><Icon name="shield" size={18} /><strong>Solo local</strong><p>No es una barrera de seguridad. Antes de publicar, protege o desactiva esta ruta.</p></div></aside><section className="studio-preview" id="preview"><div className="studio-section-heading"><div><span className="eyebrow">Preview vivo</span><h2>Así se verá tu ruta</h2></div><OriginBadge origin={config.assumptions.source.origin} /></div><HouseScene result={preview} onLayerChange={() => undefined} /></section><aside className="studio-inspector"><section id="assumptions" className="inspector-section"><div className="inspector-heading"><span className="eyebrow">01 · Datos de partida</span><Icon name="wallet" size={18} /></div><Field label="Ahorro inicial" value={config.assumptions.initialSavings} onChange={(value) => updateAssumption('initialSavings', value)} /><Field label="Ingreso mensual" value={config.assumptions.monthlyIncome} onChange={(value) => updateAssumption('monthlyIncome', value)} /><Field label="Gasto esencial mensual" value={config.assumptions.essentialMonthlySpend} onChange={(value) => updateAssumption('essentialMonthlySpend', value)} /><Field label="Alquiler mensual" value={config.assumptions.rentMonthly} onChange={(value) => updateAssumption('rentMonthly', value)} /><label className="field-label" htmlFor="origin-select">Origen de estos supuestos</label><select id="origin-select" value={config.assumptions.source.origin} onChange={(event) => updateOrigin(event.target.value as DataOrigin)}><option value="SEEDED_REFERENCE">SEEDED_REFERENCE</option><option value="MOCK">MOCK</option><option value="REAL">REAL</option></select><p className="field-help">{config.assumptions.source.note}</p></section><section id="timeline-editor" className="inspector-section"><div className="inspector-heading"><span className="eyebrow">02 · Orden de etapas</span><Icon name="layers" size={18} /></div><ol className="stage-editor">{config.constructionStages.map((stage, index) => <li key={stage.id}><span>{String(index + 1).padStart(2, '0')}</span><strong>{stage.shortLabel}</strong><button className="mini-button" onClick={() => moveStage(index, -1)} disabled={index === 0} aria-label={`Subir ${stage.label}`}><Icon name="chevron-left" size={14} /></button><button className="mini-button" onClick={() => moveStage(index, 1)} disabled={index === 0 ? false : index === config.constructionStages.length - 1} aria-label={`Bajar ${stage.label}`}><Icon name="chevron-right" size={14} /></button></li>)}</ol></section><section id="insight-editor" className="inspector-section"><div className="inspector-heading"><span className="eyebrow">03 · Mensaje contextual</span><Icon name="lightbulb" size={18} /></div><label className="field-label" htmlFor="insight-message">Mensaje de la primera regla</label><textarea id="insight-message" value={config.insights.at(0)?.message ?? ''} onChange={(event) => updateInsight(event.target.value)} rows={4} /><p className="field-help">La regla y el cálculo se mantienen en el motor; aquí se edita el texto.</p></section><div className="studio-actions"><button className="quiet-button" onClick={reset}><Icon name="rotate" size={16} /> Restablecer</button><button className="quiet-button" onClick={exportJson}><Icon name="arrow-right" size={16} /> Exportar JSON</button><button className="quiet-button" onClick={() => importRef.current?.click()}><Icon name="layers" size={16} /> Importar JSON</button><input ref={importRef} className="visually-hidden" type="file" accept="application/json" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importJson(file) }} /></div></aside></div></main>
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (value: string) => void }) {
  return <label className="field"><span className="field-label">{label}</span><span className="field-input-wrap"><span>S/</span><input aria-label={label} inputMode="numeric" type="number" min="0" value={value} onChange={(event) => onChange(event.target.value)} /><output className="field-value-preview">S/ {value.toLocaleString('es-PE')}</output></span></label>
}
