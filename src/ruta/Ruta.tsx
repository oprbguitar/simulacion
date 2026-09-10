import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { PERFIL_INICIAL, proyectar, type Perfil } from '../domain/life/motor'
import { SERVICIOS_HOGAR } from '../domain/life/catalogo/servicios'
import { SeccionFuentes, SeccionServicios } from '../expediente/secciones/Resto'
import { LISTA_FUENTES } from '../domain/life/fuentes'
import { springs } from '../motion/tokens'
import { Hud } from './Hud'
import { plata } from './formato'
import { Banda, Cajon, Consecuencia, Ficha } from './piezas'
import { BandaPartida } from './bandas/Partida'
import { BandaTerreno } from './bandas/Terreno'
import { BandaObra } from './bandas/Obra'
import { BandaFamilia } from './bandas/Familia'
import { BandaTrabajo } from './bandas/Trabajo'
import { BandaCartas } from './bandas/Cartas'
import { BandaMapa } from './bandas/Mapa'

/**
 * «La Ruta»: el mismo motor y el mismo catálogo del expediente, jugados.
 *
 * La superficie es una sucesión de bandas a sangre. Cada una plantea una
 * decisión con cartas grandes, muestra la consecuencia de inmediato y deja el
 * detalle denso —tablas, trámites, fuentes— dentro de un cajón. Nada de la
 * información se pierde: deja de ser el estado por defecto de la pantalla.
 */
export function Ruta() {
  const [perfil, setPerfil] = useState<Perfil>(PERFIL_INICIAL)
  const [historial, setHistorial] = useState<Perfil[]>([])
  const proyeccion = useMemo(() => proyectar(perfil), [perfil])
  const anterior = historial.at(-1)
  const proyeccionAnterior = useMemo(() => (anterior ? proyectar(anterior) : null), [anterior])

  const cambio = (parcial: Partial<Perfil>) => {
    setHistorial((previos) => [...previos.slice(-19), perfil])
    setPerfil((actual) => ({ ...actual, ...parcial }))
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
  }

  const servicios = SERVICIOS_HOGAR.filter((s) => s.monto.periodicidad === 'mensual')
  const servicioMensual = servicios.reduce((suma, s) => suma + s.monto.tipico, 0)
  const final = proyeccion.anios.at(-1)

  return (
    <div className="rt-shell">
      <Hud
        proyeccion={proyeccion}
        anterior={proyeccionAnterior}
        puedeDeshacer={historial.length > 0}
        onDeshacer={deshacer}
        onReiniciar={reiniciar}
      />

      <main className="rt-tablero">
        <BandaPartida proyeccion={proyeccion} onCambio={cambio} />
        <BandaTerreno proyeccion={proyeccion} onCambio={cambio} />
        <BandaObra proyeccion={proyeccion} onCambio={cambio} />
        <BandaFamilia proyeccion={proyeccion} onCambio={cambio} />

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

        <BandaTrabajo proyeccion={proyeccion} onCambio={cambio} />
        <BandaCartas proyeccion={proyeccion} onCambio={cambio} />
        <BandaMapa proyeccion={proyeccion} />

        <section className="rt-cierre" aria-labelledby="rt-cierre-titulo">
          <motion.div
            className="rt-cierre-interior"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={springs.smooth}
          >
            <h2 id="rt-cierre-titulo">
              A los {perfil.edadInicial + perfil.horizonteAnios} años tendrías <strong>{plata(final?.patrimonio ?? 0)}</strong>
            </h2>
            <p>
              Ese número no es un destino: es el resultado de las decisiones que acabas de tomar. Cámbialas y vuelve a mirar. Y cuando algo te importe
              de verdad, no te quedes con lo que dice esta pantalla —entra al enlace de la entidad y compruébalo.
            </p>
            <div className="rt-cierre-botones">
              <motion.a className="rt-boton-grande" href="#partida" whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} transition={springs.snap}>
                Probar otra ruta
              </motion.a>
              <motion.a className="rt-boton-liso" href="/_expediente" whileHover={{ y: -3 }} whileTap={{ scale: 0.98 }} transition={springs.snap}>
                Abrir el expediente completo
              </motion.a>
            </div>
            <p className="rt-cierre-fuentes">
              {LISTA_FUENTES.length} fuentes oficiales verificadas · todo corre en tu navegador · no se envía ni se guarda nada
            </p>
            <Cajon rotulo="Ver de dónde sale cada dato" titulo="Las fuentes">
              <SeccionFuentes />
            </Cajon>
          </motion.div>
        </section>
      </main>
    </div>
  )
}
