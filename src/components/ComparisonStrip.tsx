import type { ComparisonResult } from '../domain/types'
import { Icon } from './Icon'
import { OriginBadge } from './OriginBadge'

function soles(value: number): string {
  return `S/ ${Math.round(value).toLocaleString('es-PE')}`
}

export function ComparisonStrip({ scenarios }: { scenarios: ComparisonResult[] }) {
  return <section className="comparison-panel" aria-labelledby="comparison-title"><div className="comparison-heading"><div><span className="eyebrow">Misma pregunta, otros caminos</span><h2 id="comparison-title">Comparar alternativas</h2></div><Icon name="layers" size={21} /></div><div className="comparison-table"><div className="comparison-header"><span>Camino</span><span>Costo mensual</span><span>Ahorro a 2 años</span><span>Patrimonio</span></div>{scenarios.map((scenario) => <div className="comparison-row" key={scenario.id}><strong>{scenario.label}</strong><span>{soles(scenario.monthlyCost)}</span><span>{soles(scenario.projectedSavings)}</span><span>{soles(scenario.projectedPatrimony)} <OriginBadge origin={scenario.origin} /></span></div>)}</div></section>
}
