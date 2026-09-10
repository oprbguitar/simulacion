import { useState } from 'react'
import type { AnioProyeccion, Proyeccion } from '../../domain/life/motor'
import { soles, solesCorto } from '../formato'
import { Seccion } from '../piezas'

const ETIQUETA_EVENTO: Record<string, string> = {
  vivienda: 'Vivienda',
  obra: 'Obra',
  familia: 'Familia',
  educacion: 'Educación',
  trabajo: 'Trabajo',
  imprevisto: 'Imprevisto',
  servicio: 'Servicios',
}

function Barra({ anio, escala }: { anio: AnioProyeccion; escala: number }) {
  const alto = Math.min(100, (Math.abs(anio.patrimonio) / escala) * 100)
  const negativo = anio.patrimonio < 0
  const sinFondos = anio.ahorroAcumulado < 0
  return (
    <span
      className={`ex-barra${negativo ? ' es-negativa' : ''}${sinFondos ? ' es-sin-fondos' : ''}`}
      style={{ height: `${Math.max(2, alto)}%` }}
      aria-hidden="true"
    />
  )
}

export function SeccionProyeccion({ proyeccion }: { proyeccion: Proyeccion }) {
  const { anios, perfil } = proyeccion
  const [seleccionado, setSeleccionado] = useState(0)
  const anio = anios[Math.min(seleccionado, anios.length - 1)]
  const escala = Math.max(...anios.map((a) => Math.abs(a.patrimonio)), 1)
  const sinFondos = anios.find((a) => a.ahorroAcumulado < 0)
  const final = anios.at(-1)

  const filas: { clave: keyof AnioProyeccion; etiqueta: string }[] = [
    { clave: 'descuentosAnual', etiqueta: 'Impuestos y aportes' },
    { clave: 'gastoEsencialAnual', etiqueta: 'Gasto esencial del hogar' },
    { clave: 'gastoViviendaAnual', etiqueta: 'Vivienda (compra, alquiler o aporte)' },
    { clave: 'cuotaCreditoAnual', etiqueta: 'Cuota del crédito' },
    { clave: 'gastoObraAnual', etiqueta: 'Obra' },
    { clave: 'gastoServiciosAnual', etiqueta: 'Servicios del hogar' },
    { clave: 'gastoHijosAnual', etiqueta: 'Crianza y salud de los hijos' },
    { clave: 'gastoEducacionAnual', etiqueta: 'Educación' },
    { clave: 'imprevistosAnual', etiqueta: 'Imprevistos activados' },
  ]

  return (
    <Seccion
      id="proyeccion"
      numero="07"
      titulo={`Los próximos ${perfil.horizonteAnios} años`}
      bajada="Todo lo anterior, colocado en el tiempo. Haz clic en un año para ver qué pasa ese año y de dónde sale cada cifra."
    >
      <div className="ex-resumen-proyeccion">
        <div>
          <span>Patrimonio al año {perfil.horizonteAnios}</span>
          <strong className={(final?.patrimonio ?? 0) < 0 ? 'ex-dato-riesgo' : undefined}>{soles(final?.patrimonio ?? 0)}</strong>
        </div>
        <div>
          <span>Ahorro líquido al final</span>
          <strong className={(final?.ahorroAcumulado ?? 0) < 0 ? 'ex-dato-riesgo' : undefined}>{soles(final?.ahorroAcumulado ?? 0)}</strong>
        </div>
        <div>
          <span>Primer año sin fondos</span>
          <strong className={sinFondos ? 'ex-dato-riesgo' : undefined}>{sinFondos ? `Año ${sinFondos.anio} · ${sinFondos.edad} años` : 'Ninguno'}</strong>
        </div>
      </div>

      <div className="ex-grafico" role="group" aria-label="Patrimonio proyectado por año">
        {anios.map((a) => (
          <button
            key={a.anio}
            type="button"
            className={a.anio === anio.anio ? 'ex-grafico-col is-on' : 'ex-grafico-col'}
            onClick={() => setSeleccionado(a.anio)}
            aria-pressed={a.anio === anio.anio}
            title={`Año ${a.anio} · ${a.edad} años · patrimonio ${soles(a.patrimonio)}`}
          >
            <Barra anio={a} escala={escala} />
            {a.eventos.length > 0 ? <span className="ex-marca-evento" aria-hidden="true" /> : null}
            <span className="ex-grafico-etiqueta">{a.anio % 5 === 0 ? a.anio : ''}</span>
          </button>
        ))}
      </div>
      <p className="ex-leyenda">
        <span className="ex-leyenda-item ex-leyenda-positiva">Patrimonio positivo</span>
        <span className="ex-leyenda-item ex-leyenda-negativa">Patrimonio negativo</span>
        <span className="ex-leyenda-item ex-leyenda-sinfondos">Año con ahorro líquido en cero o negativo</span>
        <span className="ex-leyenda-item ex-leyenda-evento">Año con hitos</span>
      </p>

      <div className="ex-detalle-anio">
        <header>
          <h3>
            Año {anio.anio} <span>· {anio.edad} años</span>
          </h3>
          <p className={anio.flujoAnual < 0 ? 'ex-dato-riesgo' : 'ex-dato-fuerte'}>
            Flujo del año: {anio.flujoAnual >= 0 ? '+' : ''}
            {soles(anio.flujoAnual)}
          </p>
        </header>

        <div className="ex-dos-columnas">
          <div className="ex-tabla-envoltura">
            <table className="ex-tabla ex-tabla-compacta ex-tabla-numerica">
              <tbody>
                <tr className="ex-fila-ingreso">
                  <th scope="row">Ingreso del año</th>
                  <td className="ex-num">{soles(anio.ingresoAnual)}</td>
                </tr>
                {filas
                  .filter((f) => (anio[f.clave] as number) > 0)
                  .map((f) => (
                    <tr key={f.clave}>
                      <th scope="row">{f.etiqueta}</th>
                      <td className="ex-num">− {soles(anio[f.clave] as number)}</td>
                    </tr>
                  ))}
                <tr className="ex-fila-total">
                  <th scope="row">Queda</th>
                  <td className="ex-num">{soles(anio.flujoAnual)}</td>
                </tr>
                <tr>
                  <th scope="row">Ahorro acumulado</th>
                  <td className={anio.ahorroAcumulado < 0 ? 'ex-num ex-dato-riesgo' : 'ex-num'}>{soles(anio.ahorroAcumulado)}</td>
                </tr>
                <tr>
                  <th scope="row">Deuda pendiente</th>
                  <td className="ex-num">{soles(anio.deudaPendiente)}</td>
                </tr>
                <tr className="ex-fila-total">
                  <th scope="row">Patrimonio</th>
                  <td className="ex-num">{soles(anio.patrimonio)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="ex-eventos">
            <h4>Qué pasa este año</h4>
            {anio.eventos.length === 0 ? (
              <p className="ex-vacio">Sin hitos. El año transcurre con el flujo de siempre.</p>
            ) : (
              <ul>
                {anio.eventos.map((ev, i) => (
                  <li key={`${ev.titulo}-${i}`} className={`ex-evento ex-evento-${ev.tipo}`}>
                    <span className="ex-evento-tipo">{ETIQUETA_EVENTO[ev.tipo]}</span>
                    <strong>{ev.titulo}</strong>
                    {ev.monto ? <span className="ex-evento-monto">{soles(ev.monto)}</span> : null}
                    <p>{ev.detalle}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      <h3>Todos los años</h3>
      <div className="ex-tabla-envoltura ex-tabla-scroll">
        <table className="ex-tabla ex-tabla-compacta ex-tabla-numerica">
          <thead>
            <tr>
              <th scope="col">Año</th>
              <th scope="col">Edad</th>
              <th scope="col">Ingreso</th>
              <th scope="col">Obra</th>
              <th scope="col">Hijos</th>
              <th scope="col">Educación</th>
              <th scope="col">Flujo</th>
              <th scope="col">Ahorro</th>
              <th scope="col">Patrimonio</th>
            </tr>
          </thead>
          <tbody>
            {anios.map((a) => (
              <tr key={a.anio} className={a.anio === anio.anio ? 'is-activo' : undefined} onClick={() => setSeleccionado(a.anio)}>
                <th scope="row">{a.anio}</th>
                <td className="ex-num">{a.edad}</td>
                <td className="ex-num">{solesCorto(a.ingresoAnual)}</td>
                <td className="ex-num">{a.gastoObraAnual ? solesCorto(a.gastoObraAnual) : '—'}</td>
                <td className="ex-num">{a.gastoHijosAnual ? solesCorto(a.gastoHijosAnual) : '—'}</td>
                <td className="ex-num">{a.gastoEducacionAnual ? solesCorto(a.gastoEducacionAnual) : '—'}</td>
                <td className={a.flujoAnual < 0 ? 'ex-num ex-dato-riesgo' : 'ex-num'}>{solesCorto(a.flujoAnual)}</td>
                <td className={a.ahorroAcumulado < 0 ? 'ex-num ex-dato-riesgo' : 'ex-num'}>{solesCorto(a.ahorroAcumulado)}</td>
                <td className="ex-num">{solesCorto(a.patrimonio)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Seccion>
  )
}
