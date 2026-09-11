import { useMemo, useState } from 'react'
import { PERFIL_INICIAL, proyectar, type Perfil } from '../domain/life/motor'
import { leerSesion } from '../ruta/sesion'
import { Controles } from './Controles'
import { soles } from './formato'
import { Seccion } from './piezas'
import { SeccionConstruccion } from './secciones/Construccion'
import { SeccionFamilia } from './secciones/Familia'
import { SeccionProyeccion } from './secciones/Proyeccion'
import { SeccionFuentes, SeccionImprevistos, SeccionServicios, SeccionTrabajo } from './secciones/Resto'
import { SeccionVivienda } from './secciones/Vivienda'

const INDICE = [
  { id: 'partida', numero: '00', titulo: 'Tu punto de partida' },
  { id: 'vivienda', numero: '01', titulo: 'Adquirir la propiedad' },
  { id: 'construccion', numero: '02', titulo: 'Construir' },
  { id: 'familia', numero: '03', titulo: 'Traer un hijo al mundo' },
  { id: 'servicios', numero: '04', titulo: 'Habitar la casa' },
  { id: 'trabajo', numero: '05', titulo: 'De dónde sale el ingreso' },
  { id: 'imprevistos', numero: '06', titulo: 'Lo que el plan no contempla' },
  { id: 'proyeccion', numero: '07', titulo: 'Los próximos años' },
  { id: 'fuentes', numero: '08', titulo: 'De dónde sale cada dato' },
]

export function Expediente() {
  // Si la persona viene de La Ruta, el expediente muestra sus decisiones.
  const [sesion] = useState(leerSesion)
  const [perfil, setPerfil] = useState<Perfil>(sesion?.perfil ?? PERFIL_INICIAL)
  const nombre = sesion?.nombre ?? ''
  const [descargando, setDescargando] = useState(false)
  const descargar = async () => {
    setDescargando(true)
    try {
      const { descargarExpediente } = await import('./descarga')
      descargarExpediente(perfil, nombre)
    } finally {
      setDescargando(false)
    }
  }
  const [indiceAbierto, setIndiceAbierto] = useState(false)
  const proyeccion = useMemo(() => proyectar(perfil), [perfil])
  const cambio = (parcial: Partial<Perfil>) => setPerfil((actual) => ({ ...actual, ...parcial }))
  const final = proyeccion.anios.at(-1)
  const sinFondos = proyeccion.anios.find((a) => a.ahorroAcumulado < 0)

  return (
    <div className="ex-shell">
      <aside className={indiceAbierto ? 'ex-indice is-abierto' : 'ex-indice'}>
        <div className="ex-marca">
          <a href="/">
            <strong>Horizonte</strong>
            <span>Expediente de vida · Perú</span>
          </a>
          <button type="button" className="ex-indice-toggle" onClick={() => setIndiceAbierto((v) => !v)} aria-expanded={indiceAbierto}>
            {indiceAbierto ? 'Cerrar' : 'Índice'}
          </button>
        </div>

        <nav aria-label="Índice del expediente">
          <ol>
            {INDICE.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={() => setIndiceAbierto(false)}>
                  <span>{item.numero}</span>
                  {item.titulo}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="ex-estado">
          <h2>Estado del plan</h2>
          <dl>
            <div>
              <dt>Costo de la obra</dt>
              <dd>{soles(proyeccion.costoObra.tipico)}</dd>
            </div>
            <div>
              <dt>Patrimonio al año {perfil.horizonteAnios}</dt>
              <dd className={(final?.patrimonio ?? 0) < 0 ? 'ex-dato-riesgo' : undefined}>{soles(final?.patrimonio ?? 0)}</dd>
            </div>
            <div>
              <dt>Se queda sin fondos</dt>
              <dd className={sinFondos ? 'ex-dato-riesgo' : undefined}>{sinFondos ? `Año ${sinFondos.anio}` : 'No'}</dd>
            </div>
          </dl>
          <button type="button" className="ex-descargar" onClick={descargar} disabled={descargando} aria-busy={descargando}>
            {descargando ? 'Preparando…' : 'Descargar mi expediente'}
          </button>
        </div>
      </aside>

      <main className="ex-documento">
        <header className="ex-portada">
          <p className="ex-kicker">
            {nombre.trim() ? `Expediente de ${nombre.trim()} · ` : ''}Simulación educativa · datos con fuente y fecha de verificación
          </p>
          <h1>
            Llegaste al Perú. Este es el ciclo completo: comprar dónde vivir, construir por etapas, criar, educar, trabajar y aguantar lo que no estaba
            en el plan.
          </h1>
          <p className="ex-portada-bajada">
            Cada cifra de este expediente lleva su origen y el enlace a la entidad donde se verifica. Los metrados son constantes de ingeniería; los
            precios son de mercado y hay que comprobarlos el día de la compra. Nada de esto es una cotización ni reemplaza a un profesional.
          </p>
        </header>

        {proyeccion.alertas.length > 0 ? (
          <div className="ex-alertas">
            {proyeccion.alertas.map((a) => (
              <article key={a.id} className={`ex-alerta ex-alerta-${a.severidad}`}>
                <h3>{a.titulo}</h3>
                <p>{a.mensaje}</p>
                <p className="ex-palanca">
                  <span>Qué mover</span>
                  {a.palanca}
                </p>
                <code>{a.id}</code>
              </article>
            ))}
          </div>
        ) : null}

        <Seccion
          id="partida"
          numero="00"
          titulo="Tu punto de partida"
          bajada="Todo lo que sigue se recalcula con estos valores. Ponlos lo más cerca posible de tu realidad: el ejercicio solo sirve si los números son tuyos."
        >
          <Controles perfil={perfil} onCambio={cambio} />
        </Seccion>

        <SeccionVivienda proyeccion={proyeccion} />
        <SeccionConstruccion proyeccion={proyeccion} />
        <SeccionFamilia proyeccion={proyeccion} />
        <SeccionServicios proyeccion={proyeccion} />
        <SeccionTrabajo proyeccion={proyeccion} />
        <SeccionImprevistos perfil={perfil} onCambio={cambio} />
        <SeccionProyeccion proyeccion={proyeccion} />
        <SeccionFuentes />

        <footer className="ex-pie">
          <p>
            Horizonte funciona por completo en tu navegador. No envía tus datos a ningún servidor y no guarda nada sin que lo pidas. Los enlaces salen a
            las entidades del Estado peruano; algunos de esos servicios cobran por la consulta y eso está indicado en cada caso.
          </p>
        </footer>
      </main>
    </div>
  )
}
