import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, motion, useInView } from 'motion/react'
import { Icon, type IconName } from '../components/Icon'
import { springs } from '../motion/tokens'
import { PlegadoContext } from '../expediente/contexto'

/**
 * Piezas de «La Ruta».
 *
 * La superficie es un tablero, no un documento: cada pieza existe para que
 * una decisión se vea, se sienta y deje una consecuencia visible. El detalle
 * denso no desaparece — se guarda en cajones que se abren bajo demanda.
 */

export type TonoBanda = 'arena' | 'tierra' | 'oceano' | 'selva' | 'noche' | 'ocre'

/**
 * Banda a sangre. Ocupa el ancho completo, alterna fondo y entra cuando
 * aparece en pantalla. Es la unidad narrativa del tablero.
 */
export function Banda({
  id,
  paso,
  titulo,
  gancho,
  tono,
  children,
  ilustracion,
  ilustracionAlt,
}: {
  id: string
  paso: string
  titulo: string
  gancho: string
  tono: TonoBanda
  children: ReactNode
  ilustracion?: string
  ilustracionAlt?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const visible = useInView(ref, { once: true, amount: 0, margin: '0px 0px -12% 0px' })

  return (
    <section ref={ref} className={`rt-banda tono-${tono}`} id={id} aria-labelledby={`${id}-titulo`}>
      <motion.div
        className="rt-banda-interior"
        initial={{ opacity: 0, y: 24 }}
        animate={visible ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.26, ease: [0.2, 0, 0, 1] }}
      >
        <header className="rt-banda-head">
          <span className="rt-paso">{paso}</span>
          <div>
            <h2 id={`${id}-titulo`}>{titulo}</h2>
            <p>{gancho}</p>
          </div>
          {ilustracion ? (
            <motion.img
              className="rt-banda-figura"
              src={ilustracion}
              alt={ilustracionAlt ?? ''}
              initial={{ opacity: 0, scale: 0.92, rotate: -3 }}
              animate={visible ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
              transition={{ ...springs.smooth, delay: 0.08 }}
            />
          ) : null}
        </header>
        {children}
      </motion.div>
    </section>
  )
}

/** Carta de decisión: grande, con imagen, elegible con una sola pulsación. */
export function Carta({
  titulo,
  bajada,
  imagen,
  alt,
  icono,
  elegida,
  onElegir,
  etiqueta,
  color = 'oceano',
  compacta = false,
}: {
  titulo: string
  bajada: string
  imagen?: string
  alt?: string
  icono?: IconName
  elegida: boolean
  onElegir: () => void
  etiqueta?: string
  color?: 'oceano' | 'selva' | 'tierra' | 'ocre'
  /** Sin arte: para decisiones que no tienen ilustración propia. */
  compacta?: boolean
}) {
  return (
    <motion.button
      type="button"
      className={`rt-carta color-${color}${elegida ? ' es-elegida' : ''}${compacta ? ' es-compacta' : ''}`}
      onClick={onElegir}
      aria-pressed={elegida}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98, y: 0 }}
      transition={springs.snap}
      layout
    >
      {compacta ? null : (
      <span className="rt-carta-arte">
        {imagen ? <img src={imagen} alt={alt ?? ''} /> : icono ? <Icon name={icono} size={40} /> : null}
        <AnimatePresence>
          {elegida ? (
            <motion.span
              className="rt-carta-check"
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0 }}
              transition={springs.snap}
            >
              <Icon name="check" size={16} />
            </motion.span>
          ) : null}
        </AnimatePresence>
      </span>
      )}
      <span className="rt-carta-texto">
        {etiqueta ? <em>{etiqueta}</em> : null}
        <strong>{titulo}</strong>
        <small>{bajada}</small>
        {compacta && elegida ? (
          <span className="rt-carta-marca" aria-hidden="true">
            <Icon name="check" size={14} /> elegido
          </span>
        ) : null}
      </span>
    </motion.button>
  )
}

/** Ficha de dato: un número grande, su unidad y de dónde salió. Máximo tres por banda. */
export function Ficha({
  rotulo,
  valor,
  pie,
  tono = 'neutro',
}: {
  rotulo: string
  valor: string
  pie?: string
  tono?: 'neutro' | 'bueno' | 'malo' | 'aviso'
}) {
  return (
    <div className={`rt-ficha tono-${tono}`}>
      <span className="rt-ficha-rotulo">{rotulo}</span>
      <strong className="rt-ficha-valor">{valor}</strong>
      {pie ? <span className="rt-ficha-pie">{pie}</span> : null}
    </div>
  )
}

/** Ficha de inventario: cantidad + unidad + material. Sustituye a una fila de tabla. */
export function Bulto({ cantidad, unidad, material, indice }: { cantidad: string; unidad: string; material: string; indice: number }) {
  return (
    <motion.li
      className="rt-bulto"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '200px' }}
      transition={{ ...springs.snap, delay: Math.min(indice * 0.04, 0.4) }}
    >
      <strong>{cantidad}</strong>
      <em>{unidad}</em>
      <span>{material}</span>
    </motion.li>
  )
}

/**
 * Cajón de detalle. Aquí vive todo lo denso: tablas, trámites y fuentes.
 * La regla del tablero es que nada de eso ocupa la vista por defecto, pero
 * siempre está a un clic y nunca se pierde.
 */
export function Cajon({
  rotulo,
  titulo,
  children,
}: {
  rotulo: string
  titulo: string
  children: ReactNode
}) {
  const [abierto, setAbierto] = useState(false)
  const cerrarRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!abierto) return
    cerrarRef.current?.focus()
    const alTeclear = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') setAbierto(false)
    }
    window.addEventListener('keydown', alTeclear)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', alTeclear)
      document.body.style.overflow = ''
    }
  }, [abierto])

  return (
    <>
      <motion.button
        type="button"
        className="rt-abrir-cajon"
        onClick={() => setAbierto(true)}
        whileHover={{ x: 2 }}
        whileTap={{ scale: 0.98 }}
        transition={springs.snap}
      >
        <Icon name="info" size={16} />
        {rotulo}
        <Icon name="arrow-right" size={16} />
      </motion.button>

      <AnimatePresence>
        {abierto ? (
          <motion.div
            className="rt-cajon-fondo"
            role="presentation"
            onMouseDown={(evento) => {
              if (evento.target === evento.currentTarget) setAbierto(false)
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.aside
              className="rt-cajon"
              role="dialog"
              aria-modal="true"
              aria-label={titulo}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
            >
              <header className="rt-cajon-head">
                <h3>{titulo}</h3>
                <button type="button" ref={cerrarRef} onClick={() => setAbierto(false)} aria-label="Cerrar el detalle">
                  <Icon name="close" size={20} />
                </button>
              </header>
              <div className="rt-cajon-cuerpo">
                <PlegadoContext.Provider value={true}>{children}</PlegadoContext.Provider>
              </div>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

/** Consecuencia de una decisión: aparece debajo de las cartas y no se va. */
export function Consecuencia({ children, tono = 'neutro' }: { children: ReactNode; tono?: 'neutro' | 'bueno' | 'malo' | 'aviso' }) {
  return (
    <motion.p
      className={`rt-consecuencia tono-${tono}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.2, 0, 0, 1] }}
    >
      {children}
    </motion.p>
  )
}
