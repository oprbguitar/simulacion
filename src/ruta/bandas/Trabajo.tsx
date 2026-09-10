import { motion } from 'motion/react'
import { MODOS_INGRESO, RMV, type ModoIngresoId, modoIngreso } from '../../domain/life/catalogo/trabajo'
import type { Perfil, Proyeccion } from '../../domain/life/motor'
import { SeccionTrabajo } from '../../expediente/secciones/Resto'
import { springs } from '../../motion/tokens'
import { plata } from '../formato'
import { Banda, Cajon, Consecuencia, Ficha } from '../piezas'

/**
 * Barras de los cinco modos de ingreso.
 *
 * No son una métrica calculada: son una lectura editorial de lo que el
 * catálogo ya dice en palabras (qué te protege, qué te expone, qué te
 * descuentan), puesta en una escala de 1 a 5 para poder compararlos de un
 * vistazo. La carga tributaria sí sale del cálculo real.
 */
const BARRAS: Record<ModoIngresoId, { proteccion: number; libertad: number; techo: number }> = {
  dependiente: { proteccion: 5, libertad: 1, techo: 2 },
  independiente: { proteccion: 1, libertad: 5, techo: 3 },
  'negocio-nrus': { proteccion: 1, libertad: 4, techo: 2 },
  'negocio-rer': { proteccion: 2, libertad: 4, techo: 4 },
  'negocio-rmt': { proteccion: 2, libertad: 3, techo: 5 },
}

const ROTULOS: Record<keyof (typeof BARRAS)['dependiente'], string> = {
  proteccion: 'Red que te sostiene',
  libertad: 'Libertad para moverte',
  techo: 'Hasta dónde puede crecer',
}

const CORTOS: Record<ModoIngresoId, string> = {
  dependiente: 'En planilla',
  independiente: 'Por recibos',
  'negocio-nrus': 'Negocio · RUS',
  'negocio-rer': 'Negocio · RER',
  'negocio-rmt': 'Negocio · MYPE',
}

function Barra({ valor, rotulo }: { valor: number; rotulo: string }) {
  return (
    <div className="rt-barra">
      <span className="rt-barra-rotulo">{rotulo}</span>
      <span className="rt-barra-pistas" aria-label={`${rotulo}: ${valor} de 5`}>
        {[1, 2, 3, 4, 5].map((paso) => (
          <motion.i
            key={paso}
            className={paso <= valor ? 'es-llena' : ''}
            initial={{ scaleY: 0.4, opacity: 0.4 }}
            whileInView={{ scaleY: 1, opacity: 1 }}
            viewport={{ once: true, margin: '200px' }}
            transition={{ ...springs.snap, delay: paso * 0.03 }}
          />
        ))}
      </span>
    </div>
  )
}

export function BandaTrabajo({
  proyeccion,
  onCambio,
}: {
  proyeccion: Proyeccion
  onCambio: (parcial: Partial<Perfil>) => void
}) {
  const { perfil } = proyeccion
  const modo = modoIngreso(perfil.modoIngreso)
  const descuento = modo.descuentoMensual(perfil.ingresoMensualBruto)
  const neto = perfil.ingresoMensualBruto - descuento

  return (
    <Banda
      id="trabajo"
      paso="05"
      tono="oceano"
      titulo="¿De qué vives?"
      gancho="Cinco formas de generar el mismo ingreso. Cambian cuánto te descuentan, cuánto te protegen y qué pasa el día que te enfermas."
      ilustracion="/assets/action-save.webp"
      ilustracionAlt="Frasco de ahorro con monedas peruanas y un brote creciendo."
    >
      <div className="rt-clases">
        {MODOS_INGRESO.map((m) => {
          const activo = m.id === modo.id
          const barras = BARRAS[m.id]
          const suDescuento = m.descuentoMensual(perfil.ingresoMensualBruto)
          return (
            <motion.button
              key={m.id}
              type="button"
              className={activo ? 'rt-clase es-on' : 'rt-clase'}
              aria-pressed={activo}
              onClick={() => onCambio({ modoIngreso: m.id })}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98, y: 0 }}
              transition={springs.snap}
              layout
            >
              <header>
                <span className="rt-clase-num">{m.numero}</span>
                <strong>{CORTOS[m.id]}</strong>
                <small>{m.categoriaRenta}</small>
              </header>

              <div className="rt-clase-barras">
                {(Object.keys(barras) as (keyof typeof barras)[]).map((clave) => (
                  <Barra key={clave} valor={barras[clave]} rotulo={ROTULOS[clave]} />
                ))}
              </div>

              <p className="rt-clase-descuento">
                Te descuentan
                <strong>{plata(suDescuento)}</strong>
                <span>{((suDescuento / Math.max(1, perfil.ingresoMensualBruto)) * 100).toFixed(1)} % del bruto</span>
              </p>
            </motion.button>
          )
        })}
      </div>

      <motion.div key={modo.id} className="rt-clase-detalle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={springs.smooth}>
        <div>
          <h4>Lo que te protege</h4>
          <ul className="es-bueno">
            {modo.beneficios.slice(0, 3).map((beneficio) => (
              <li key={beneficio}>{beneficio}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Lo que te expone</h4>
          <ul className="es-malo">
            {modo.riesgos.map((riesgo) => (
              <li key={riesgo}>{riesgo}</li>
            ))}
          </ul>
        </div>
      </motion.div>

      <div className="rt-fichas">
        <Ficha rotulo="Ganas al mes (bruto)" valor={plata(perfil.ingresoMensualBruto)} pie={`${(perfil.ingresoMensualBruto / RMV).toFixed(1)} sueldos mínimos`} />
        <Ficha rotulo="Se van en aportes e impuestos" valor={plata(descuento)} tono="malo" pie={`${((descuento / Math.max(1, perfil.ingresoMensualBruto)) * 100).toFixed(1)} % del bruto`} />
        <Ficha rotulo="Te queda de verdad" valor={plata(neto)} tono="bueno" pie="Con esto se paga todo lo demás" />
      </div>

      <Consecuencia tono="aviso">
        Las tres barras son una lectura de lo que cada régimen ofrece, no una métrica calculada. El descuento sí sale del cálculo real: tramos del
        impuesto a la renta y aportes previsionales vigentes.
      </Consecuencia>

      <Cajon rotulo="Ver regímenes, tramos de renta y aportes en detalle" titulo="De dónde sale el ingreso">
        <SeccionTrabajo proyeccion={proyeccion} />
      </Cajon>
    </Banda>
  )
}
