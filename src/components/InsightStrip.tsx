import { useState } from 'react'
import type { InsightMessage } from '../domain/types'
import { Icon } from './Icon'
import { OriginBadge } from './OriginBadge'

export function InsightStrip({ insights }: { insights: InsightMessage[] }) {
  const [open, setOpen] = useState(false)
  const active = insights.find((insight) => insight.active) ?? insights.at(0)
  if (!active) return null
  return (
    <section className="insight-panel" aria-labelledby="insight-title">
      <div className="insight-icon"><Icon name="lightbulb" size={25} /></div>
      <div className="insight-content"><div className="insight-title-row"><span className="eyebrow">Regla contextual</span><OriginBadge origin={active.origin} /><code>{active.ruleId}</code></div><h2 id="insight-title">¿Has pensado en esto?</h2><p className="insight-message">{active.message}</p>{open && <div className="insight-detail"><p>{active.detail}</p><ul>{active.suggestions.map((suggestion) => <li key={suggestion}>{suggestion}</li>)}</ul></div>}</div>
      <button className="text-button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>{open ? 'Ocultar detalle' : 'Ver por qué'} <Icon name={open ? 'chevron-down' : 'arrow-right'} size={17} /></button>
    </section>
  )
}
