import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '../components/Icon'
import { AnimatedNumber, DeltaChip } from '../motion/primitives'
import { springs } from '../motion/tokens'
import type { Proyeccion } from '../domain/life/motor'
import { plataCorta } from './formato'

/**
 * Barra de estado del tablero. Es el marcador del juego: siempre visible,
 * siempre reaccionando. Los tres números que importan y el avance de la ruta.
 */
export function Hud({
  proyeccion,
  anterior,
  puedeDeshacer,
  onDeshacer,
  onReiniciar,
}: {
  proyeccion: Proyeccion
  anterior: Proyeccion | null
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

  // Avance: cuántas de las seis decisiones del tablero ya se tomaron.
  const avance = Math.round((proyeccion.perfil.horizonteAnios / 30) * 100)

  return (
    <header className="rt-hud">
      <a className="rt-hud-marca" href="/">
        <span className="rt-hud-logo" aria-hidden="true">
          <Icon name="sprout" size={18} />
        </span>
        <span>
          <strong>La Ruta</strong>
          <small>Horizonte · Perú</small>
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

      <div className="rt-hud-barra" aria-hidden="true">
        <motion.span animate={{ width: `${avance}%` }} transition={{ duration: 0.26, ease: [0.2, 0, 0, 1] }} />
      </div>
    </header>
  )
}
