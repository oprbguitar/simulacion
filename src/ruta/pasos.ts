/**
 * Las pantallas de «La Ruta», en orden. La navegación es horizontal: una
 * pantalla a la vez, con flechas a los costados y la línea de tiempo arriba.
 * `decision` marca las pantallas donde se elige algo; las demás se dan por
 * hechas cuando se pasa por ellas.
 */
export const PASOS = [
  { id: 'inicio', numero: '00', titulo: 'Inicio', decision: false },
  { id: 'partida', numero: '01', titulo: 'Partida', decision: true },
  { id: 'terreno', numero: '02', titulo: 'Vivienda', decision: true },
  { id: 'obra', numero: '03', titulo: 'Obra', decision: true },
  { id: 'familia', numero: '04', titulo: 'Familia', decision: true },
  { id: 'servicios', numero: '05', titulo: 'Servicios', decision: false },
  { id: 'trabajo', numero: '06', titulo: 'Trabajo', decision: true },
  { id: 'cartas', numero: '07', titulo: 'Imprevistos', decision: true },
  { id: 'mapa', numero: '08', titulo: 'Tu ruta', decision: false },
  { id: 'cierre', numero: '09', titulo: 'Final', decision: false },
] as const

export type PasoId = (typeof PASOS)[number]['id']
