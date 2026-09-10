import {
  CALENDARIO_CRED,
  CONTENIDO_CRED,
  COSTOS_CRIANZA,
  CUIDADOS_GESTACION,
  CUIDADOS_PRECONCEPCION,
  ESQUEMA_VACUNACION,
  ETAPAS_FAMILIA,
  FUENTES_CRED,
  FUENTES_VACUNACION,
  OPCIONES_PARTO,
  VACUNAS_GESTANTE,
  costoEsquemaPrivado,
} from '../../domain/life/catalogo/familia'
import { FUENTES_EDUCACION, NIVELES_EDUCATIVOS, PREPARACION_PREUNIVERSITARIA, costoEscolaridadCompleta } from '../../domain/life/catalogo/educacion'
import { FUENTES } from '../../domain/life/fuentes'
import type { Proyeccion } from '../../domain/life/motor'
import { soles } from '../formato'
import { Aviso, Cifra, Fuentes, Seccion, TablaCostos } from '../piezas'

export function SeccionFamilia({ proyeccion }: { proyeccion: Proyeccion }) {
  const esquemaPrivado = costoEsquemaPrivado()
  const totalControles = CALENDARIO_CRED.reduce((s, c) => s + c.controlesAlPeriodo, 0)
  const hijos = proyeccion.perfil.hijos

  return (
    <Seccion
      id="familia"
      numero="03"
      titulo="Traer un hijo al mundo"
      bajada="Desde antes de concebir hasta los once años: qué corresponde en cada etapa, qué cubre el Estado y qué cuesta si decides hacerlo fuera."
    >
      <p className="ex-parrafo">
        {hijos.length === 0
          ? 'No has puesto hijos en la proyección. Aun así, esta sección aplica: son las fases, los costos y los derechos que existen en el Perú si algún día decides tenerlos.'
          : `En tu proyección hay ${hijos.length} ${hijos.length === 1 ? 'hijo' : 'hijos'}: ${hijos
              .map((h, i) => `el ${i + 1}.º nace en el año ${h.anioNacimiento} y va a educación ${h.educacion}`)
              .join('; ')}.`}
      </p>

      <ol className="ex-etapas">
        {ETAPAS_FAMILIA.map((etapa) => (
          <li key={etapa.id}>
            <span className="ex-etapa-num">{etapa.numero}</span>
            <div>
              <strong>{etapa.titulo}</strong>
              <small>{etapa.cuando}</small>
              <p>{etapa.resumen}</p>
            </div>
          </li>
        ))}
      </ol>

      <h3>01 · Antes de concebir</h3>
      <p className="ex-parrafo">
        Es la etapa con mejor relación entre lo que cuesta y lo que evita. Casi todo está cubierto por el Estado y casi nadie lo usa.
      </p>
      <TablaCostos items={CUIDADOS_PRECONCEPCION} />

      <h3>02 · Gestación</h3>
      <TablaCostos items={CUIDADOS_GESTACION} />

      <h4>Vacunas de la gestante</h4>
      <div className="ex-tabla-envoltura">
        <table className="ex-tabla ex-tabla-compacta">
          <thead>
            <tr>
              <th scope="col">Cuándo</th>
              <th scope="col">Vacuna</th>
              <th scope="col">Protege de</th>
              <th scope="col">Dosis</th>
            </tr>
          </thead>
          <tbody>
            {VACUNAS_GESTANTE.map((v) => (
              <tr key={v.id}>
                <th scope="row">{v.edad}</th>
                <td>
                  <strong>{v.vacuna}</strong>
                </td>
                <td>{v.protegeDe}</td>
                <td>{v.dosis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>03 · Parto</h3>
      <TablaCostos items={OPCIONES_PARTO} />

      <h3>04 · Esquema Nacional de Inmunizaciones</h3>
      <div className="ex-panel-calculo">
        <dl className="ex-datos">
          <div>
            <dt>En un establecimiento del Estado</dt>
            <dd className="ex-dato-fuerte">S/ 0</dd>
            <span>Las {ESQUEMA_VACUNACION.length} aplicaciones del esquema, gratuitas</span>
          </div>
          <div>
            <dt>El mismo esquema en el sector privado</dt>
            <dd className="ex-dato-riesgo">{soles(esquemaPrivado.tipico)}</dd>
            <span>
              Rango {soles(esquemaPrivado.min)} – {soles(esquemaPrivado.max)}
            </span>
          </div>
        </dl>
      </div>

      <div className="ex-tabla-envoltura">
        <table className="ex-tabla ex-tabla-compacta ex-tabla-vacunas">
          <thead>
            <tr>
              <th scope="col">Edad</th>
              <th scope="col">Vacuna</th>
              <th scope="col">Protege de</th>
              <th scope="col">Dosis</th>
              <th scope="col">En el Estado</th>
              <th scope="col">Referencia privada</th>
            </tr>
          </thead>
          <tbody>
            {ESQUEMA_VACUNACION.map((v) => (
              <tr key={v.id}>
                <th scope="row">{v.edad}</th>
                <td>
                  <strong>{v.vacuna}</strong>
                </td>
                <td>{v.protegeDe}</td>
                <td>{v.dosis}</td>
                <td className="ex-gratis">Gratuita</td>
                <td className="ex-num">{v.costoPrivado ? soles(v.costoPrivado.tipico) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Aviso tono="nota">
        El esquema peruano incluye 23 vacunas y un anticuerpo monoclonal, y cubre todas las etapas de la vida, no solo la infancia. La tabla de arriba es
        la parte pediátrica; el adulto, el adulto mayor y la gestante tienen su propio esquema en la página del MINSA.
      </Aviso>
      <Fuentes items={FUENTES_VACUNACION} titulo="Esquema oficial y dónde vacunarse" />

      <h3>05 · Control de Crecimiento y Desarrollo (CRED)</h3>
      <p className="ex-parrafo">
        Intervención preventiva gratuita del MINSA para la población infantil hasta los 11 años, disponible en todos los establecimientos del primer
        nivel de atención. Solo en los primeros cuatro años son {totalControles} controles.
      </p>
      <div className="ex-dos-columnas">
        <div className="ex-tabla-envoltura">
          <table className="ex-tabla ex-tabla-compacta">
            <thead>
              <tr>
                <th scope="col">Edad</th>
                <th scope="col">Frecuencia</th>
                <th scope="col">Controles</th>
              </tr>
            </thead>
            <tbody>
              {CALENDARIO_CRED.map((c) => (
                <tr key={c.rango}>
                  <th scope="row">{c.rango}</th>
                  <td>{c.frecuencia}</td>
                  <td className="ex-num">{c.controlesAlPeriodo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="ex-lista-notas">
          {CONTENIDO_CRED.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
      <Fuentes items={FUENTES_CRED} titulo="Pedir el control CRED" />

      <h3>06 · Lo que cuesta criar, mes a mes</h3>
      <TablaCostos items={COSTOS_CRIANZA} />

      <h3>07 · Educación</h3>
      <p className="ex-parrafo">
        La educación pública es gratuita; el gasto asociado no lo es. Escolarizar a un hijo de inicial a secundaria cuesta{' '}
        <strong>{soles(costoEscolaridadCompleta(false).tipico)}</strong> por la vía pública y{' '}
        <strong>{soles(costoEscolaridadCompleta(true).tipico)}</strong> por la privada, en soles de hoy y sin contar educación superior.
      </p>

      <div className="ex-niveles">
        {NIVELES_EDUCATIVOS.map((nivel) => (
          <article key={nivel.id} className="ex-nivel">
            <header>
              <span className="ex-nivel-num">{nivel.numero}</span>
              <div>
                <h4>{nivel.titulo}</h4>
                <small>
                  {nivel.edades} · {nivel.aniosDuracion} {nivel.aniosDuracion === 1 ? 'año' : 'años'}
                </small>
              </div>
            </header>
            <p>{nivel.descripcion}</p>
            <dl className="ex-datos ex-datos-compactos">
              <div>
                <dt>Institución pública</dt>
                <dd>
                  <Cifra monto={nivel.publico} />
                </dd>
              </div>
              <div>
                <dt>Institución privada</dt>
                <dd>
                  <Cifra monto={nivel.privado} />
                </dd>
              </div>
            </dl>
            <h5>Gastos que existen en las dos vías</h5>
            <TablaCostos items={nivel.gastosAsociados} />
            {nivel.notas.length > 0 ? (
              <ul className="ex-lista-notas">
                {nivel.notas.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            ) : null}
            <Fuentes items={nivel.fuentes} titulo="Verificar y comparar" />
          </article>
        ))}
      </div>

      <h4>El salto a la educación superior</h4>
      <TablaCostos items={[PREPARACION_PREUNIVERSITARIA]} />

      <Fuentes items={[...FUENTES_EDUCACION, FUENTES.sis, FUENTES.essalud, FUENTES.susalud]} titulo="Entidades de esta sección" />
    </Seccion>
  )
}
