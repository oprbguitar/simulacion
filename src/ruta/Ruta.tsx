import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { PERFIL_INICIAL, proyectar, type Perfil } from '../domain/life/motor'
import { SERVICIOS_HOGAR } from '../domain/life/catalogo/servicios'
import { SeccionFuentes, SeccionServicios } from '../expediente/secciones/Resto'
import { LISTA_FUENTES } from '../domain/life/fuentes'
import { Icon } from '../components/Icon'
import { springs } from '../motion/tokens'
import { Hud } from './Hud'
import { plata } from './formato'
import { aplicarModo, type ModoId } from './modos'
import { PASOS, type PasoId } from './pasos'
import { guardarSesion, leerSesion } from './sesion'
import { Banda, Cajon, Consecuencia, Ficha } from './piezas'
import { BandaPartida, Portada } from './bandas/Partida'
import { BandaTerreno } from './bandas/Terreno'
import { BandaObra } from './bandas/Obra'
import { BandaFamilia } from './bandas/Familia'
import { BandaTrabajo } from './bandas/Trabajo'
import { BandaCartas } from './bandas/Cartas'
import { BandaMapa } from './bandas/Mapa'

/**
 * «La Ruta»: el mismo motor y el mismo catálogo del expediente, jugados.
 *
 * La superficie avanza en horizontal: una pantalla por capítulo de la vida,
 * con flechas a los costados y la línea de tiempo del marcador indicando en
 * qué parte vas. Cada pantalla plantea una decisión con cartas grandes,
 * muestra la consecuencia de inmediato y guarda el detalle denso en un cajón.
 */

const deslizar = {
  entra: (sentido: number) => ({ x: sentido * 72, opacity: 0 }),
  centro: { x: 0, opacity: 1 },
  sale: (sentido: number) => ({ x: sentido * -72, opacity: 0 }),
}

function escribiendo(objetivo: EventTarget | null) {
  return objetivo instanceof HTMLElement && (objetivo.isContentEditable || ['INPUT', 'SELECT', 'TEXTAREA'].includes(objetivo.tagName))
}

export function Ruta() {
  const [perfil, setPerfil] = useState<Perfil>(() => leerSesion()?.perfil ?? PERFIL_INICIAL)
  const [nombre, setNombre] = useState(() => leerSesion()?.nombre ?? '')
  const [historial, setHistorial] = useState<Perfil[]>([])
  const [paso, setPaso] = useState(0)
  const [sentido, setSentido] = useState(1)
  const [alcanzado, setAlcanzado] = useState(0)
  const [decididos, setDecididos] = useState<ReadonlySet<PasoId>>(new Set())
  const [modo, setModo] = useState<ModoId | null>(null)
  const [descargando, setDescargando] = useState(false)

  const proyeccion = useMemo(() => proyectar(perfil), [perfil])
  const anterior = historial.at(-1)
  const proyeccionAnterior = useMemo(() => (anterior ? proyectar(anterior) : null), [anterior])

  useEffect(() => guardarSesion({ nombre, perfil }), [nombre, perfil])

  const ir = (destino: number) => {
    const siguiente = Math.max(0, Math.min(PASOS.length - 1, destino))
    if (siguiente === paso) return
    setSentido(siguiente > paso ? 1 : -1)
    setPaso(siguiente)
    setAlcanzado((previo) => Math.max(previo, siguiente))
    window.scrollTo({ top: 0 })
  }

  // Flechas del teclado: avanzan y regresan, salvo cuando se está escribiendo
  // o hay un cajón de detalle abierto.
  useEffect(() => {
    const alTeclear = (evento: KeyboardEvent) => {
      if (escribiendo(evento.target) || document.querySelector('.rt-cajon')) return
      if (evento.key === 'ArrowRight') ir(paso + 1)
      if (evento.key === 'ArrowLeft') ir(paso - 1)
    }
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  })

  const cambio = (parcial: Partial<Perfil>) => {
    setHistorial((previos) => [...previos.slice(-19), perfil])
    setPerfil((actual) => ({ ...actual, ...parcial }))
  }

  /** Cambio hecho desde una pantalla: la marca como decidida en la línea de tiempo. */
  const cambioEn = (id: PasoId) => (parcial: Partial<Perfil>) => {
    setDecididos((previos) => new Set(previos).add(id))
    setModo(null)
    cambio(parcial)
  }

  const elegirModo = (elegido: ModoId) => {
    cambio(aplicarModo(elegido, perfil))
    setModo(elegido)
    setDecididos(new Set(PASOS.map((p) => p.id)))
  }

  const deshacer = () => {
    const previo = historial.at(-1)
    if (!previo) return
    setPerfil(previo)
    setHistorial((previos) => previos.slice(0, -1))
  }

  const reiniciar = () => {
    setHistorial((previos) => [...previos.slice(-19), perfil])
    setPerfil(PERFIL_INICIAL)
    setDecididos(new Set())
    setModo(null)
    setAlcanzado(paso)
  }

  const descargar = async () => {
    setDescargando(true)
    try {
      const { descargarExpediente } = await import('../expediente/descarga')
      descargarExpediente(perfil, nombre)
    } finally {
      setDescargando(false)
    }
  }

  const hechos = new Set<PasoId>(PASOS.filter((p, i) => decididos.has(p.id) || (i < alcanzado && !p.decision) || i < alcanzado).map((p) => p.id))

  const servicios = SERVICIOS_HOGAR.filter((s) => s.monto.periodicidad === 'mensual')
  const servicioMensual = servicios.reduce((suma, s) => suma + s.monto.tipico, 0)
  const final = proyeccion.anios.at(-1)
  const nombreCorto = nombre.trim().split(/\s+/)[0] ?? ''

  const pantallas: Record<PasoId, ReactNode> = {
    inicio: <Portada nombre={nombre} onNombre={setNombre} onEmpezar={() => ir(1)} />,
    partida: <BandaPartida proyeccion={proyeccion} onCambio={cambioEn('partida')} />,
    terreno: <BandaTerreno proyeccion={proyeccion} onCambio={cambioEn('terreno')} />,
    obra: <BandaObra proyeccion={proyeccion} onCambio={cambioEn('obra')} />,
    familia: <BandaFamilia proyeccion={proyeccion} onCambio={cambioEn('familia')} />,
    servicios: (
      <Banda
        id="servicios"
        paso="05"
        tono="ocre"
        titulo="La casa también cobra todos los meses"
        gancho="Terminarla no es el final. Luz, agua, internet y arbitrios llegan puntuales el resto de tu vida."
      >
        <div className="rt-fichas">
          <Ficha rotulo="Servicios al mes" valor={plata(servicioMensual)} pie={`Para un hogar de ${perfil.personasHogar} personas`} />
          <Ficha rotulo="Al año" valor={plata(servicioMensual * 12)} pie="Sube con cada reajuste tarifario" />
          <Ficha
            rotulo={`En ${perfil.horizonteAnios} años`}
            valor={plata(servicioMensual * 12 * perfil.horizonteAnios)}
            tono="aviso"
            pie="Sin contar inflación: es el piso"
          />
        </div>
        <Consecuencia tono="aviso">
          Terma eléctrica, aire acondicionado y cocina eléctrica pueden duplicar la boleta de luz. Son las tres cargas que más pesan en una vivienda
          peruana.
        </Consecuencia>
        <Cajon rotulo="Ver tarifas reguladas y consumos de referencia" titulo="Habitar la casa">
          <SeccionServicios proyeccion={proyeccion} />
        </Cajon>
      </Banda>
    ),
    trabajo: <BandaTrabajo proyeccion={proyeccion} onCambio={cambioEn('trabajo')} />,
    cartas: <BandaCartas proyeccion={proyeccion} onCambio={cambioEn('cartas')} />,
    mapa: <BandaMapa proyeccion={proyeccion} />,
    cierre: (
      <section className="rt-cierre" aria-labelledby="rt-cierre-titulo">
        <div className="rt-cierre-interior">
          <h2 id="rt-cierre-titulo">
            {nombreCorto ? `${nombreCorto}, a` : 'A'} los {perfil.edadInicial + perfil.horizonteAnios} años tendrías{' '}
            <strong>{plata(final?.patrimonio ?? 0)}</strong>
          </h2>
          <p>
            Ese número no es un destino: es el resultado de las decisiones que acabas de tomar. Cámbialas y vuelve a mirar. Y cuando algo te importe de
            verdad, no te quedes con lo que dice esta pantalla —entra al enlace de la entidad y compruébalo.
          </p>
          <div className="rt-cierre-botones">
            <motion.button
              type="button"
              className="rt-boton-grande"
              onClick={descargar}
              disabled={descargando}
              aria-busy={descargando}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={springs.snap}
            >
              {descargando ? 'Preparando tu expediente…' : 'Descargar mi expediente completo'}
            </motion.button>
            <motion.button
              type="button"
              className="rt-boton-liso"
              onClick={() => ir(1)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              transition={springs.snap}
            >
              Probar otra ruta
            </motion.button>
          </div>
          <p className="rt-cierre-fuentes">
            El archivo trae todo lo que elegiste, las cifras de tu ruta y los {LISTA_FUENTES.length} enlaces oficiales. Se abre en cualquier navegador y
            se puede imprimir o guardar como PDF. · <a href="/_expediente">Verlo en pantalla</a>
          </p>
          <Cajon rotulo="Ver de dónde sale cada dato" titulo="Las fuentes">
            <SeccionFuentes />
          </Cajon>
        </div>
      </section>
    ),
  }

  const actual = PASOS[paso]
  const previo = PASOS[paso - 1]
  const proximo = PASOS[paso + 1]

  return (
    <MotionConfig reducedMotion="user">
      <div className="rt-shell">
        <Hud
          proyeccion={proyeccion}
          anterior={proyeccionAnterior}
          nombre={nombreCorto}
          paso={paso}
          hechos={hechos}
          onIr={ir}
          modo={modo}
          onModo={elegirModo}
          puedeDeshacer={historial.length > 0}
          onDeshacer={deshacer}
          onReiniciar={reiniciar}
        />

        <main className="rt-tablero rt-escenario">
          <AnimatePresence mode="wait" initial={false} custom={sentido}>
            <motion.div
              key={actual.id}
              className="rt-pantalla"
              custom={sentido}
              variants={deslizar}
              initial="entra"
              animate="centro"
              exit="sale"
              transition={{ duration: 0.28, ease: [0.2, 0, 0, 1] }}
            >
              {pantallas[actual.id]}

              {paso > 0 ? (
                <nav className="rt-pie-nav" aria-label="Cambiar de pantalla">
                  <button type="button" className="rt-pie-boton" onClick={() => ir(paso - 1)}>
                    <Icon name="chevron-left" size={18} />
                    <span>
                      <small>Regresar</small>
                      {previo.titulo}
                    </span>
                  </button>
                  {proximo ? (
                    <button type="button" className="rt-pie-boton es-siguiente" onClick={() => ir(paso + 1)}>
                      <span>
                        <small>Continuar</small>
                        {proximo.titulo}
                      </span>
                      <Icon name="chevron-right" size={18} />
                    </button>
                  ) : null}
                </nav>
              ) : null}
            </motion.div>
          </AnimatePresence>

          {previo ? (
            <button type="button" className="rt-flecha es-anterior" onClick={() => ir(paso - 1)} aria-label={`Regresar a ${previo.titulo}`}>
              <Icon name="chevron-left" size={26} />
              <span className="rt-flecha-texto">{previo.titulo}</span>
            </button>
          ) : null}
          {proximo ? (
            <button type="button" className="rt-flecha es-siguiente" onClick={() => ir(paso + 1)} aria-label={`Avanzar a ${proximo.titulo}`}>
              <span className="rt-flecha-texto">{proximo.titulo}</span>
              <motion.span
                className="rt-flecha-icono"
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Icon name="chevron-right" size={26} />
              </motion.span>
            </button>
          ) : null}
        </main>
      </div>
    </MotionConfig>
  )
}
