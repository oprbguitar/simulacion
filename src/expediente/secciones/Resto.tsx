import { CONSUMOS_REFERENCIA, FUENTES_SERVICIOS, PRECIO_KWH, PRECIO_M3_AGUA, SERVICIOS_HOGAR, boletaAgua, boletaElectrica } from '../../domain/life/catalogo/servicios'
import { COSTOS_LABORALES, FUENTES_TRABAJO, MODOS_INGRESO, RMV, TRAMOS_RENTA, impuestoRentaTrabajo, modoIngreso } from '../../domain/life/catalogo/trabajo'
import { UIT } from '../../domain/life/catalogo/vivienda'
import { IMPREVISTOS } from '../../domain/life/catalogo/imprevistos'
import { LISTA_FUENTES } from '../../domain/life/fuentes'
import type { Perfil, Proyeccion } from '../../domain/life/motor'
import { soles } from '../formato'
import { Aviso, Cifra, Enlace, Fuentes, Origenes, Seccion, TablaCostos } from '../piezas'

// ------------------------------------------------------------------ servicios

export function SeccionServicios({ proyeccion }: { proyeccion: Proyeccion }) {
  const consumo = CONSUMOS_REFERENCIA.reduce((mejor, item) =>
    Math.abs(item.personas - proyeccion.perfil.personasHogar) < Math.abs(mejor.personas - proyeccion.perfil.personasHogar) ? item : mejor,
  )
  return (
    <Seccion
      id="servicios"
      numero="04"
      titulo="Habitar la casa"
      bajada="Lo que se paga todos los meses una vez que la casa existe. Las tarifas de luz y agua están reguladas y publicadas."
    >
      <div className="ex-panel-calculo">
        <h3>Para un hogar de {proyeccion.perfil.personasHogar} personas</h3>
        <p className="ex-parrafo">Perfil de consumo más cercano: {consumo.perfil}.</p>
        <dl className="ex-datos">
          <div>
            <dt>Electricidad</dt>
            <dd>{soles(boletaElectrica(consumo.kwh))}</dd>
            <span>
              {consumo.kwh} kWh al mes · {soles(PRECIO_KWH.min)} – {soles(PRECIO_KWH.max)} por kWh
            </span>
          </div>
          <div>
            <dt>Agua y alcantarillado</dt>
            <dd>{soles(boletaAgua(consumo.m3))}</dd>
            <span>
              {consumo.m3} m³ al mes · {soles(PRECIO_M3_AGUA.min)} – {soles(PRECIO_M3_AGUA.max)} por m³
            </span>
          </div>
          <div>
            <dt>Total de servicios básicos</dt>
            <dd className="ex-dato-fuerte">{soles(boletaElectrica(consumo.kwh) + boletaAgua(consumo.m3) + 110 + 75)}</dd>
            <span>Incluye internet y arbitrios de referencia</span>
          </div>
        </dl>
      </div>

      <div className="ex-tabla-envoltura">
        <table className="ex-tabla ex-tabla-compacta">
          <thead>
            <tr>
              <th scope="col">Perfil</th>
              <th scope="col">Personas</th>
              <th scope="col">Electricidad</th>
              <th scope="col">Agua</th>
            </tr>
          </thead>
          <tbody>
            {CONSUMOS_REFERENCIA.map((c) => (
              <tr key={c.id} className={c.id === consumo.id ? 'is-activo' : undefined}>
                <th scope="row">{c.perfil}</th>
                <td className="ex-num">{c.personas}</td>
                <td className="ex-num">
                  {c.kwh} kWh <small>{soles(boletaElectrica(c.kwh))}</small>
                </td>
                <td className="ex-num">
                  {c.m3} m³ <small>{soles(boletaAgua(c.m3))}</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ex-nota-origen">
        <Origenes origen="REGULADO" /> El precio medio por kWh y por m³ es una referencia para estimar la boleta. El valor exacto está en el pliego
        tarifario vigente de tu distribuidora y en el estudio tarifario de tu EPS.
      </p>

      <h3>Todos los gastos de habitar</h3>
      <TablaCostos items={SERVICIOS_HOGAR} />

      <Fuentes items={FUENTES_SERVICIOS} titulo="Tarifas vigentes" />
    </Seccion>
  )
}

// -------------------------------------------------------------------- trabajo

export function SeccionTrabajo({ proyeccion }: { proyeccion: Proyeccion }) {
  const { perfil } = proyeccion
  const modo = modoIngreso(perfil.modoIngreso)
  const descuento = modo.descuentoMensual(perfil.ingresoMensualBruto)
  const neto = perfil.ingresoMensualBruto - descuento

  return (
    <Seccion
      id="trabajo"
      numero="05"
      titulo="De dónde sale el ingreso"
      bajada="Planilla, honorarios o negocio propio. Cada vía tiene una carga distinta y una red de protección distinta."
    >
      <div className="ex-panel-calculo">
        <h3>{modo.titulo}</h3>
        <dl className="ex-datos">
          <div>
            <dt>Ingreso bruto mensual</dt>
            <dd>{soles(perfil.ingresoMensualBruto)}</dd>
            <span>{(perfil.ingresoMensualBruto / RMV).toFixed(1)} remuneraciones mínimas vitales</span>
          </div>
          <div>
            <dt>Descuentos e impuestos</dt>
            <dd className="ex-dato-riesgo">− {soles(descuento)}</dd>
            <span>{((descuento / Math.max(1, perfil.ingresoMensualBruto)) * 100).toFixed(1)} % del bruto</span>
          </div>
          <div>
            <dt>Queda disponible</dt>
            <dd className="ex-dato-fuerte">{soles(neto)}</dd>
          </div>
        </dl>
      </div>

      <div className="ex-modos">
        {MODOS_INGRESO.map((m) => (
          <article key={m.id} className={m.id === modo.id ? 'ex-modo is-activo' : 'ex-modo'}>
            <header>
              <span className="ex-modo-num">{m.numero}</span>
              <div>
                <h4>{m.titulo}</h4>
                <small>{m.categoriaRenta}</small>
              </div>
            </header>
            <p>{m.descripcion}</p>
            <h5>Qué te descuentan</h5>
            <ul>
              {m.cargas.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <h5>Qué te protege</h5>
            <ul>
              {m.beneficios.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
            <h5>Qué te expone</h5>
            <ul className="ex-lista-riesgo">
              {m.riesgos.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <Fuentes items={m.fuentes} titulo="Consultar en la entidad" />
          </article>
        ))}
      </div>

      <h3>Impuesto a la renta de trabajo</h3>
      <p className="ex-parrafo">
        Sobre la renta bruta anual se descuentan 7 UIT ({soles(7 * UIT)} con la UIT de {soles(UIT)}) y el resto se grava por tramos progresivos.
      </p>
      <div className="ex-tabla-envoltura">
        <table className="ex-tabla ex-tabla-compacta">
          <thead>
            <tr>
              <th scope="col">Tramo</th>
              <th scope="col">En soles</th>
              <th scope="col">Tasa</th>
            </tr>
          </thead>
          <tbody>
            {TRAMOS_RENTA.map((t, i) => {
              const desde = i === 0 ? 0 : TRAMOS_RENTA[i - 1].hastaUit
              return (
                <tr key={t.hastaUit}>
                  <th scope="row">
                    {desde} – {t.hastaUit === Infinity ? 'más' : t.hastaUit} UIT
                  </th>
                  <td>
                    {soles(desde * UIT)} – {t.hastaUit === Infinity ? 'sin tope' : soles(t.hastaUit * UIT)}
                  </td>
                  <td className="ex-num">{(t.tasa * 100).toFixed(0)} %</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="ex-parrafo">
        Con tu ingreso, el impuesto anual estimado sería de{' '}
        <strong>{soles(impuestoRentaTrabajo(perfil.ingresoMensualBruto * (modo.id === 'dependiente' ? 14 : 12)))}</strong>.
      </p>

      <h3>Aportes y coberturas</h3>
      <TablaCostos items={COSTOS_LABORALES} />

      <Fuentes items={FUENTES_TRABAJO} titulo="Entidades de esta sección" />
    </Seccion>
  )
}

// ----------------------------------------------------------------- imprevistos

export function SeccionImprevistos({
  perfil,
  onCambio,
}: {
  perfil: Perfil
  onCambio: (parcial: Partial<Perfil>) => void
}) {
  const alternar = (id: string) => {
    const activos = perfil.imprevistosActivos.includes(id)
      ? perfil.imprevistosActivos.filter((x) => x !== id)
      : [...perfil.imprevistosActivos, id]
    onCambio({ imprevistosActivos: activos })
  }

  return (
    <Seccion
      id="imprevistos"
      numero="06"
      titulo="Lo que el plan no contempla"
      bajada="Actívalos para ver el mismo escenario con el golpe encima. No son predicciones: son la prueba de cuánto margen te queda."
    >
      <div className="ex-imprevistos">
        {IMPREVISTOS.map((ev) => {
          const activo = perfil.imprevistosActivos.includes(ev.id)
          return (
            <article key={ev.id} className={activo ? 'ex-imprevisto is-on' : 'ex-imprevisto'}>
              <button type="button" onClick={() => alternar(ev.id)} aria-pressed={activo}>
                <span className="ex-imprevisto-check" aria-hidden="true">
                  {activo ? '✓' : ''}
                </span>
                <span>
                  <strong>{ev.titulo}</strong>
                  <small>Frecuencia anual de referencia: {(ev.probabilidadAnual * 100).toFixed(0)} %</small>
                </span>
              </button>
              <p>{ev.detalle}</p>
              <p className="ex-imprevisto-impacto">
                <span>Impacto</span>
                <Cifra monto={ev.impacto} />
              </p>
              <h5>Qué reduce el daño</h5>
              <ul>
                {ev.mitigacion.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
              <Fuentes items={ev.fuentes} titulo="A dónde acudir" />
            </article>
          )
        })}
      </div>
      <Aviso tono="nota">
        Las frecuencias son referencias gruesas para mostrar que estos eventos existen, no probabilidades calculadas sobre tu caso. Lo que sí es
        verificable y útil es la vía institucional de cada fila.
      </Aviso>
    </Seccion>
  )
}

// -------------------------------------------------------------------- fuentes

export function SeccionFuentes() {
  const porEntidad = [...LISTA_FUENTES].sort((a, b) => a.entidad.localeCompare(b.entidad, 'es'))
  return (
    <Seccion
      id="fuentes"
      numero="08"
      titulo="De dónde sale cada dato"
      bajada={`${porEntidad.length} fuentes. Todas las direcciones se comprobaron con una petición real; la que no respondió no entró.`}
    >
      <ul className="ex-indice-fuentes">
        {porEntidad.map((f) => (
          <li key={f.url + f.titulo}>
            <Enlace fuente={f} />
            {f.nota ? <p className="ex-fuente-nota">{f.nota}</p> : null}
          </li>
        ))}
      </ul>
      <Aviso tono="atencion">
        Esta simulación es material educativo. No es una cotización, no dimensiona elementos estructurales y no reemplaza a un profesional colegiado ni a
        la consulta directa en la entidad que corresponde.
      </Aviso>
    </Seccion>
  )
}
