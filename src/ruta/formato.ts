/** Formato de moneda de «La Ruta». Vive aparte para que el módulo de piezas
 *  solo exporte componentes. */

export const plata = (valor: number): string => `S/ ${Math.round(valor).toLocaleString('es-PE')}`

export const plataCorta = (valor: number): string => {
  const abs = Math.abs(valor)
  const signo = valor < 0 ? '−' : ''
  if (abs >= 1_000_000) return `${signo}S/ ${(abs / 1_000_000).toFixed(1)}M`
  if (abs >= 1000) return `${signo}S/ ${Math.round(abs / 1000)}k`
  return `${signo}S/ ${Math.round(abs)}`
}
