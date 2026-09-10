import { useState } from 'react'
import { motion } from 'motion/react'
import { CALENDARIO_CRED, ESQUEMA_VACUNACION, costoEsquemaPrivado } from '../../domain/life/catalogo/familia'
import { NIVELES_EDUCATIVOS, costoEscolaridadCompleta } from '../../domain/life/catalogo/educacion'
import type { Perfil, Proyeccion } from '../../domain/life/motor'
import { SeccionFamilia } from '../../expediente/secciones/Familia'
import { springs } from '../../motion/tokens'
import { plata } from '../formato'
import { Banda, Cajon, Consecuencia, Ficha } from '../piezas'

/** Tramos de edad del esquema, para colorear el tablero de vacunas. */
function tramo(mes: number): { id: string; rotulo: string } {
  if (mes === 0) return { id: 'nace', rotulo: 'Al nacer' }
  if (mes <= 7) return { id: 'bebe', rotulo: 'Primeros meses' }
  if (mes <= 18) return { id: 'anio', rotulo: 'Primer año y medio' }
  if (mes <= 48) return { id: 'nino', rotulo: '2 a 4 años' }
  return { id: 'escolar', rotulo: '9 a 18 años' }
}

const TRAMOS = ['nace', 'bebe', 'anio', 'nino', 'escolar']

export function BandaFamilia({
  proyeccion,
  onCambio,
}: {
  proyeccion: Proyeccion
  onCambio: (parcial: Partial<Perfil>) => void
}) {
  const { perfil } = proyeccion
  const [vacunaVista, setVacunaVista] = useState<string | null>(null)
  const privado = costoEsquemaPrivado()
  const controles = CALENDARIO_CRED.reduce((suma, tramoCred) => suma + tramoCred.controlesAlPeriodo, 0)
  const hijos = perfil.hijos
  const educacionPrivada = hijos.some((h) => h.educacion === 'privada')
  const escolaridad = costoEscolaridadCompleta(educacionPrivada)
  const vacuna = ESQUEMA_VACUNACION.find((v) => v.id === vacunaVista)

  const cambiarHijos = (cantidad: number) => {
    if (cantidad === hijos.length) return
    if (cantidad < hijos.length) return onCambio({ hijos: hijos.slice(0, cantidad) })
    const nuevos = [...hijos]
    while (nuevos.length < cantidad) {
      nuevos.push({
        id: `hijo-${nuevos.length + 1}`,
        anioNacimiento: Math.min(perfil.horizonteAnios - 1, 3 + nuevos.length * 3),
        educacion: 'publica',
        saludPrivada: false,
      })
    }
    onCambio({ hijos: nuevos })
  }

  return (
    <Banda
      id="familia"
      paso="04"
      tono="selva"
      titulo="¿Y si tienes hijos?"
      gancho="Es la decisión que más cambia el flujo de todo lo demás. Y es también donde el Estado peruano pone más cosas gratis de las que casi nadie usa."
      ilustracion="/assets/path-family.webp"
      ilustracionAlt="Familia reunida en la sala de su casa."
    >
      <h3 className="rt-subtitulo">¿Cuántos?</h3>
      <div className="rt-chips" role="group" aria-label="Número de hijos">
        {[0, 1, 2, 3].map((cantidad) => (
          <motion.button
            key={cantidad}
            type="button"
            className={hijos.length === cantidad ? 'rt-chip es-on rt-chip-numero' : 'rt-chip rt-chip-numero'}
            aria-pressed={hijos.length === cantidad}
            onClick={() => cambiarHijos(cantidad)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            transition={springs.snap}
          >
            <strong>{cantidad}</strong>
            <small>{cantidad === 0 ? 'ninguno' : cantidad === 1 ? 'un hijo' : 'hijos'}</small>
          </motion.button>
        ))}
      </div>

      {hijos.length > 0 ? (
        <>
          <h3 className="rt-subtitulo">¿Colegio público o privado?</h3>
          <div className="rt-chips" role="group" aria-label="Tipo de educación">
            {(['publica', 'privada'] as const).map((tipo) => (
              <motion.button
                key={tipo}
                type="button"
                className={educacionPrivada === (tipo === 'privada') ? 'rt-chip es-on' : 'rt-chip'}
                aria-pressed={educacionPrivada === (tipo === 'privada')}
                onClick={() => onCambio({ hijos: hijos.map((h) => ({ ...h, educacion: tipo })) })}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.97 }}
                transition={springs.snap}
              >
                <strong>{tipo === 'publica' ? 'Pública' : 'Privada'}</strong>
                <small>{tipo === 'publica' ? 'Sin pensión, con gastos' : 'Pensión más gastos'}</small>
              </motion.button>
            ))}
          </div>

          <div className="rt-fichas">
            <Ficha
              rotulo={`Criar ${hijos.length === 1 ? 'un hijo' : `${hijos.length} hijos`} hasta los 5`}
              valor={plata(13_800 * hijos.length * 3)}
              pie="Pañales, higiene, alimentación y cuidado mientras trabajas"
            />
            <Ficha
              rotulo="Escolarizar de inicial a secundaria"
              valor={plata(escolaridad.tipico * hijos.length)}
              tono={educacionPrivada ? 'aviso' : 'neutro'}
              pie={educacionPrivada ? '14 años de pensión, matrícula y gastos' : 'Sin pensión: útiles, movilidad y alimentación'}
            />
            <Ficha
              rotulo="Controles CRED hasta los 4 años"
              valor={`${controles} citas`}
              tono="bueno"
              pie="Gratis en cualquier establecimiento del MINSA"
            />
          </div>
        </>
      ) : (
        <Consecuencia>
          Sin hijos en la proyección el flujo queda mucho más holgado. Aun así, mira el tablero de abajo: son derechos que existen si algún día decides
          tenerlos.
        </Consecuencia>
      )}

      <h3 className="rt-subtitulo">El tablero de vacunas</h3>
      <p className="rt-parrafo">
        Son <strong>{ESQUEMA_VACUNACION.length} aplicaciones</strong> del Esquema Nacional de Inmunizaciones, de recién nacido a los 18 años. Toca
        cualquiera para ver de qué protege.
      </p>

      <div className="rt-vacunas">
        {TRAMOS.map((idTramo) => {
          const delTramo = ESQUEMA_VACUNACION.filter((v) => tramo(v.mes).id === idTramo)
          if (delTramo.length === 0) return null
          return (
            <div key={idTramo} className={`rt-vacuna-tramo tramo-${idTramo}`}>
              <h4>{tramo(delTramo[0].mes).rotulo}</h4>
              <ul>
                {delTramo.map((v, indice) => (
                  <motion.li
                    key={v.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: '200px' }}
                    transition={{ ...springs.snap, delay: Math.min(indice * 0.03, 0.3) }}
                  >
                    <button
                      type="button"
                      className={vacunaVista === v.id ? 'rt-vacuna es-on' : 'rt-vacuna'}
                      onClick={() => setVacunaVista(vacunaVista === v.id ? null : v.id)}
                      aria-pressed={vacunaVista === v.id}
                      title={`${v.vacuna} · ${v.edad}`}
                    >
                      <span className="rt-vacuna-edad">{v.edad.replace(' meses', 'm').replace(' años', 'a').replace('Recién nacido', 'RN')}</span>
                      <span className="rt-vacuna-nombre">{v.vacuna.replace(/ \(.*\)/, '')}</span>
                    </button>
                  </motion.li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>

      <motion.div
        key={vacuna?.id ?? 'vacio'}
        className="rt-vacuna-detalle"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springs.smooth}
      >
        {vacuna ? (
          <>
            <div>
              <span className="rt-etapa-rotulo">{vacuna.edad} · {vacuna.dosis}</span>
              <h4>{vacuna.vacuna}</h4>
              <p>Protege de: {vacuna.protegeDe}.</p>
            </div>
            <div className="rt-vacuna-precios">
              <span className="es-bueno">
                <strong>S/ 0</strong>
                <small>en el Estado</small>
              </span>
              <span className="es-malo">
                <strong>{vacuna.costoPrivado ? plata(vacuna.costoPrivado.tipico) : '—'}</strong>
                <small>en privado</small>
              </span>
            </div>
          </>
        ) : (
          <p className="rt-vacio">Toca una vacuna del tablero para ver de qué protege y cuánto costaría fuera del Estado.</p>
        )}
      </motion.div>

      <div className="rt-comparacion">
        <div className="es-bueno">
          <span>Todo el esquema en un establecimiento del MINSA</span>
          <strong>S/ 0</strong>
        </div>
        <span className="rt-comparacion-vs">frente a</span>
        <div className="es-malo">
          <span>El mismo esquema en el sector privado</span>
          <strong>{plata(privado.tipico)}</strong>
          <small>
            entre {plata(privado.min)} y {plata(privado.max)}
          </small>
        </div>
      </div>

      <h3 className="rt-subtitulo">Después viene el colegio</h3>
      <div className="rt-niveles-tira">
        {NIVELES_EDUCATIVOS.map((nivel) => (
          <motion.div
            key={nivel.id}
            className="rt-nivel-paso"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '200px' }}
            transition={springs.smooth}
          >
            <span className="rt-nivel-num">{nivel.numero}</span>
            <strong>{nivel.titulo.replace('Educación ', '')}</strong>
            <small>{nivel.edades}</small>
            <span className="rt-nivel-precio">
              {nivel.privado.tipico > 0 ? `${plata(nivel.privado.tipico)}/mes en privado` : ''}
            </span>
          </motion.div>
        ))}
      </div>

      <Cajon rotulo="Ver el esquema completo, el CRED, los costos y las fuentes" titulo="Traer un hijo al mundo">
        <SeccionFamilia proyeccion={proyeccion} />
      </Cajon>
    </Banda>
  )
}
