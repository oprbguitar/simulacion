import { useState } from 'react'
import { motion } from 'motion/react'
import type { EventoAnio, Proyeccion } from '../../domain/life/motor'
import { SeccionProyeccion } from '../../expediente/secciones/Proyeccion'
import { springs } from '../../motion/tokens'
import { plata, plataCorta } from '../formato'
import { Banda, Cajon, Consecuencia, Ficha } from '../piezas'

const GLIFO_EVENTO: Record<EventoAnio['tipo'], string> = {
  vivienda: '🏷️',
  obra: '🧱',
  familia: '👶',
  educacion: '🎒',
  trabajo: '💼',
  imprevisto: '⚡',
  servicio: '💡',
}

export function BandaMapa({ proyeccion }: { proyeccion: Proyeccion }) {
  const { anios, perfil } = proyeccion
  const [anioVisto, setAnioVisto] = useState(0)
  const anio = anios[Math.min(anioVisto, anios.length - 1)]
  const techo = Math.max(...anios.map((a) => Math.abs(a.patrimonio)), 1)
  const final = anios.at(-1)
  const sinFondos = anios.find((a) => a.ahorroAcumulado < 0)

  const gastos: { clave: keyof EventoAnioLike; rotulo: string }[] = [
    { clave: 'descuentosAnual', rotulo: 'Impuestos y aportes' },
    { clave: 'gastoEsencialAnual', rotulo: 'Vivir' },
    { clave: 'gastoViviendaAnual', rotulo: 'Vivienda' },
    { clave: 'cuotaCreditoAnual', rotulo: 'Cuota del banco' },
    { clave: 'gastoObraAnual', rotulo: 'Obra' },
    { clave: 'gastoServiciosAnual', rotulo: 'Servicios' },
    { clave: 'gastoHijosAnual', rotulo: 'Hijos' },
    { clave: 'gastoEducacionAnual', rotulo: 'Colegio' },
    { clave: 'imprevistosAnual', rotulo: 'Imprevistos' },
  ]

  return (
    <Banda
      id="mapa"
      paso="07"
      tono="arena"
      titulo={`Tu ruta, año por año`}
      gancho="Todo lo que decidiste, puesto en el tiempo. Camina la ruta y mira dónde aprieta."
    >
      <div className="rt-mapa" role="group" aria-label="Ruta de años">
        <div className="rt-mapa-pista">
          {anios.map((a) => {
            const alto = Math.max(4, (Math.abs(a.patrimonio) / techo) * 100)
            const activo = a.anio === anio.anio
            return (
              <button
                key={a.anio}
                type="button"
                className={`rt-casilla${activo ? ' es-on' : ''}${a.ahorroAcumulado < 0 ? ' es-rojo' : ''}`}
                onClick={() => setAnioVisto(a.anio)}
                aria-pressed={activo}
                aria-label={`Año ${a.anio}, ${a.edad} años, patrimonio ${plata(a.patrimonio)}`}
                title={`Año ${a.anio} · ${a.edad} años · ${plataCorta(a.patrimonio)}`}
              >
                <span className="rt-casilla-hitos" aria-hidden="true">
                  {a.eventos.slice(0, 2).map((evento, i) => (
                    <em key={i}>{GLIFO_EVENTO[evento.tipo]}</em>
                  ))}
                </span>
                <span
                  className={a.patrimonio < 0 ? 'rt-casilla-barra es-negativa' : 'rt-casilla-barra'}
                  style={{ height: `${alto}%` }}
                />
                <span className="rt-casilla-anio">{a.anio % 5 === 0 ? a.anio : ''}</span>
                {activo ? <motion.span className="rt-ficha-jugador" layoutId="rt-ficha" transition={springs.snap} aria-hidden="true" /> : null}
              </button>
            )
          })}
        </div>
      </div>

      <motion.div key={anio.anio} className="rt-anio" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={springs.smooth}>
        <header>
          <div>
            <span className="rt-etapa-rotulo">Año {anio.anio}</span>
            <h4>Tienes {anio.edad} años</h4>
          </div>
          <strong className={anio.flujoAnual < 0 ? 'es-malo' : 'es-bueno'}>
            {anio.flujoAnual >= 0 ? '+' : ''}
            {plata(anio.flujoAnual)}
            <small>este año</small>
          </strong>
        </header>

        <div className="rt-anio-cuerpo">
          <ul className="rt-anio-gastos">
            <li className="es-ingreso">
              <span>Te entra</span>
              <strong>{plata(anio.ingresoAnual)}</strong>
            </li>
            {gastos
              .filter((g) => (anio[g.clave as keyof typeof anio] as number) > 0)
              .map((g) => {
                const valor = anio[g.clave as keyof typeof anio] as number
                return (
                  <li key={g.clave}>
                    <span>{g.rotulo}</span>
                    <strong>− {plata(valor)}</strong>
                    <i style={{ width: `${Math.min(100, (valor / Math.max(1, anio.ingresoAnual)) * 100)}%` }} aria-hidden="true" />
                  </li>
                )
              })}
          </ul>

          <div className="rt-anio-hitos">
            <h5>Qué pasa este año</h5>
            {anio.eventos.length === 0 ? (
              <p className="rt-vacio">Nada nuevo. El año pasa con el flujo de siempre.</p>
            ) : (
              <ul>
                {anio.eventos.map((evento, i) => (
                  <motion.li
                    key={`${evento.titulo}-${i}`}
                    className={`rt-hito tipo-${evento.tipo}`}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...springs.smooth, delay: i * 0.05 }}
                  >
                    <span aria-hidden="true">{GLIFO_EVENTO[evento.tipo]}</span>
                    <div>
                      <strong>{evento.titulo}</strong>
                      {evento.monto ? <em>{plata(evento.monto)}</em> : null}
                      <p>{evento.detalle}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </motion.div>

      <div className="rt-fichas">
        <Ficha
          rotulo={`Patrimonio a los ${perfil.edadInicial + perfil.horizonteAnios}`}
          valor={plata(final?.patrimonio ?? 0)}
          tono={(final?.patrimonio ?? 0) < 0 ? 'malo' : 'bueno'}
          pie="Lo que tendrías, menos lo que deberías"
        />
        <Ficha
          rotulo="Plata líquida al final"
          valor={plata(final?.ahorroAcumulado ?? 0)}
          tono={(final?.ahorroAcumulado ?? 0) < 0 ? 'malo' : 'bueno'}
          pie="Lo que puedes usar mañana"
        />
        <Ficha
          rotulo="Primer año sin plata"
          valor={sinFondos ? `Año ${sinFondos.anio}` : 'Ninguno'}
          tono={sinFondos ? 'malo' : 'bueno'}
          pie={sinFondos ? `A los ${sinFondos.edad} años se corta el plan` : 'El plan aguanta hasta el final'}
        />
      </div>

      {proyeccion.alertas.length > 0 ? (
        <div className="rt-alertas">
          {proyeccion.alertas.map((alerta) => (
            <motion.article
              key={alerta.id}
              className={`rt-alerta nivel-${alerta.severidad}`}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '200px' }}
              transition={springs.smooth}
            >
              <h4>{alerta.titulo}</h4>
              <p>{alerta.mensaje}</p>
              <p className="rt-alerta-palanca">
                <span>Qué mover</span>
                {alerta.palanca}
              </p>
            </motion.article>
          ))}
        </div>
      ) : (
        <Consecuencia tono="bueno">Ninguna alerta activa: con estas decisiones, el plan cierra sin romperse.</Consecuencia>
      )}

      <Cajon rotulo="Ver la tabla completa de los 30 años" titulo="Tu ruta, en números">
        <SeccionProyeccion proyeccion={proyeccion} />
      </Cajon>
    </Banda>
  )
}

/** Solo para tipar las claves de gasto que la tira de barras sabe leer. */
type EventoAnioLike = Pick<
  Proyeccion['anios'][number],
  | 'descuentosAnual'
  | 'gastoEsencialAnual'
  | 'gastoViviendaAnual'
  | 'cuotaCreditoAnual'
  | 'gastoObraAnual'
  | 'gastoServiciosAnual'
  | 'gastoHijosAnual'
  | 'gastoEducacionAnual'
  | 'imprevistosAnual'
>
