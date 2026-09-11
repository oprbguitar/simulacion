import type { Perfil } from '../domain/life/motor'
import { MODOS_INGRESO } from '../domain/life/catalogo/trabajo'
import { RUTAS_VIVIENDA } from '../domain/life/catalogo/vivienda'
import { useContext } from 'react'
import { soles } from './formato'
import { PlegadoContext } from './contexto'
import { Plegable } from './piezas'

interface Props {
  perfil: Perfil
  onCambio: (parcial: Partial<Perfil>) => void
}

const REGIONES: { id: Perfil['region']; label: string }[] = [
  { id: 'lima', label: 'Lima y Callao' },
  { id: 'costa', label: 'Costa' },
  { id: 'sierra', label: 'Sierra' },
  { id: 'selva', label: 'Selva' },
]

const ACABADOS: { id: Perfil['nivelAcabado']; label: string; nota: string }[] = [
  { id: 'basico', label: 'Básico', nota: 'Cemento pulido, puertas simples, sin enchapes' },
  { id: 'medio', label: 'Medio', nota: 'Cerámico, melamina, aparatos de gama media' },
  { id: 'alto', label: 'Alto', nota: 'Porcelanato, carpintería a medida, griferías de gama alta' },
]

function Campo({
  etiqueta,
  ayuda,
  children,
}: {
  etiqueta: string
  ayuda?: string
  children: React.ReactNode
}) {
  return (
    <label className="ex-campo">
      <span className="ex-campo-etiqueta">{etiqueta}</span>
      {children}
      {ayuda ? <small>{ayuda}</small> : null}
    </label>
  )
}

/** Un bloque del formulario. Dentro del cajón de La Ruta se pliega. */
function Grupo({ leyenda, children }: { leyenda: string; children: React.ReactNode }) {
  const plegado = useContext(PlegadoContext)
  const campos = (
    <fieldset>
      <legend>{leyenda}</legend>
      {children}
    </fieldset>
  )
  return plegado ? <Plegable titulo={leyenda}>{campos}</Plegable> : campos
}

export function Controles({ perfil, onCambio }: Props) {
  const num = (valor: string) => {
    const n = Number(valor)
    return Number.isFinite(n) ? n : 0
  }

  return (
    <div className="ex-controles">
      <Grupo leyenda="Quién eres hoy">
        <div className="ex-grid-campos">
          <Campo etiqueta="Edad">
            <input type="number" min={16} max={70} value={perfil.edadInicial} onChange={(e) => onCambio({ edadInicial: num(e.target.value) })} />
          </Campo>
          <Campo etiqueta="Dónde vives">
            <select value={perfil.region} onChange={(e) => onCambio({ region: e.target.value as Perfil['region'] })}>
              {REGIONES.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </Campo>
          <Campo etiqueta="Personas en el hogar">
            <input type="number" min={1} max={10} value={perfil.personasHogar} onChange={(e) => onCambio({ personasHogar: num(e.target.value) })} />
          </Campo>
          <Campo etiqueta="Ingreso mensual bruto" ayuda="Antes de descuentos e impuestos">
            <input type="number" min={0} step={100} value={perfil.ingresoMensualBruto} onChange={(e) => onCambio({ ingresoMensualBruto: num(e.target.value) })} />
          </Campo>
          <Campo etiqueta="Cómo generas ese ingreso">
            <select value={perfil.modoIngreso} onChange={(e) => onCambio({ modoIngreso: e.target.value as Perfil['modoIngreso'] })}>
              {MODOS_INGRESO.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.titulo}
                </option>
              ))}
            </select>
          </Campo>
          <Campo etiqueta="Ahorro disponible hoy">
            <input type="number" min={0} step={500} value={perfil.ahorroInicial} onChange={(e) => onCambio({ ahorroInicial: num(e.target.value) })} />
          </Campo>
          <Campo etiqueta="Gasto esencial mensual" ayuda="Alimentación, transporte, salud y deudas de consumo">
            <input type="number" min={0} step={100} value={perfil.gastoEsencialMensual} onChange={(e) => onCambio({ gastoEsencialMensual: num(e.target.value) })} />
          </Campo>
          <Campo etiqueta="Horizonte de la proyección">
            <select value={perfil.horizonteAnios} onChange={(e) => onCambio({ horizonteAnios: num(e.target.value) })}>
              <option value={10}>10 años</option>
              <option value={20}>20 años</option>
              <option value={30}>30 años</option>
            </select>
          </Campo>
        </div>
      </Grupo>

      <Grupo leyenda="Cómo llegas a la vivienda">
        <div className="ex-opciones">
          {RUTAS_VIVIENDA.map((ruta) => (
            <button
              key={ruta.id}
              type="button"
              className={perfil.rutaVivienda === ruta.id ? 'ex-opcion is-on' : 'ex-opcion'}
              aria-pressed={perfil.rutaVivienda === ruta.id}
              onClick={() => onCambio({ rutaVivienda: ruta.id })}
            >
              <strong>{ruta.titulo}</strong>
              <small>{ruta.descripcion}</small>
            </button>
          ))}
        </div>
        <div className="ex-grid-campos">
          <Campo etiqueta="Precio del inmueble o terreno">
            <input type="number" min={0} step={1000} value={perfil.precioInmueble} onChange={(e) => onCambio({ precioInmueble: num(e.target.value) })} />
          </Campo>
          <Campo etiqueta="Año en que compras" ayuda="0 = hoy">
            <input type="number" min={0} max={perfil.horizonteAnios - 1} value={perfil.anioCompra} onChange={(e) => onCambio({ anioCompra: num(e.target.value) })} />
          </Campo>
          <Campo etiqueta="Cómo lo financias">
            <select value={perfil.financiamiento} onChange={(e) => onCambio({ financiamiento: e.target.value as Perfil['financiamiento'] })}>
              <option value="ahorro">Con ahorro propio</option>
              <option value="hipotecario">Crédito hipotecario</option>
              <option value="mivivienda">Nuevo Crédito MIVIVIENDA</option>
            </select>
          </Campo>
          <Campo etiqueta="Cuota inicial" ayuda={`${Math.round(perfil.inicialProporcion * 100)} % · ${soles(perfil.precioInmueble * perfil.inicialProporcion)}`}>
            <input
              type="range"
              min={5}
              max={50}
              step={1}
              value={Math.round(perfil.inicialProporcion * 100)}
              onChange={(e) => onCambio({ inicialProporcion: num(e.target.value) / 100 })}
            />
          </Campo>
          <Campo etiqueta="Plazo del crédito (años)">
            <input type="number" min={5} max={30} value={perfil.plazoCreditoAnios} onChange={(e) => onCambio({ plazoCreditoAnios: num(e.target.value) })} />
          </Campo>
          <Campo etiqueta="TEA anual (%)" ayuda="Consulta la tasa vigente en la SBS antes de fijarla">
            <input type="number" min={0} step={0.1} value={perfil.teaAnual} onChange={(e) => onCambio({ teaAnual: num(e.target.value) })} />
          </Campo>
        </div>
      </Grupo>

      <Grupo leyenda="Qué vas a construir">
        <div className="ex-grid-campos">
          <Campo etiqueta="Área techada por piso (m²)">
            <input type="number" min={20} max={400} step={5} value={perfil.areaTechada} onChange={(e) => onCambio({ areaTechada: num(e.target.value) })} />
          </Campo>
          <Campo etiqueta="Pisos">
            <input type="number" min={1} max={5} value={perfil.pisos} onChange={(e) => onCambio({ pisos: num(e.target.value) })} />
          </Campo>
          <Campo etiqueta="Año de inicio de obra">
            <input type="number" min={0} max={perfil.horizonteAnios - 1} value={perfil.anioInicioObra} onChange={(e) => onCambio({ anioInicioObra: num(e.target.value) })} />
          </Campo>
          <Campo etiqueta="Años que dura la obra" ayuda="Construcción por etapas: más años, menos presión por año">
            <input type="number" min={1} max={25} value={perfil.duracionObraAnios} onChange={(e) => onCambio({ duracionObraAnios: num(e.target.value) })} />
          </Campo>
        </div>
        <div className="ex-opciones ex-opciones-3">
          {ACABADOS.map((op) => (
            <button
              key={op.id}
              type="button"
              className={perfil.nivelAcabado === op.id ? 'ex-opcion is-on' : 'ex-opcion'}
              aria-pressed={perfil.nivelAcabado === op.id}
              onClick={() => onCambio({ nivelAcabado: op.id })}
            >
              <strong>{op.label}</strong>
              <small>{op.nota}</small>
            </button>
          ))}
        </div>
      </Grupo>

      <Grupo leyenda="Hijos">
        <div className="ex-hijos">
          {perfil.hijos.map((hijo, indice) => (
            <div className="ex-hijo" key={hijo.id}>
              <span className="ex-hijo-nombre">Hijo {indice + 1}</span>
              <label>
                Nace en el año
                <input
                  type="number"
                  min={0}
                  max={perfil.horizonteAnios - 1}
                  value={hijo.anioNacimiento}
                  onChange={(e) =>
                    onCambio({ hijos: perfil.hijos.map((h) => (h.id === hijo.id ? { ...h, anioNacimiento: num(e.target.value) } : h)) })
                  }
                />
              </label>
              <label>
                Educación
                <select
                  value={hijo.educacion}
                  onChange={(e) =>
                    onCambio({ hijos: perfil.hijos.map((h) => (h.id === hijo.id ? { ...h, educacion: e.target.value as 'publica' | 'privada' } : h)) })
                  }
                >
                  <option value="publica">Pública</option>
                  <option value="privada">Privada</option>
                </select>
              </label>
              <label className="ex-check">
                <input
                  type="checkbox"
                  checked={hijo.saludPrivada}
                  onChange={(e) => onCambio({ hijos: perfil.hijos.map((h) => (h.id === hijo.id ? { ...h, saludPrivada: e.target.checked } : h)) })}
                />
                Salud privada (parto y vacunas fuera del Estado)
              </label>
              <button type="button" className="ex-quitar" onClick={() => onCambio({ hijos: perfil.hijos.filter((h) => h.id !== hijo.id) })}>
                Quitar
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="ex-agregar"
          onClick={() =>
            onCambio({
              hijos: [
                ...perfil.hijos,
                { id: `hijo-${Date.now()}`, anioNacimiento: Math.min(perfil.horizonteAnios - 1, perfil.hijos.length * 3 + 2), educacion: 'publica', saludPrivada: false },
              ],
            })
          }
        >
          Añadir un hijo a la proyección
        </button>
      </Grupo>
    </div>
  )
}
