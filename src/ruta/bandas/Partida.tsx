import { motion } from 'motion/react'
import { Controles } from '../../expediente/Controles'
import type { Perfil, Proyeccion } from '../../domain/life/motor'
import { modoIngreso } from '../../domain/life/catalogo/trabajo'
import { usePointerParallax } from '../../motion/useParallax'
import { springs } from '../../motion/tokens'
import { plata } from '../formato'
import { Banda, Cajon, Carta, Consecuencia, Ficha } from '../piezas'

/** Tres puntos de partida reconocibles. Evitan el formulario de ocho campos. */
const ARRANQUES: { id: string; titulo: string; bajada: string; etiqueta: string; imagen: string; alt: string; perfil: Partial<Perfil> }[] = [
  {
    id: 'empiezo',
    titulo: 'Recién empiezo',
    etiqueta: '18 años',
    bajada: 'Primer trabajo, vives con tu familia, casi no tienes ahorro.',
    imagen: '/assets/path-family.webp',
    alt: 'Familia reunida en la sala de su casa.',
    perfil: { edadInicial: 18, ingresoMensualBruto: 1400, ahorroInicial: 900, gastoEsencialMensual: 850, personasHogar: 1, rutaVivienda: 'familia' },
  },
  {
    id: 'promedio',
    titulo: 'Como la mayoría',
    etiqueta: '28 años',
    bajada: 'Trabajas hace años, alcanza para vivir y sobra poco.',
    imagen: '/assets/action-save.webp',
    alt: 'Frasco de ahorro con monedas peruanas y un brote.',
    perfil: { edadInicial: 28, ingresoMensualBruto: 3200, ahorroInicial: 12_000, gastoEsencialMensual: 1900, personasHogar: 2, rutaVivienda: 'terreno' },
  },
  {
    id: 'holgado',
    titulo: 'Me va bien',
    etiqueta: '34 años',
    bajada: 'Ingreso alto para el país, con capacidad real de ahorro.',
    imagen: '/assets/path-renting.webp',
    alt: 'Edificio de departamentos en una ciudad costera.',
    perfil: { edadInicial: 34, ingresoMensualBruto: 7000, ahorroInicial: 45_000, gastoEsencialMensual: 3200, personasHogar: 3, rutaVivienda: 'departamento' },
  },
]

const REGIONES: { id: Perfil['region']; titulo: string; bajada: string }[] = [
  { id: 'lima', titulo: 'Lima y Callao', bajada: 'Todo más caro, todo más cerca' },
  { id: 'costa', titulo: 'Costa', bajada: 'Construir cuesta algo menos' },
  { id: 'sierra', titulo: 'Sierra', bajada: 'El flete encarece la obra' },
  { id: 'selva', titulo: 'Selva', bajada: 'La obra más cara del país' },
]

export function BandaPartida({
  proyeccion,
  onCambio,
}: {
  proyeccion: Proyeccion
  onCambio: (parcial: Partial<Perfil>) => void
}) {
  const { perfil } = proyeccion
  const parallax = usePointerParallax(14)
  const modo = modoIngreso(perfil.modoIngreso)
  const neto = perfil.ingresoMensualBruto - modo.descuentoMensual(perfil.ingresoMensualBruto)
  const sobra = neto - perfil.gastoEsencialMensual
  const arranqueActivo = ARRANQUES.find((a) => a.perfil.edadInicial === perfil.edadInicial && a.perfil.ingresoMensualBruto === perfil.ingresoMensualBruto)

  return (
    <>
      <section
        className="rt-portada"
        onPointerMove={parallax.onPointerMove}
        onPointerLeave={parallax.onPointerLeave}
        aria-labelledby="rt-portada-titulo"
      >
        <motion.div className="rt-portada-arte" style={parallax.style} aria-hidden="true">
          <img
            src="/assets/horizonte-life-scene-v1.webp"
            alt=""
            /* La escena decora aquí; su descripción vive en la banda del terreno. */
          />
        </motion.div>

        <motion.div
          className="rt-portada-texto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springs.smooth, delay: 0.1 }}
        >
          <p className="rt-portada-kicker">El juego de la vida · Perú</p>
          <h1 id="rt-portada-titulo">
            Acabas de llegar.
            <br />
            Tienes <strong>30 años</strong> por delante.
          </h1>
          <p className="rt-portada-bajada">
            Vas a decidir dónde vivir, si construyes, si tienes hijos, de qué trabajas y qué haces cuando la vida se tuerce. Todo lo que cuesta acá es
            real y puedes comprobarlo: cada cifra trae el enlace de la entidad que la publica.
          </p>
          <motion.a className="rt-boton-grande" href="#partida" whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} transition={springs.snap}>
            Empezar la ruta
          </motion.a>
        </motion.div>

        <p className="rt-portada-nota">Simulación educativa. No es una cotización ni reemplaza a un profesional.</p>
      </section>

      <Banda
        id="partida"
        paso="01"
        tono="arena"
        titulo="¿Quién eres al empezar?"
        gancho="Elige el punto de partida que más se parezca al tuyo. Todo lo que viene después se recalcula solo."
      >
        <div className="rt-cartas rt-cartas-3">
          {ARRANQUES.map((arranque) => (
            <Carta
              key={arranque.id}
              titulo={arranque.titulo}
              bajada={arranque.bajada}
              etiqueta={arranque.etiqueta}
              imagen={arranque.imagen}
              alt={arranque.alt}
              color="oceano"
              elegida={arranqueActivo?.id === arranque.id}
              onElegir={() => onCambio(arranque.perfil)}
            />
          ))}
        </div>

        <h3 className="rt-subtitulo">¿Dónde te toca vivir?</h3>
        <div className="rt-chips" role="group" aria-label="Región">
          {REGIONES.map((region) => (
            <motion.button
              key={region.id}
              type="button"
              className={perfil.region === region.id ? 'rt-chip es-on' : 'rt-chip'}
              aria-pressed={perfil.region === region.id}
              onClick={() => onCambio({ region: region.id })}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={springs.snap}
            >
              <strong>{region.titulo}</strong>
              <small>{region.bajada}</small>
            </motion.button>
          ))}
        </div>

        <div className="rt-fichas">
          <Ficha rotulo="Te entra al mes" valor={plata(perfil.ingresoMensualBruto)} pie="Bruto, antes de descuentos" />
          <Ficha rotulo="Te queda después de aportes" valor={plata(neto)} pie={modo.titulo} tono="neutro" />
          <Ficha
            rotulo="Sobra cada mes"
            valor={plata(sobra)}
            pie={sobra <= 0 ? 'No alcanza: aquí no se puede ahorrar nada' : `${((sobra / neto) * 100).toFixed(0)} % de lo que te queda`}
            tono={sobra <= 0 ? 'malo' : sobra < 500 ? 'aviso' : 'bueno'}
          />
        </div>

        <Consecuencia tono={sobra <= 0 ? 'malo' : 'neutro'}>
          {sobra <= 0
            ? 'Con este punto de partida no sobra nada al final del mes. Cualquier plan de vivienda empieza por mover esta cifra.'
            : `Ahorrando todo lo que sobra, juntarías ${plata(sobra * 12)} al año. Guárdatelo: es la única palanca que tienes al principio.`}
        </Consecuencia>

        <Cajon rotulo="Ajustar todo a mi medida" titulo="Tu punto de partida, al detalle">
          <Controles perfil={perfil} onCambio={onCambio} />
        </Cajon>
      </Banda>
    </>
  )
}
