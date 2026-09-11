import { IMPREVISTOS } from '../domain/life/catalogo/imprevistos'
import { MODOS_INGRESO } from '../domain/life/catalogo/trabajo'
import { RUTAS_VIVIENDA } from '../domain/life/catalogo/vivienda'
import type { Proyeccion } from '../domain/life/motor'
import { soles } from './formato'
import { DocumentoCompletoContext } from './contexto'
import { Seccion } from './piezas'
import { SeccionConstruccion } from './secciones/Construccion'
import { SeccionFamilia } from './secciones/Familia'
import { SeccionProyeccion } from './secciones/Proyeccion'
import { SeccionFuentes, SeccionImprevistos, SeccionServicios, SeccionTrabajo } from './secciones/Resto'
import { SeccionVivienda } from './secciones/Vivienda'

const REGION: Record<string, string> = { lima: 'Lima y Callao', costa: 'Costa', sierra: 'Sierra', selva: 'Selva' }
const ACABADO: Record<string, string> = { basico: 'Básico', medio: 'Medio', alto: 'Alto' }
const FINANCIAMIENTO: Record<string, string> = { ahorro: 'Con ahorro propio', hipotecario: 'Crédito hipotecario', mivivienda: 'Nuevo Crédito MIVIVIENDA' }

/**
 * El expediente como documento cerrado: lo que eligió la persona, el
 * resultado de su ruta y todo el detalle con fuentes, sin nada plegado.
 * Es lo que se descarga desde el final de La Ruta.
 */
export function DocumentoExpediente({ proyeccion, nombre, fecha }: { proyeccion: Proyeccion; nombre: string; fecha: Date }) {
  const { perfil } = proyeccion
  const final = proyeccion.anios.at(-1)
  const sinFondos = proyeccion.anios.find((a) => a.ahorroAcumulado < 0)
  const ruta = RUTAS_VIVIENDA.find((r) => r.id === perfil.rutaVivienda)
  const modo = MODOS_INGRESO.find((m) => m.id === perfil.modoIngreso)
  const imprevistos = IMPREVISTOS.filter((i) => perfil.imprevistosActivos.includes(i.id))
  const compra = perfil.rutaVivienda === 'terreno' || perfil.rutaVivienda === 'casa-construida' || perfil.rutaVivienda === 'departamento'

  const elecciones: { etiqueta: string; valor: string }[] = [
    { etiqueta: 'Edad al empezar', valor: `${perfil.edadInicial} años` },
    { etiqueta: 'Región', valor: REGION[perfil.region] ?? perfil.region },
    { etiqueta: 'Personas en el hogar', valor: String(perfil.personasHogar) },
    { etiqueta: 'Ingreso mensual bruto', valor: soles(perfil.ingresoMensualBruto) },
    { etiqueta: 'Cómo generas el ingreso', valor: modo?.titulo ?? perfil.modoIngreso },
    { etiqueta: 'Ahorro inicial', valor: soles(perfil.ahorroInicial) },
    { etiqueta: 'Gasto esencial mensual', valor: soles(perfil.gastoEsencialMensual) },
    { etiqueta: 'Dónde vives', valor: ruta?.titulo ?? perfil.rutaVivienda },
    ...(compra
      ? [
          { etiqueta: 'Precio del inmueble', valor: soles(perfil.precioInmueble) },
          { etiqueta: 'Financiamiento', valor: FINANCIAMIENTO[perfil.financiamiento] ?? perfil.financiamiento },
          ...(perfil.financiamiento !== 'ahorro'
            ? [
                { etiqueta: 'Cuota inicial', valor: `${Math.round(perfil.inicialProporcion * 100)} %` },
                { etiqueta: 'Crédito', valor: `${perfil.plazoCreditoAnios} años a ${perfil.teaAnual.toFixed(2)} % TEA` },
              ]
            : []),
          { etiqueta: 'Año de compra', valor: `Año ${perfil.anioCompra}` },
        ]
      : []),
    { etiqueta: 'Obra', valor: `${perfil.areaTechada} m² × ${perfil.pisos} ${perfil.pisos === 1 ? 'piso' : 'pisos'}, acabado ${ACABADO[perfil.nivelAcabado]?.toLowerCase()}` },
    { etiqueta: 'Calendario de obra', valor: `Empieza el año ${perfil.anioInicioObra} y dura ${perfil.duracionObraAnios} años` },
    {
      etiqueta: 'Hijos',
      valor:
        perfil.hijos.length === 0
          ? 'Ninguno en la proyección'
          : perfil.hijos
              .map((h, i) => `${i + 1}.º nace el año ${h.anioNacimiento}, educación ${h.educacion}${h.saludPrivada ? ', salud privada' : ''}`)
              .join(' · '),
    },
    { etiqueta: 'Imprevistos activados', valor: imprevistos.length === 0 ? 'Ninguno' : imprevistos.map((i) => i.titulo).join(' · ') },
    { etiqueta: 'Horizonte', valor: `${perfil.horizonteAnios} años, hasta los ${perfil.edadInicial + perfil.horizonteAnios}` },
  ]

  return (
    <DocumentoCompletoContext.Provider value={true}>
      <div className="ex-descarga">
        <main className="ex-documento">
          <header className="ex-portada">
            <p className="ex-kicker">
              Expediente de vida · Perú · generado el {fecha.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
            <h1>{nombre.trim() ? `La ruta de ${nombre.trim()}` : 'Tu ruta, de principio a fin'}</h1>
            <p className="ex-portada-bajada">
              Todo lo que elegiste en La Ruta, lo que resulta de esas decisiones en {perfil.horizonteAnios} años y el detalle completo con la fuente
              de cada cifra. Es material educativo: no es una cotización ni reemplaza a un profesional.
            </p>
          </header>

          <Seccion id="elecciones" numero="00" titulo="Lo que elegiste" bajada="Tus decisiones, tal como quedaron al descargar el expediente.">
            <div className="ex-panel-calculo">
              <h3>Resultado de tu ruta</h3>
              <dl className="ex-datos">
                <div>
                  <dt>Patrimonio al año {perfil.horizonteAnios}</dt>
                  <dd className={(final?.patrimonio ?? 0) < 0 ? 'ex-dato-riesgo' : 'ex-dato-fuerte'}>{soles(final?.patrimonio ?? 0)}</dd>
                </div>
                <div>
                  <dt>Ahorro líquido al final</dt>
                  <dd>{soles(final?.ahorroAcumulado ?? 0)}</dd>
                </div>
                <div>
                  <dt>Costo de la obra</dt>
                  <dd>{soles(proyeccion.costoObra.tipico)}</dd>
                </div>
                <div>
                  <dt>Te quedas sin fondos</dt>
                  <dd className={sinFondos ? 'ex-dato-riesgo' : undefined}>{sinFondos ? `Año ${sinFondos.anio}, a los ${sinFondos.edad}` : 'Nunca'}</dd>
                </div>
              </dl>
            </div>
            <dl className="ex-elecciones">
              {elecciones.map((e) => (
                <div key={e.etiqueta}>
                  <dt>{e.etiqueta}</dt>
                  <dd>{e.valor}</dd>
                </div>
              ))}
            </dl>
          </Seccion>

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
                </article>
              ))}
            </div>
          ) : null}

          <SeccionVivienda proyeccion={proyeccion} />
          <SeccionConstruccion proyeccion={proyeccion} />
          <SeccionFamilia proyeccion={proyeccion} />
          <SeccionServicios proyeccion={proyeccion} />
          <SeccionTrabajo proyeccion={proyeccion} />
          <SeccionImprevistos perfil={perfil} onCambio={() => undefined} />
          <SeccionProyeccion proyeccion={proyeccion} />
          <SeccionFuentes />

          <footer className="ex-pie">
            <p>
              Generado en tu navegador con Horizonte (simulacion.amauta.online). No se envió ningún dato a un servidor. Verifica cada cifra en el enlace
              de la entidad antes de tomar una decisión.
            </p>
          </footer>
        </main>
      </div>
    </DocumentoCompletoContext.Provider>
  )
}
