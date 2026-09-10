import { FUENTES } from '../fuentes'
import type { Fuente, ItemCosto } from '../tipos'
import { UIT } from './vivienda'

/**
 * De dónde sale el ingreso y cuánto queda después de aportes e impuestos.
 *
 * Las reglas están escritas como funciones para que el número que aparece en
 * pantalla se pueda seguir hasta la regla que lo produjo.
 */

/** Remuneración mínima vital vigente (D.S. 006-2024-TR). */
export const RMV = 1130

export type ModoIngresoId = 'dependiente' | 'independiente' | 'negocio-nrus' | 'negocio-rer' | 'negocio-rmt'

export interface ModoIngreso {
  id: ModoIngresoId
  numero: string
  titulo: string
  descripcion: string
  categoriaRenta: string
  /** Descuentos y aportes explicados en palabras. */
  cargas: string[]
  beneficios: string[]
  riesgos: string[]
  fuentes: Fuente[]
  /** Descuento mensual total sobre un ingreso bruto mensual. */
  descuentoMensual: (brutoMensual: number) => number
}

// ------------------------------------------------------- impuesto a la renta

/** Tramos progresivos del impuesto a la renta de trabajo, en UIT. */
export const TRAMOS_RENTA = [
  { hastaUit: 5, tasa: 0.08 },
  { hastaUit: 20, tasa: 0.14 },
  { hastaUit: 35, tasa: 0.17 },
  { hastaUit: 45, tasa: 0.2 },
  { hastaUit: Infinity, tasa: 0.3 },
] as const

/** Deducción fija de 7 UIT sobre las rentas de trabajo (cuarta y quinta). */
export const DEDUCCION_UIT = 7

/**
 * Impuesto a la renta anual de trabajo sobre una renta bruta anual.
 * No incorpora la deducción adicional de 3 UIT por gastos sustentados.
 */
export function impuestoRentaTrabajo(rentaBrutaAnual: number, uit = UIT): number {
  const neta = Math.max(0, rentaBrutaAnual - DEDUCCION_UIT * uit)
  let restante = neta
  let acumuladoUit = 0
  let impuesto = 0
  for (const tramo of TRAMOS_RENTA) {
    if (restante <= 0) break
    const anchoUit = tramo.hastaUit - acumuladoUit
    const ancho = anchoUit === Infinity ? restante : anchoUit * uit
    const gravado = Math.min(restante, ancho)
    impuesto += gravado * tramo.tasa
    restante -= gravado
    acumuladoUit = tramo.hastaUit
  }
  return impuesto
}

/** Aporte previsional. AFP ronda el 12.5 % (10 % al fondo + prima + comisión); ONP es 13 %. */
export const APORTE_AFP = 0.125
export const APORTE_ONP = 0.13

// --------------------------------------------------------------- modos de ingreso

export const MODOS_INGRESO: ModoIngreso[] = [
  {
    id: 'dependiente',
    numero: '01',
    titulo: 'Trabajo en planilla (quinta categoría)',
    descripcion:
      'Contrato de trabajo con un empleador. Es el modo con más protecciones y con el descuento más visible: el aporte previsional sale de la boleta todos los meses.',
    categoriaRenta: 'Renta de quinta categoría',
    cargas: [
      'Aporte previsional del trabajador: 13 % a la ONP o alrededor de 12.5 % a la AFP (10 % al fondo, más prima de seguro y comisión).',
      'Impuesto a la renta de quinta categoría, retenido mensualmente, con deducción de 7 UIT al año.',
      'EsSalud lo aporta el empleador (9 % de la remuneración): no se descuenta de la boleta.',
    ],
    beneficios: [
      'Gratificaciones en julio y diciembre (una remuneración cada una) más la bonificación extraordinaria del 9 %.',
      'CTS depositada en mayo y noviembre.',
      'Vacaciones pagadas de 30 días al año.',
      'Cobertura de EsSalud para el trabajador y sus derechohabientes.',
      'Aporte a una pensión que se sigue acumulando.',
    ],
    riesgos: [
      'El ingreso depende de un solo empleador.',
      'Un despido corta simultáneamente el ingreso y la cobertura de salud (queda el periodo de latencia, no indefinido).',
    ],
    fuentes: [FUENTES.mtpe, FUENTES.onp, FUENTES.essalud, FUENTES.sunatRenta],
    descuentoMensual: (bruto) => {
      const previsional = bruto * APORTE_AFP
      // Se aproxima la retención mensual repartiendo el impuesto anual en 12.
      const anual = bruto * 14 // 12 sueldos + 2 gratificaciones
      const renta = impuestoRentaTrabajo(anual) / 12
      return previsional + renta
    },
  },
  {
    id: 'independiente',
    numero: '02',
    titulo: 'Servicios independientes (cuarta categoría)',
    descripcion:
      'Se emiten recibos por honorarios. Mayor flexibilidad y ninguna de las protecciones de la planilla: ni gratificaciones, ni CTS, ni vacaciones, ni EsSalud automático.',
    categoriaRenta: 'Renta de cuarta categoría',
    cargas: [
      'Retención del 8 % en cada recibo por honorarios que supere el monto mínimo, salvo suspensión de retenciones autorizada por SUNAT.',
      'Deducción del 20 % de la renta bruta (con tope de 24 UIT) más la deducción de 7 UIT.',
      'El aporte a pensión y el seguro de salud corren por cuenta propia: no los descuenta nadie.',
    ],
    beneficios: [
      'Se puede trabajar para varios clientes a la vez.',
      'Los gastos de la actividad se pueden ordenar mejor.',
      'Es posible afiliarse voluntariamente a EsSalud o contratar un seguro privado.',
    ],
    riesgos: [
      'Sin ingreso no hay cobertura: enfermarse cuesta el doble, porque se pierde el ingreso y se paga la atención.',
      'La ausencia de aportes previsionales solo se nota décadas después, cuando ya no se puede corregir.',
    ],
    fuentes: [FUENTES.sunatPersonas, FUENTES.sunatRenta, FUENTES.sunatRegimenes],
    descuentoMensual: (bruto) => {
      const anualBruto = bruto * 12
      const netaTrasDeduccion = anualBruto * 0.8
      const renta = impuestoRentaTrabajo(netaTrasDeduccion) / 12
      return renta
    },
  },
  {
    id: 'negocio-nrus',
    numero: '03',
    titulo: 'Negocio propio — Nuevo RUS',
    descripcion:
      'Para negocios pequeños que venden al consumidor final y solo emiten boletas de venta. Cuota fija mensual, sin declaración anual de renta ni libros electrónicos.',
    categoriaRenta: 'Renta de tercera categoría — régimen simplificado',
    cargas: [
      'Cuota mensual fija según la categoría de ingresos o compras del mes.',
      'No permite emitir facturas, lo que cierra la puerta a clientes que necesitan crédito fiscal.',
    ],
    beneficios: ['La carga administrativa más baja de todos los regímenes.', 'No obliga a llevar libros contables electrónicos.'],
    riesgos: ['Al superar los límites del régimen hay que cambiar de régimen, y el salto de carga tributaria es abrupto.'],
    fuentes: [FUENTES.sunatEmprender, FUENTES.sunatRegimenes],
    descuentoMensual: (bruto) => (bruto <= 5000 ? 20 : 50),
  },
  {
    id: 'negocio-rer',
    numero: '04',
    titulo: 'Negocio propio — Régimen Especial de Renta (RER)',
    descripcion:
      'Para negocios de comercio, producción o servicios cuyos ingresos netos o compras anuales no superan S/ 525,000. Permite emitir facturas con contabilidad simple.',
    categoriaRenta: 'Renta de tercera categoría',
    cargas: [
      'Impuesto a la renta mensual del 1.5 % de los ingresos netos, con carácter cancelatorio.',
      'IGV del 18 % sobre las ventas, con derecho a crédito fiscal por las compras.',
      'Registro de compras y de ventas electrónicos.',
    ],
    beneficios: ['Permite facturar a empresas.', 'No exige declaración jurada anual de renta.'],
    riesgos: ['Hay actividades excluidas del régimen.', 'Al pasar el límite de ingresos se migra obligatoriamente al RMT o al Régimen General.'],
    fuentes: [FUENTES.sunatRer, FUENTES.sunatEmprender],
    descuentoMensual: (bruto) => bruto * 0.015,
  },
  {
    id: 'negocio-rmt',
    numero: '05',
    titulo: 'Negocio propio — Régimen MYPE Tributario (RMT)',
    descripcion: 'Diseñado para micro y pequeñas empresas con ingresos netos de hasta 1,700 UIT al año. Es el régimen con el que crece la mayoría de negocios formales.',
    categoriaRenta: 'Renta de tercera categoría',
    cargas: [
      'Pago a cuenta mensual del 1 % de los ingresos netos mientras no se superen las 300 UIT de ingresos anuales.',
      'Impuesto a la renta anual del 10 % sobre las primeras 15 UIT de renta neta y 29.5 % sobre el exceso.',
      'IGV del 18 % sobre las ventas.',
      'Si hay trabajadores: EsSalud (9 %) y retención de aportes previsionales, además de la planilla electrónica.',
    ],
    beneficios: ['Sin límite de actividades.', 'Permite deducir gastos reales del negocio.', 'Escala sin cambiar de régimen hasta 1,700 UIT.'],
    riesgos: ['Exige contabilidad formal y declaración jurada anual.', 'Los errores formales generan multas que no dependen de si hubo utilidad.'],
    fuentes: [FUENTES.sunatRmt, FUENTES.sunatEmprender, FUENTES.sunatRegimenes],
    descuentoMensual: (bruto) => bruto * 0.01,
  },
]

export const modoIngreso = (id: ModoIngresoId): ModoIngreso =>
  MODOS_INGRESO.find((m) => m.id === id) ?? MODOS_INGRESO[0]

// ------------------------------------------------------------------ costos fijos

export const COSTOS_LABORALES: ItemCosto[] = [
  {
    id: 'aporte-pension',
    etiqueta: 'Aporte previsional',
    descripcion:
      'AFP: 10 % al fondo individual más prima de seguro y comisión (total cercano al 12.5 %). ONP: 13 % a un fondo común, con requisito de 20 años de aportes para acceder a pensión.',
    monto: { min: 0.125, tipico: 0.125, max: 0.13, unidad: 'proporción de la remuneración', periodicidad: 'mensual' },
    origen: 'OFICIAL',
    fuentes: [FUENTES.onp],
    advertencia: 'En la ONP, quien no completa 20 años de aportes no accede a pensión. En la AFP siempre se recibe lo acumulado, sea cual sea el tiempo.',
  },
  {
    id: 'essalud',
    etiqueta: 'EsSalud',
    descripcion: 'Aporte del empleador equivalente al 9 % de la remuneración del trabajador. No se descuenta de la boleta.',
    monto: { tipico: 0.09, unidad: 'proporción de la remuneración (a cargo del empleador)', periodicidad: 'mensual' },
    origen: 'OFICIAL',
    fuentes: [FUENTES.essalud],
  },
  {
    id: 'seguro-independiente',
    etiqueta: 'Seguro de salud para independientes',
    descripcion: 'Quien trabaja por cuenta propia debe resolver su cobertura: SIS (si califica), afiliación potestativa a EsSalud o un plan privado (EPS).',
    monto: { min: 0, tipico: 180, max: 900, unidad: 'S/ al mes', periodicidad: 'mensual' },
    origen: 'MERCADO',
    fuentes: [FUENTES.sis, FUENTES.essalud, FUENTES.susalud],
  },
]

export const FUENTES_TRABAJO: Fuente[] = [FUENTES.mtpe, FUENTES.sunatRegimenes, FUENTES.onp, FUENTES.essalud, FUENTES.sunatRenta]
