import { execFileSync } from 'node:child_process'

const highImpactPrefixes = ['src/', 'data/', 'supabase/', 'functions/', 'workers/', 'scripts/']
const docPrefixes = ['docs/', 'README.md', 'DESIGN.md', 'CHANGELOG.md']

let changedFiles = []
try {
  execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
  const diffTarget = process.env.GITHUB_ACTIONS === 'true' ? ['HEAD^', 'HEAD'] : ['HEAD']
  const output = execFileSync('git', ['diff', '--name-only', ...diffTarget], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
  changedFiles = output.split(/\r?\n/).map((file) => file.trim()).filter(Boolean)
} catch {
  console.warn('[docs:check] Git no disponible: se omite la comprobación de impacto documental.')
  process.exit(0)
}

const impacted = changedFiles.filter((file) => highImpactPrefixes.some((prefix) => file.startsWith(prefix)))
const documented = changedFiles.some((file) => docPrefixes.some((prefix) => file === prefix || file.startsWith(prefix)))

if (impacted.length > 0 && !documented) {
  console.warn('[docs:check] ADVERTENCIA: cambiaron rutas de alto impacto sin cambios documentales:')
  impacted.forEach((file) => console.warn(`  - ${file}`))
  console.warn('[docs:check] Revisa docs/, README.md, DESIGN.md o CHANGELOG.md antes de publicar.')
}

console.log(`[docs:check] ${changedFiles.length} archivos cambiados; ${impacted.length} de alto impacto; documentación ${documented ? 'actualizada' : 'no detectada'}.`)
