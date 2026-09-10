import { PRODUCTOS_CREDITO, RUTAS_VIVIENDA, UIT, capacidadEndeudamiento, costoTotalCredito } from '../../domain/life/catalogo/vivienda'
import { modoIngreso } from '../../domain/life/catalogo/trabajo'
import { FUENTES } from '../../domain/life/fuentes'
import type { Proyeccion } from '../../domain/life/motor'
import { soles } from '../formato'
import { Aviso, FichaTramite, Fuentes, Seccion, TablaCostos } from '../piezas'

export function SeccionVivienda({ proyeccion }: { proyeccion: Proyeccion }) {
  const { perfil } = proyeccion
  const ruta = RUTAS_VIVIENDA.find((r) => r.id === perfil.rutaVivienda) ?? RUTAS_VIVIENDA[0]
  const modo = modoIngreso(perfil.modoIngreso)
  const ingresoNeto = perfil.ingresoMensualBruto - modo.descuentoMensual(perfil.ingresoMensualBruto)
  const producto = PRODUCTOS_CREDITO.find((p) => p.id === (perfil.financiamiento === 'mivivienda' ? 'mivivienda' : 'hipotecario')) ?? PRODUCTOS_CREDITO[0]
  const maximo = capacidadEndeudamiento(ingresoNeto, perfil.teaAnual, perfil.plazoCreditoAnios)
  const credito = costoTotalCredito(proyeccion.montoCredito, perfil.teaAnual, perfil.plazoCreditoAnios)

  return (
    <Seccion
      id="vivienda"
      numero="01"
      titulo="Adquirir la propiedad"
      bajada="Qué se compra, cuánto cuesta formalizarlo y qué queda pendiente después de firmar."
    >
      <div className="ex-destacado">
        <h3>{ruta.titulo}</h3>
        <p>{ruta.descripcion}</p>
        <p className="ex-queda">
          <span>Lo que queda después</span>
          {ruta.loQueQueda}
        </p>
      </div>

      <h3>Lo que cuesta esta ruta</h3>
      <TablaCostos items={ruta.costos} />

      {proyeccion.costoTerreno > 0 ? (
        <div className="ex-panel-calculo">
          <h3>Con los números que pusiste</h3>
          <dl className="ex-datos">
            <div>
              <dt>Precio del inmueble</dt>
              <dd>{soles(proyeccion.costoTerreno)}</dd>
            </div>
            <div>
              <dt>Impuesto de Alcabala</dt>
              <dd>{soles(proyeccion.alcabala)}</dd>
              <span>3 % sobre el exceso de 10 UIT ({soles(10 * UIT)})</span>
            </div>
            <div>
              <dt>Gastos de cierre</dt>
              <dd>{soles(proyeccion.gastosCierre)}</dd>
              <span>Notaría, registro y trámites: 3 % a 5 % del valor</span>
            </div>
            <div>
              <dt>Desembolso el día de la compra</dt>
              <dd className="ex-dato-fuerte">
                {soles(
                  (perfil.financiamiento === 'ahorro' ? proyeccion.costoTerreno : proyeccion.costoTerreno * perfil.inicialProporcion) +
                    proyeccion.alcabala +
                    proyeccion.gastosCierre,
                )}
              </dd>
            </div>
          </dl>
        </div>
      ) : null}

      <h3>Los trámites, en orden</h3>
      <div className="ex-tramites">
        {ruta.tramites.map((tramite) => (
          <FichaTramite key={tramite.id} tramite={tramite} />
        ))}
      </div>

      <h3>Si lo financias con un crédito</h3>
      <p className="ex-parrafo">
        La tasa que aparece abajo es la que tú fijaste ({perfil.teaAnual.toFixed(2)} % TEA). Antes de tomarla como buena, consulta la serie que publica la
        SBS: es la única forma de saber si esa tasa es la que realmente ofrece el mercado hoy.
      </p>

      <div className="ex-tabla-envoltura">
        <table className="ex-tabla">
          <thead>
            <tr>
              <th scope="col">Producto</th>
              <th scope="col">TEA de referencia</th>
              <th scope="col">Inicial mínima</th>
              <th scope="col">Plazo máximo</th>
            </tr>
          </thead>
          <tbody>
            {PRODUCTOS_CREDITO.map((p) => (
              <tr key={p.id} className={p.id === producto.id ? 'is-activo' : undefined}>
                <th scope="row">
                  <strong>{p.nombre}</strong>
                  <span>{p.descripcion}</span>
                </th>
                <td>{p.teaTipica > 0 ? `${p.teaMin} – ${p.teaMax} %` : 'Subsidio, no crédito'}</td>
                <td>{`${Math.round(p.inicialMin * 100)} %`}</td>
                <td>{p.plazoMaxAnios > 0 ? `${p.plazoMaxAnios} años` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="ex-panel-calculo">
        <h4>Hasta cuánto podrías endeudarte</h4>
        <dl className="ex-datos">
          <div>
            <dt>Ingreso neto mensual estimado</dt>
            <dd>{soles(ingresoNeto)}</dd>
            <span>Después de {modo.titulo.toLowerCase()}</span>
          </div>
          <div>
            <dt>Cuota máxima sostenible</dt>
            <dd>{soles(ingresoNeto * 0.3)}</dd>
            <span>Criterio de un tercio del ingreso neto</span>
          </div>
          <div>
            <dt>Crédito máximo con esa cuota</dt>
            <dd className="ex-dato-fuerte">{soles(maximo)}</dd>
            <span>
              A {perfil.teaAnual.toFixed(2)} % TEA y {perfil.plazoCreditoAnios} años
            </span>
          </div>
        </dl>
        {proyeccion.montoCredito > 0 ? (
          <dl className="ex-datos">
            <div>
              <dt>Crédito que estás simulando</dt>
              <dd>{soles(proyeccion.montoCredito)}</dd>
            </div>
            <div>
              <dt>Cuota mensual</dt>
              <dd className={credito.cuota > ingresoNeto * 0.3 ? 'ex-dato-riesgo' : 'ex-dato-fuerte'}>{soles(credito.cuota)}</dd>
            </div>
            <div>
              <dt>Intereses pagados en total</dt>
              <dd className="ex-dato-riesgo">{soles(credito.interes)}</dd>
              <span>Sobre el capital prestado, a lo largo de {perfil.plazoCreditoAnios} años</span>
            </div>
            <div>
              <dt>Total desembolsado</dt>
              <dd>{soles(credito.total)}</dd>
            </div>
          </dl>
        ) : null}
      </div>

      <Aviso tono="atencion">
        La TEA no es lo que pagas. Lo que pagas es la TCEA, que suma el seguro de desgravamen, el seguro del inmueble, comisiones y portes. Pide siempre
        la TCEA por escrito antes de firmar.
      </Aviso>

      <ul className="ex-lista-notas">
        {producto.notas.map((nota) => (
          <li key={nota}>{nota}</li>
        ))}
      </ul>

      <Fuentes
        items={[FUENTES.sbsHipotecario, FUENTES.sbsTasas, FUENTES.fondoMivivienda, FUENTES.sunarpEnLinea, FUENTES.sunarpCalculadora, FUENTES.satLima, FUENTES.notarios, FUENTES.cofopri]}
        titulo="Consultar y verificar"
      />
    </Seccion>
  )
}
