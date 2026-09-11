import { proyectar, type Perfil } from '../domain/life/motor'
import type { RutaViviendaId } from '../domain/life/catalogo/vivienda'

/**
 * Modos de juego. Cada uno completa de golpe todas las decisiones del tablero
 * respetando el punto de partida (edad, ingreso, ahorro, región, hijos).
 *
 * - Relajado: lo mínimo indispensable, sin deuda y a lo que venga.
 * - Equilibrado: un término medio razonable en cada decisión.
 * - Pro: no es un preset. Prueba las combinaciones que terminan con casa
 *   propia y se queda con la que deja más patrimonio sin alertas críticas.
 */
export type ModoId = 'relajado' | 'equilibrado' | 'pro'

export const MODOS: { id: ModoId; titulo: string; bajada: string }[] = [
  { id: 'relajado', titulo: 'Relajado', bajada: 'Lo mínimo: alquilas, sin deuda y a lo que venga' },
  { id: 'equilibrado', titulo: 'Equilibrado', bajada: 'Un término medio razonable en cada decisión' },
  { id: 'pro', titulo: 'Pro', bajada: 'Busca el plan que deja más patrimonio sin quedarte sin fondos' },
]

const RELAJADO: Partial<Perfil> = {
  rutaVivienda: 'alquiler',
  financiamiento: 'ahorro',
  nivelAcabado: 'basico',
  areaTechada: 40,
  pisos: 1,
  duracionObraAnios: 15,
  imprevistosActivos: [],
}

const EQUILIBRADO: Partial<Perfil> = {
  rutaVivienda: 'terreno',
  financiamiento: 'mivivienda',
  inicialProporcion: 0.1,
  plazoCreditoAnios: 20,
  nivelAcabado: 'medio',
  areaTechada: 60,
  pisos: 1,
  anioCompra: 4,
  anioInicioObra: 6,
  duracionObraAnios: 10,
  imprevistosActivos: [],
}

/** Rutas que terminan con un bien a tu nombre: el modo Pro no se conforma con menos. */
const RUTAS_CON_PATRIMONIO: RutaViviendaId[] = ['terreno', 'casa-construida', 'departamento']

export function mejorPlan(base: Perfil): Partial<Perfil> {
  let mejor: Partial<Perfil> = EQUILIBRADO
  let mejorPuntaje = -Infinity

  for (const rutaVivienda of RUTAS_CON_PATRIMONIO) {
    for (const financiamiento of ['ahorro', 'mivivienda', 'hipotecario'] as const) {
      for (const nivelAcabado of ['basico', 'medio'] as const) {
        for (const anioCompra of [2, 5, 8]) {
          for (const duracionObraAnios of [6, 10, 14]) {
            const candidato: Partial<Perfil> = {
              rutaVivienda,
              financiamiento,
              nivelAcabado,
              anioCompra: Math.min(base.horizonteAnios - 1, anioCompra),
              anioInicioObra: Math.min(base.horizonteAnios - 1, anioCompra + 2),
              duracionObraAnios,
              inicialProporcion: 0.2,
              plazoCreditoAnios: 15,
              areaTechada: 60,
              pisos: 1,
              imprevistosActivos: [],
            }
            const proyeccion = proyectar({ ...base, ...candidato })
            const criticas = proyeccion.alertas.filter((a) => a.severidad === 'critica').length
            const patrimonio = proyeccion.anios.at(-1)?.patrimonio ?? 0
            // Una alerta crítica pesa más que cualquier diferencia de patrimonio.
            const puntaje = patrimonio - criticas * 1e12
            if (puntaje > mejorPuntaje) {
              mejorPuntaje = puntaje
              mejor = candidato
            }
          }
        }
      }
    }
  }
  return mejor
}

export function aplicarModo(modo: ModoId, base: Perfil): Partial<Perfil> {
  if (modo === 'relajado') return RELAJADO
  if (modo === 'equilibrado') return EQUILIBRADO
  return mejorPlan(base)
}
