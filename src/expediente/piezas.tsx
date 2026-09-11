import { Children, isValidElement, useContext, type ReactNode } from 'react'
import type { Fuente, ItemCosto, Monto, Origen, Tramite } from '../domain/life/tipos'
import { PlegadoContext } from './contexto'

/** Piezas compartidas del expediente. Nada de esto decide layout: solo formato. */

export function Plegable({
  titulo,
  variante,
  children,
}: {
  titulo: ReactNode
  variante?: 'compacto' | 'fuentes'
  children: ReactNode
}) {
  return (
    <details className={variante ? `ex-plegable ex-plegable-${variante}` : 'ex-plegable'}>
      <summary>
        <span>{titulo}</span>
      </summary>
      <div className="ex-plegable-cuerpo">{children}</div>
    </details>
  )
}

/**
 * Agrupa los hijos directos de una sección bajo cada <h3>. Lo que va antes
 * del primer <h3> queda visible como resumen; unas Fuentes al final forman
 * su propio bloque.
 */
function agrupar(children: ReactNode): ReactNode {
  const hijos = Children.toArray(children)
  const resumen: ReactNode[] = []
  const grupos: { titulo: ReactNode; variante?: 'fuentes'; items: ReactNode[] }[] = []

  hijos.forEach((hijo, indice) => {
    if (isValidElement(hijo) && hijo.type === 'h3') {
      grupos.push({ titulo: (hijo.props as { children?: ReactNode }).children, items: [] })
    } else if (isValidElement(hijo) && hijo.type === Fuentes && indice === hijos.length - 1) {
      grupos.push({ titulo: (hijo.props as { titulo?: string }).titulo ?? 'Consultar en la entidad', variante: 'fuentes', items: [hijo] })
    } else if (grupos.length > 0) {
      grupos[grupos.length - 1].items.push(hijo)
    } else {
      resumen.push(hijo)
    }
  })

  return (
    <>
      {resumen}
      {grupos.length > 0 ? (
        <div className="ex-plegables">
          {grupos.map((grupo, i) => (
            <Plegable key={i} titulo={grupo.titulo} variante={grupo.variante}>
              {grupo.items}
            </Plegable>
          ))}
        </div>
      ) : null}
    </>
  )
}

const ETIQUETA_ORIGEN: Record<Origen, string> = {
  OFICIAL: 'Oficial',
  REGULADO: 'Regulado',
  MERCADO: 'Mercado',
  TECNICO: 'Técnico',
  ESTIMADO: 'Estimado',
}

const EXPLICA_ORIGEN: Record<Origen, string> = {
  OFICIAL: 'Publicado por una entidad del Estado: ley, resolución, tarifario o TUPA.',
  REGULADO: 'Fijado o supervisado por un regulador sectorial.',
  MERCADO: 'Precio observado en el mercado. Cambia rápido: verifica antes de usarlo.',
  TECNICO: 'Constante de ingeniería: metrado o dosificación. No se mueve con la inflación.',
  ESTIMADO: 'Supuesto del simulador para poder cerrar el cálculo. Es el dato más débil.',
}

export function Origenes({ origen }: { origen: Origen }) {
  return (
    <span className={`ex-origen ex-origen-${origen.toLowerCase()}`} title={EXPLICA_ORIGEN[origen]}>
      {ETIQUETA_ORIGEN[origen]}
    </span>
  )
}

export function Enlace({ fuente }: { fuente: Fuente }) {
  return (
    <a className="ex-fuente" href={fuente.url} target="_blank" rel="noreferrer noopener">
      <span className="ex-fuente-entidad">{fuente.entidad}</span>
      <span className="ex-fuente-titulo">{fuente.titulo}</span>
      <span className="ex-fuente-meta">verificado {fuente.verificadoEl}</span>
    </a>
  )
}

export function Fuentes({ items, titulo = 'Consultar en la entidad' }: { items: readonly Fuente[]; titulo?: string }) {
  if (items.length === 0) return null
  return (
    <div className="ex-fuentes">
      <h4>{titulo}</h4>
      <ul>
        {items.map((fuente) => (
          <li key={fuente.url + fuente.titulo}>
            <Enlace fuente={fuente} />
            {fuente.nota ? <p className="ex-fuente-nota">{fuente.nota}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** Muestra un monto respetando su rango: nunca convierte un rango en certeza. */
export function Cifra({ monto }: { monto: Monto }) {
  const esProporcion = monto.unidad.startsWith('proporción')
  const fmt = (v: number) => (esProporcion ? `${(v * 100).toFixed(1)} %` : Math.round(v).toLocaleString('es-PE'))
  const hayRango = monto.min !== undefined && monto.max !== undefined && (monto.min !== monto.tipico || monto.max !== monto.tipico)
  return (
    <span className="ex-cifra">
      <strong>{fmt(monto.tipico)}</strong>
      {hayRango ? (
        <span className="ex-cifra-rango">
          {fmt(monto.min as number)} – {fmt(monto.max as number)}
        </span>
      ) : null}
      <span className="ex-cifra-unidad">{monto.unidad}</span>
    </span>
  )
}

export function TablaCostos({ items }: { items: ItemCosto[] }) {
  return (
    <div className="ex-tabla-envoltura">
      <table className="ex-tabla">
        <thead>
          <tr>
            <th scope="col">Concepto</th>
            <th scope="col">Monto</th>
            <th scope="col">Origen</th>
            <th scope="col">Dónde verificar</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <th scope="row">
                <strong>{item.etiqueta}</strong>
                <span>{item.descripcion}</span>
                {item.advertencia ? <em className="ex-advertencia">{item.advertencia}</em> : null}
              </th>
              <td>
                <Cifra monto={item.monto} />
              </td>
              <td>
                <Origenes origen={item.origen} />
              </td>
              <td className="ex-td-fuentes">
                {item.fuentes.map((fuente) => (
                  <a key={fuente.url} href={fuente.url} target="_blank" rel="noreferrer noopener">
                    {fuente.entidad}
                  </a>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function FichaTramite({ tramite }: { tramite: Tramite }) {
  return (
    <article className="ex-tramite">
      <header>
        <h4>{tramite.titulo}</h4>
        <p className="ex-tramite-entidad">
          {tramite.entidad}
          {tramite.plazo ? <span> · {tramite.plazo}</span> : null}
        </p>
      </header>
      <p>{tramite.detalle}</p>
      {tramite.costo ? (
        <p className="ex-tramite-costo">
          <span>Costo</span>
          <Cifra monto={tramite.costo} />
          <Origenes origen={tramite.origen} />
        </p>
      ) : null}
      {tramite.requisitos?.length ? (
        <>
          <h5>Qué te van a pedir</h5>
          <ol className="ex-requisitos">
            {tramite.requisitos.map((req) => (
              <li key={req}>{req}</li>
            ))}
          </ol>
        </>
      ) : null}
      <Fuentes items={tramite.fuentes} titulo="Hacer el trámite / consultar" />
    </article>
  )
}

export function Seccion({
  id,
  numero,
  titulo,
  bajada,
  children,
}: {
  id: string
  numero: string
  titulo: string
  bajada: string
  children: ReactNode
}) {
  const plegado = useContext(PlegadoContext)
  return (
    <section className="ex-seccion" id={id} aria-labelledby={`${id}-titulo`}>
      <header className="ex-seccion-head">
        <span className="ex-seccion-numero">{numero}</span>
        <div>
          <h2 id={`${id}-titulo`}>{titulo}</h2>
          <p>{bajada}</p>
        </div>
      </header>
      {plegado ? agrupar(children) : children}
    </section>
  )
}

export function Aviso({ tono = 'nota', children }: { tono?: 'critica' | 'atencion' | 'nota'; children: ReactNode }) {
  return <p className={`ex-aviso ex-aviso-${tono}`}>{children}</p>
}
