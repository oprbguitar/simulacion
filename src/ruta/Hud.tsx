import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '../components/Icon'
import { AnimatedNumber, DeltaChip } from '../motion/primitives'
import { springs } from '../motion/tokens'
import type { Proyeccion } from '../domain/life/motor'
import { plataCorta } from './formato'
import { MODOS, type ModoId } from './modos'
import { PASOS, type PasoId } from './pasos'

/**
 * Barra de estado del tablero. Es el marcador del juego: siempre visible,
 * siempre reaccionando. Arriba, los números que importan y los modos de
 * juego; abajo, la línea de tiempo que se va sombreando con cada decisión.
 */
export function Hud({
  proyeccion,
  anterior,
  nombre,
  paso,
  hechos,
  onIr,
  modo,
  onModo,
  puedeDeshacer,
  onDeshacer,
  onReiniciar,
}: {
  proyeccion: Proyeccion
  anterior: Proyeccion | null
  nombre: string
  paso: number
  hechos: ReadonlySet<PasoId>
  onIr: (paso: number) => void
  modo: ModoId | null
  onModo: (modo: ModoId) => void
  puedeDeshacer: boolean
  onDeshacer: () => void
  onReiniciar: () => void
}) {
  const { perfil } = proyeccion
  const final = proyeccion.anios.at(-1)
  const sinFondos = proyeccion.anios.find((a) => a.ahorroAcumulado < 0)
  const finalAnterior = anterior?.anios.at(-1)

  const patrimonio = final?.patrimonio ?? 0
  const deltaPatrimonio = finalAnterior ? patrimonio - finalAnterior.patrimonio : 0
  const obra = proyeccion.costoObra.tipico
  const deltaObra = anterior ? obra - anterior.costoObra.tipico : 0

  return (
    <header className="rt-hud">
      <a className="rt-hud-marca" href="/">
        <span className="rt-hud-logo" aria-hidden="true">
          <Icon name="sprout" size={18} />
        </span>
        <span>
          <strong>La Ruta</strong>
          <small>{nombre ? `de ${nombre}` : 'Horizonte · Perú'}</small>
        </span>
      </a>

      <dl className="rt-hud-marcador">
        <div>
          <dt>Horizonte</dt>
          <dd>
            {perfil.horizonteAnios} años
            <em>hasta los {perfil.edadInicial + perfil.horizonteAnios}</em>
          </dd>
        </div>
        <div>
          <dt>Cuesta construir</dt>
          <dd className="rt-hud-cifra">
            <AnimatedNumber value={obra} format={plataCorta} />
            <AnimatePresence>{deltaObra !== 0 ? <DeltaChip key={obra} delta={-deltaObra} format={plataCorta} /> : null}</AnimatePresence>
          </dd>
        </div>
        <div>
          <dt>Patrimonio al final</dt>
          <dd className={patrimonio < 0 ? 'rt-hud-cifra es-malo' : 'rt-hud-cifra es-bueno'}>
            <AnimatedNumber value={patrimonio} format={plataCorta} />
            <AnimatePresence>{deltaPatrimonio !== 0 ? <DeltaChip key={patrimonio} delta={deltaPatrimonio} format={plataCorta} /> : null}</AnimatePresence>
          </dd>
        </div>
        <div className="rt-hud-alerta">
          <dt>Te quedas sin plata</dt>
          <dd className={sinFondos ? 'es-malo' : 'es-bueno'}>
            {sinFondos ? (
              <>
                Año {sinFondos.anio}
                <em>a los {sinFondos.edad}</em>
              </>
            ) : (
              <>
                Nunca
                <em>el plan aguanta</em>
              </>
            )}
          </dd>
        </div>
      </dl>

      <div className="rt-hud-modos" role="radiogroup" aria-label="Modo de juego: completa todas las fases de golpe">
        {MODOS.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={modo === m.id}
            className={modo === m.id ? `rt-modo modo-${m.id} es-on` : `rt-modo modo-${m.id}`}
            onClick={() => onModo(m.id)}
            aria-label={m.titulo}
            title={m.bajada}
          >
            <span className="rt-modo-punto" aria-hidden="true" />
            <span className="rt-modo-texto">{m.titulo}</span>
          </button>
        ))}
      </div>

      <div className="rt-hud-controles">
        <motion.button
          type="button"
          onClick={onDeshacer}
          disabled={!puedeDeshacer}
          aria-label="Deshacer la última decisión"
          whileTap={{ scale: 0.94 }}
          transition={springs.snap}
        >
          <Icon name="undo" size={18} />
        </motion.button>
        <motion.button type="button" onClick={onReiniciar} aria-label="Empezar la ruta de nuevo" whileTap={{ scale: 0.94 }} transition={springs.snap}>
          <Icon name="rotate" size={18} />
        </motion.button>
      </div>

      <nav className="rt-linea" aria-label="Línea de tiempo de la ruta">
        <ol>
          {PASOS.map((p, i) => {
            const hecho = hechos.has(p.id)
            const actual = i === paso
            return (
              <li key={p.id} className={`${hecho ? 'es-hecho' : ''}${actual ? ' es-actual' : ''}`}>
                <button type="button" onClick={() => onIr(i)} aria-current={actual ? 'step' : undefined}>
                  <span className="rt-linea-punto">{hecho && !actual ? <Icon name="check" size={12} /> : p.numero}</span>
                  <span className="rt-linea-texto">{p.titulo}</span>
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
    </header>
  )
}
