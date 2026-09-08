import type { ScenarioResult } from '../domain/types'
import { Icon } from './Icon'

const money = (value: number) => `S/ ${Math.round(value).toLocaleString('es-PE')}`

export function HorizonHeader({ result, canUndo, canRedo, onUndo, onRedo }: { result: ScenarioResult; canUndo: boolean; canRedo: boolean; onUndo: () => void; onRedo: () => void }) {
  const year = Math.floor(result.state.currentMonth / 12) + 1
  const month = (result.state.currentMonth % 12) + 1
  return (
    <header className="sim-header">
      <a className="sim-brand" href="/" aria-label="Horizonte, simulador de vida y vivienda">
        <strong>HORIZONTE</strong><span>Simulador de vida y vivienda</span>
      </a>
      <div className="sim-metrics" aria-label="Resumen de la simulación">
        <div className="sim-metric"><Icon name="calendar" /><span><small>Periodo</small><strong>Año {year} · Mes {month}</strong></span></div>
        <div className="sim-metric metric-savings"><Icon name="wallet" /><span><small>Ahorro</small><strong>{money(result.state.liquidSavings)}</strong></span></div>
        <div className="sim-metric"><Icon name="shield" /><span><small>Reserva</small><strong>{result.reserveMonths.toFixed(1)} meses</strong></span></div>
        <div className="sim-metric"><Icon name="home" /><span><small>Patrimonio simulado</small><strong>{money(result.patrimony)}</strong></span></div>
      </div>
      <nav className="sim-tools" aria-label="Herramientas">
        <button onClick={onUndo} disabled={!canUndo} aria-label="Deshacer último paso" title="Deshacer"><Icon name="undo" /></button>
        <button onClick={onRedo} disabled={!canRedo} aria-label="Rehacer último paso" title="Rehacer"><Icon name="redo" /></button>
        <a href="/_studio" aria-label="Editar supuestos" title="Editar supuestos"><Icon name="settings" /></a>
      </nav>
    </header>
  )
}
