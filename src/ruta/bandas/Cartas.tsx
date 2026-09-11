import { motion } from 'motion/react'
import { IMPREVISTOS } from '../../domain/life/catalogo/imprevistos'
import type { Perfil, Proyeccion } from '../../domain/life/motor'
import { SeccionImprevistos } from '../../expediente/secciones/Resto'
import { Icon } from '../../components/Icon'
import { springs } from '../../motion/tokens'
import { plata } from '../formato'
import { Banda, Cajon, Consecuencia } from '../piezas'

/** Un glifo por carta: la vida no manda texto, manda golpes reconocibles. */
const GLIFOS: Record<string, string> = {
  desempleo: '💼',
  'enfermedad-grave': '🩺',
  sismo: '🌎',
  robo: '🔦',
  'estafa-inmobiliaria': '📄',
  'alza-materiales': '📈',
  'obra-detenida': '🚧',
  discriminacion: '⚖️',
}

export function BandaCartas({
  proyeccion,
  onCambio,
}: {
  proyeccion: Proyeccion
  onCambio: (parcial: Partial<Perfil>) => void
}) {
  const { perfil } = proyeccion
  const activos = perfil.imprevistosActivos
  const sinFondos = proyeccion.anios.find((a) => a.ahorroAcumulado < 0)

  const voltear = (id: string) =>
    onCambio({ imprevistosActivos: activos.includes(id) ? activos.filter((x) => x !== id) : [...activos, id] })

  return (
    <Banda
      id="cartas"
      paso="07"
      tono="noche"
      titulo="Y entonces la vida se mete"
      gancho="Ocho cartas. Voltéalas y mira qué le pasa a tu ruta. No son predicciones sobre ti: son la prueba de cuánto margen te queda."
    >
      <div className="rt-mazo">
        {IMPREVISTOS.map((evento, indice) => {
          const activa = activos.includes(evento.id)
          return (
            <motion.button
              key={evento.id}
              type="button"
              className={activa ? 'rt-naipe es-volteado' : 'rt-naipe'}
              onClick={() => voltear(evento.id)}
              aria-pressed={activa}
              aria-label={`${evento.titulo}. ${activa ? 'Activa en tu ruta' : 'Voltear para activarla'}`}
              initial={{ opacity: 0, y: 20, rotate: indice % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: '200px' }}
              whileHover={{ y: -6, rotate: indice % 2 ? 1 : -1 }}
              whileTap={{ scale: 0.97 }}
              transition={{ ...springs.smooth, delay: Math.min(indice * 0.05, 0.4) }}
            >
              <span className="rt-naipe-glifo" aria-hidden="true">
                {GLIFOS[evento.id] ?? '❓'}
              </span>
              <strong>{evento.titulo}</strong>
              <small>{evento.detalle}</small>
              <span className="rt-naipe-pie">
                <em>{(evento.probabilidadAnual * 100).toFixed(0)} % al año</em>
                <span className="rt-naipe-estado">{activa ? <Icon name="check" size={14} /> : 'Voltear'}</span>
              </span>
            </motion.button>
          )
        })}
      </div>

      {activos.length > 0 ? (
        <Consecuencia tono={sinFondos ? 'malo' : 'aviso'}>
          {activos.length === 1 ? 'Con esa carta encima' : `Con esas ${activos.length} cartas encima`}, tu patrimonio a los{' '}
          {perfil.edadInicial + perfil.horizonteAnios} años queda en <strong>{plata(proyeccion.anios.at(-1)?.patrimonio ?? 0)}</strong>
          {sinFondos ? ` y te quedas sin plata en el año ${sinFondos.anio}.` : ' y el plan igual aguanta.'}{' '}
          {sinFondos ? 'Eso es exactamente para lo que sirve el fondo de emergencia.' : ''}
        </Consecuencia>
      ) : (
        <Consecuencia>Todavía no volteaste ninguna. Prueba con «Pérdida del empleo»: es la más frecuente y la que más gente no ve venir.</Consecuencia>
      )}

      <div className="rt-defensas">
        <h3 className="rt-subtitulo">Lo que sí puedes hacer</h3>
        <ul>
          {(activos.length > 0 ? IMPREVISTOS.filter((e) => activos.includes(e.id)) : IMPREVISTOS.slice(0, 3)).map((evento) => (
            <li key={evento.id}>
              <strong>
                <span aria-hidden="true">{GLIFOS[evento.id]}</span> {evento.titulo}
              </strong>
              <span>{evento.mitigacion[0]}</span>
            </li>
          ))}
        </ul>
      </div>

      <Cajon rotulo="Ver los ocho imprevistos y a qué entidad acudir" titulo="Lo que el plan no contempla">
        <SeccionImprevistos perfil={perfil} onCambio={onCambio} />
      </Cajon>
    </Banda>
  )
}
