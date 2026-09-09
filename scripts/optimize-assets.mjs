/**
 * Optimiza las ilustraciones de `public/assets`.
 *
 * Las fuentes originales viven en `assets-src/` (PNG grandes, tal como
 * salieron del generador). Este script produce los WebP que se publican.
 * La escena principal se sirve más ancha porque ocupa toda la banda; los
 * selectores nunca se muestran a más de ~150 px de ancho real.
 *
 *   node scripts/optimize-assets.mjs
 */
import { readdir, mkdir, stat } from 'node:fs/promises'
import { join, parse } from 'node:path'
import sharp from 'sharp'

const SOURCE = 'assets-src'
const TARGET = 'public/assets'

/** Ancho máximo publicado por archivo. Todo lo demás usa el valor por defecto. */
const widths = {
  'horizonte-life-scene-v1': 1920,
}
const DEFAULT_WIDTH = 420

const kb = (bytes) => `${(bytes / 1024).toFixed(0)} kB`

await mkdir(TARGET, { recursive: true })
const files = (await readdir(SOURCE)).filter((name) => /\.(png|jpe?g)$/i.test(name))

let before = 0
let after = 0

for (const file of files) {
  const { name } = parse(file)
  const from = join(SOURCE, file)
  const to = join(TARGET, `${name}.webp`)

  await sharp(from)
    .resize({ width: widths[name] ?? DEFAULT_WIDTH, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6 })
    .toFile(to)

  const sourceSize = (await stat(from)).size
  const targetSize = (await stat(to)).size
  before += sourceSize
  after += targetSize
  console.log(`${file.padEnd(34)} ${kb(sourceSize).padStart(9)} → ${kb(targetSize).padStart(8)}  ${name}.webp`)
}

console.log(`\nTotal ${kb(before)} → ${kb(after)} (${Math.round((1 - after / before) * 100)}% menos)`)
