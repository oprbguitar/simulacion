/**
 * Tipos del expediente de vida (Perú).
 *
 * Regla del proyecto: ningún número aparece en pantalla sin `origen` y sin al
 * menos una `Fuente`. Los rangos se guardan como rango, no como promedio
 * disfrazado de certeza.
 */

/** De dónde sale un número. Determina cuánto peso puede tener en una decisión. */
export type Origen =
  /** Publicado por una entidad del Estado (ley, resolución, tarifario, TUPA). */
  | 'OFICIAL'
  /** Fijado o supervisado por un regulador (Osinergmin, Sunass, SBS). */
  | 'REGULADO'
  /** Precio de mercado observado en comercios o portales. Cambia rápido. */
  | 'MERCADO'
  /** Constante o rendimiento de ingeniería (metrados, dosificaciones). */
  | 'TECNICO'
  /** Supuesto del simulador para poder cerrar el cálculo. Lo más débil. */
  | 'ESTIMADO'

export interface Fuente {
  entidad: string
  titulo: string
  url: string
  /** Fecha en que se comprobó que la URL responde y el dato sigue ahí. */
  verificadoEl: string
  tipo: Origen
  nota?: string
}

export type Periodicidad = 'unico' | 'mensual' | 'anual' | 'por-evento' | 'por-metro'

export interface Monto {
  /** Extremo bajo observado. Ausente cuando el valor es único y fijo. */
  min?: number
  /** Valor central que usa el motor de proyección. */
  tipico: number
  /** Extremo alto observado. */
  max?: number
  unidad: string
  periodicidad: Periodicidad
  moneda?: 'PEN' | 'USD'
}

/** Un trámite o requisito con entidad responsable y enlace de consulta. */
export interface Tramite {
  id: string
  titulo: string
  detalle: string
  entidad: string
  /** Plazo declarado por la entidad, en texto ("automática", "15 días hábiles"). */
  plazo?: string
  costo?: Monto
  origen: Origen
  fuentes: Fuente[]
  /** Qué se necesita antes de poder iniciar el trámite. */
  requisitos?: string[]
}

export interface ItemCosto {
  id: string
  etiqueta: string
  descripcion: string
  monto: Monto
  origen: Origen
  fuentes: Fuente[]
  /** Se muestra en rojo bajo el número. Para límites y letras chicas. */
  advertencia?: string
}

/** Metrado: cuánto material entra por unidad de obra. Constante técnica. */
export interface Insumo {
  material: string
  cantidad: number
  unidad: string
  /** Unidad de obra a la que se refiere la cantidad ("m³ de concreto"). */
  por: string
  nota?: string
}

export type FaseObraId =
  | 'legal'
  | 'proyecto'
  | 'preliminares'
  | 'cimentacion'
  | 'estructura'
  | 'losa'
  | 'albanileria'
  | 'instalaciones'
  | 'acabados'
  | 'formalizacion'

export interface FaseObra {
  id: FaseObraId
  nombre: string
  resumen: string
  /** Participación referencial de la fase en el costo total de la obra (0–1). */
  participacion: number
  /** Costo directo por m² techado, en soles. */
  costoPorM2: Monto
  insumos: Insumo[]
  tramites: Tramite[]
  advertencias: string[]
  fuentes: Fuente[]
}

export type ModuloId = 'vivienda' | 'construccion' | 'servicios' | 'familia' | 'educacion' | 'trabajo' | 'imprevistos'

export interface Modulo {
  id: ModuloId
  numero: string
  titulo: string
  bajada: string
  /** Qué decide el usuario en este módulo. */
  pregunta: string
}

/** Hito del calendario de vida: cuándo ocurre y cuánto cuesta. */
export interface HitoVida {
  id: string
  modulo: ModuloId
  /** Edad del hogar o del hijo, en años, en la que aplica. */
  edad: number
  titulo: string
  detalle: string
  costo?: Monto
  gratuitoEnEstado: boolean
  tramites?: Tramite[]
  fuentes: Fuente[]
}

export interface RegimenTributario {
  id: 'nrus' | 'rer' | 'rmt' | 'general' | 'cuarta' | 'quinta'
  nombre: string
  aplicaA: string
  limiteAnual?: Monto
  cargaDescripcion: string
  /** Función de carga tributaria mensual sobre un ingreso mensual bruto. */
  calcular: (ingresoMensual: number) => number
  aportes: string[]
  fuentes: Fuente[]
}

export interface Imprevisto {
  id: string
  titulo: string
  detalle: string
  /** Probabilidad anual referencial de que ocurra (0–1). */
  probabilidadAnual: number
  impacto: Monto
  /** Meses que dura el efecto sobre el flujo. */
  duracionMeses: number
  mitigacion: string[]
  fuentes: Fuente[]
}
