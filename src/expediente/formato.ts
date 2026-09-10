/** Formato de moneda del expediente. Vive aparte de las piezas para que el
 *  módulo de componentes solo exporte componentes. */

export const soles = (valor: number): string => `S/ ${Math.round(valor).toLocaleString('es-PE')}`

export const solesCorto = (valor: number): string => {
  const abs = Math.abs(valor)
  if (abs >= 1_000_000) return `S/ ${(valor / 1_000_000).toFixed(1)} M`
  if (abs >= 10_000) return `S/ ${Math.round(valor / 1000)} k`
  return soles(valor)
}
