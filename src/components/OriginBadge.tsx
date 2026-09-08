import type { DataOrigin } from '../domain/types'

export function OriginBadge({ origin }: { origin: DataOrigin }) {
  return <span className={`origin-badge origin-${origin.toLowerCase()}`}>{origin}</span>
}
