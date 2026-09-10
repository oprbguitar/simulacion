import { useState } from 'react'
import {
  COSTOS_INDIRECTOS,
  DOSIFICACION_CONCRETO,
  FASES_OBRA,
  PRECIOS_MATERIALES,
} from '../../domain/life/catalogo/construccion'
import { FUENTES } from '../../domain/life/fuentes'
import { planDeEtapas, type Proyeccion } from '../../domain/life/motor'
import { soles } from '../formato'
import { Aviso, Cifra, FichaTramite, Fuentes, Origenes, Seccion, TablaCostos } from '../piezas'

export function SeccionConstruccion({ proyeccion }: { proyeccion: Proyeccion }) {
  const { perfil, costoObra, materiales } = proyeccion
  const [faseAbierta, setFaseAbierta] = useState<string | null>('cimentacion')
  const etapas = planDeEtapas(perfil)
  const areaTotal = perfil.areaTechada * Math.max(1, perfil.pisos)
  const totalMateriales = materiales.reduce((s, m) => s + m.subtotalTipico, 0)

  return (
    <Seccion
      id="construccion"
      numero="02"
      titulo="Construir"
      bajada="Fase por fase: cuánto material entra, cuánto cuesta hoy ese material y qué trámite corresponde a cada momento."
    >
      <div className="ex-panel-calculo">
        <h3>
          Tu obra: {areaTotal} m² techados ({perfil.pisos} {perfil.pisos === 1 ? 'piso' : 'pisos'} de {perfil.areaTechada} m²)
        </h3>
        <dl className="ex-datos">
          <div>
            <dt>Costo total estimado</dt>
            <dd className="ex-dato-fuerte">{soles(costoObra.tipico)}</dd>
            <span>
              Rango {soles(costoObra.min)} – {soles(costoObra.max)}
            </span>
          </div>
          <div>
            <dt>Por metro cuadrado</dt>
            <dd>{soles(costoObra.tipico / Math.max(1, areaTotal))}</dd>
            <span>
              {soles(costoObra.min / Math.max(1, areaTotal))} – {soles(costoObra.max / Math.max(1, areaTotal))} según acabado y región
            </span>
          </div>
          <div>
            <dt>Solo los materiales principales</dt>
            <dd>{soles(totalMateriales)}</dd>
            <span>El resto es mano de obra, encofrado, instalaciones, acabados e indirectos</span>
          </div>
          <div>
            <dt>Repartido en {perfil.duracionObraAnios} años</dt>
            <dd>{soles(costoObra.tipico / Math.max(1, perfil.duracionObraAnios))}</dd>
            <span>Promedio anual si la obra avanza parejo</span>
          </div>
        </dl>
      </div>

      <h3>Cuánto material entra en {areaTotal} m²</h3>
      <p className="ex-parrafo">
        Estas cantidades salen de metrados: constantes de ingeniería que no cambian con la inflación. Lo que sí cambia es el precio, y por eso cada fila
        lleva un enlace para verificarlo el día que vayas a comprar.
      </p>
      <div className="ex-tabla-envoltura">
        <table className="ex-tabla ex-tabla-numerica">
          <thead>
            <tr>
              <th scope="col">Material</th>
              <th scope="col">Cantidad</th>
              <th scope="col">Precio unitario</th>
              <th scope="col">Subtotal</th>
              <th scope="col">Verificar precio</th>
            </tr>
          </thead>
          <tbody>
            {materiales.map((item) => (
              <tr key={item.material}>
                <th scope="row">
                  <strong>{item.material}</strong>
                  <span>{item.fase}</span>
                </th>
                <td className="ex-num">
                  {item.cantidad.toLocaleString('es-PE')} <small>{item.unidad}</small>
                </td>
                <td className="ex-num">
                  {soles(item.precioUnitario.tipico)}
                  <small>
                    {soles(item.precioUnitario.min)} – {soles(item.precioUnitario.max)}
                  </small>
                </td>
                <td className="ex-num">
                  <strong>{soles(item.subtotalTipico)}</strong>
                  <small>
                    {soles(item.subtotalMin)} – {soles(item.subtotalMax)}
                  </small>
                </td>
                <td className="ex-td-fuentes">
                  <a href={item.precioUnitario.verificarEn} target="_blank" rel="noreferrer noopener">
                    Ver precio
                  </a>
                </td>
              </tr>
            ))}
            <tr className="ex-fila-total">
              <th scope="row">Total de materiales principales</th>
              <td />
              <td />
              <td className="ex-num">
                <strong>{soles(totalMateriales)}</strong>
              </td>
              <td />
            </tr>
          </tbody>
        </table>
      </div>
      <Aviso tono="nota">
        Faltan en esta tabla el encofrado, los alambres, los aditivos, las tuberías, los aparatos sanitarios y los acabados: por eso el total de
        materiales es mucho menor que el costo de obra. La mano de obra sola suele pesar entre un tercio y la mitad del costo directo.
      </Aviso>

      <h3>Dosificación del concreto</h3>
      <div className="ex-tabla-envoltura">
        <table className="ex-tabla ex-tabla-numerica">
          <thead>
            <tr>
              <th scope="col">Resistencia</th>
              <th scope="col">Dónde se usa</th>
              <th scope="col">Cemento</th>
              <th scope="col">Arena gruesa</th>
              <th scope="col">Piedra chancada</th>
            </tr>
          </thead>
          <tbody>
            {DOSIFICACION_CONCRETO.map((d) => (
              <tr key={d.resistencia}>
                <th scope="row">{d.resistencia}</th>
                <td>{d.uso}</td>
                <td className="ex-num">
                  {d.bolsas} <small>bolsas / m³</small>
                </td>
                <td className="ex-num">
                  {d.arena} <small>m³ / m³</small>
                </td>
                <td className="ex-num">
                  {d.piedra} <small>m³ / m³</small>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ex-nota-origen">
        <Origenes origen="TECNICO" /> Dosificaciones de referencia para agregados de Lima. El diseño de mezcla definitivo lo define el proyecto
        estructural y el ensayo de los agregados de la zona.
      </p>

      <h3>Las diez fases, en orden</h3>
      <ol className="ex-fases">
        {FASES_OBRA.map((fase) => {
          const etapa = etapas.find((e) => e.fase.id === fase.id)
          const abierta = faseAbierta === fase.id
          return (
            <li key={fase.id} className={abierta ? 'ex-fase is-abierta' : 'ex-fase'}>
              <button type="button" onClick={() => setFaseAbierta(abierta ? null : fase.id)} aria-expanded={abierta}>
                <span className="ex-fase-pct">{Math.round(fase.participacion * 100)} %</span>
                <span className="ex-fase-nombre">
                  <strong>{fase.nombre}</strong>
                  <small>{fase.resumen}</small>
                </span>
                <span className="ex-fase-costo">
                  {soles(etapa?.costo ?? 0)}
                  <small>año {etapa?.anio ?? '—'}</small>
                </span>
              </button>
              {abierta ? (
                <div className="ex-fase-cuerpo">
                  <p className="ex-fase-m2">
                    Costo directo por m² techado: <Cifra monto={fase.costoPorM2} />
                  </p>

                  {fase.insumos.length > 0 ? (
                    <>
                      <h5>Metrado de la fase</h5>
                      <div className="ex-tabla-envoltura">
                        <table className="ex-tabla ex-tabla-compacta">
                          <thead>
                            <tr>
                              <th scope="col">Material o partida</th>
                              <th scope="col">Cantidad</th>
                              <th scope="col">Por</th>
                            </tr>
                          </thead>
                          <tbody>
                            {fase.insumos.map((insumo) => (
                              <tr key={insumo.material}>
                                <th scope="row">
                                  {insumo.material}
                                  {insumo.nota ? <span>{insumo.nota}</span> : null}
                                </th>
                                <td className="ex-num">
                                  {insumo.cantidad} <small>{insumo.unidad}</small>
                                </td>
                                <td>{insumo.por}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : null}

                  {fase.tramites.length > 0 ? (
                    <div className="ex-tramites">
                      {fase.tramites.map((tramite) => (
                        <FichaTramite key={tramite.id} tramite={tramite} />
                      ))}
                    </div>
                  ) : null}

                  {fase.advertencias.length > 0 ? (
                    <ul className="ex-lista-advertencias">
                      {fase.advertencias.map((a) => (
                        <li key={a}>{a}</li>
                      ))}
                    </ul>
                  ) : null}

                  <Fuentes items={fase.fuentes} titulo="Norma y fuente de esta fase" />
                </div>
              ) : null}
            </li>
          )
        })}
      </ol>

      <h3>Precios unitarios de referencia</h3>
      <div className="ex-tabla-envoltura">
        <table className="ex-tabla ex-tabla-numerica">
          <thead>
            <tr>
              <th scope="col">Material</th>
              <th scope="col">Unidad</th>
              <th scope="col">Rango de precio</th>
              <th scope="col">Verificar</th>
            </tr>
          </thead>
          <tbody>
            {PRECIOS_MATERIALES.map((p) => (
              <tr key={p.id}>
                <th scope="row">
                  <strong>{p.material}</strong>
                  {p.nota ? <span>{p.nota}</span> : null}
                </th>
                <td>{p.unidad}</td>
                <td className="ex-num">
                  <strong>{soles(p.tipico)}</strong>
                  <small>
                    {soles(p.min)} – {soles(p.max)}
                  </small>
                </td>
                <td className="ex-td-fuentes">
                  <a href={p.verificarEn} target="_blank" rel="noreferrer noopener">
                    Ver
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ex-nota-origen">
        <Origenes origen="MERCADO" /> Referencias de Lima para 2026. Los precios de materiales de construcción se mueven varias veces al año: el índice
        del INEI sirve para actualizarlos sin recotizar todo.
      </p>

      <h3>Lo que se olvida presupuestar</h3>
      <TablaCostos items={COSTOS_INDIRECTOS} />

      <Fuentes
        items={[FUENTES.rne, FUENTES.valoresUnitariosCap, FUENTES.valoresUnitariosRm, FUENTES.licenciaEdificacionA, FUENTES.ineiPrecios, FUENTES.capeco]}
        titulo="Normativa y precios de referencia"
      />
    </Seccion>
  )
}
