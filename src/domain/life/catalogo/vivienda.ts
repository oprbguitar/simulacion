import { FUENTES } from '../fuentes'
import type { ItemCosto, Tramite } from '../tipos'

/** Valor de la UIT vigente. Cambia cada año por decreto supremo del MEF. */
export const UIT = 5500

// ------------------------------------------------------------ formas de entrar

export type RutaViviendaId = 'terreno' | 'casa-construida' | 'departamento' | 'alquiler' | 'familia'

export interface RutaVivienda {
  id: RutaViviendaId
  titulo: string
  descripcion: string
  /** Qué se está comprando realmente y qué falta después. */
  loQueQueda: string
  tramites: Tramite[]
  costos: ItemCosto[]
}

// ------------------------------------------------------------------- trámites

const minutaEscritura: Tramite = {
  id: 'minuta-escritura',
  titulo: 'Minuta y escritura pública',
  detalle:
    'El abogado redacta la minuta de compraventa y el notario la eleva a escritura pública. Sin escritura pública no se puede inscribir la transferencia, y sin inscripción el comprador no es oponible frente a terceros: alguien puede inscribir primero y ganarle el predio.',
  entidad: 'Notaría',
  plazo: 'Días a semanas según la notaría y la completitud de los documentos',
  costo: { min: 500, tipico: 1300, max: 3500, unidad: 'S/ por operación', periodicidad: 'por-evento' },
  origen: 'MERCADO',
  requisitos: [
    'DNI vigente de compradores y vendedores (y del cónyuge, si hay sociedad de gananciales)',
    'Copia literal actualizada de la partida registral',
    'Certificado de gravámenes',
    'Recibo del impuesto predial y de arbitrios al día',
    'Constancia de no adeudo del vendedor',
    'Medio de pago bancarizado si la operación supera el monto que exige la ley (evita el desconocimiento del costo para efectos tributarios)',
  ],
  fuentes: [FUENTES.notarios, FUENTES.sunarpEnLinea],
}

const inscripcionSunarp: Tramite = {
  id: 'inscripcion-sunarp',
  titulo: 'Inscripción de la transferencia en SUNARP',
  detalle:
    'El notario presenta el parte notarial al registro. Los derechos registrales se calculan sobre el valor del acto y se pueden estimar antes en la calculadora de SUNARP.',
  entidad: 'SUNARP',
  plazo: 'Plazo de calificación registral; puede haber observaciones',
  costo: { min: 100, tipico: 400, max: 1500, unidad: 'S/ según valor del acto', periodicidad: 'por-evento' },
  origen: 'OFICIAL',
  fuentes: [FUENTES.sunarpCalculadora, FUENTES.sunarpServicios],
}

const alcabala: Tramite = {
  id: 'alcabala',
  titulo: 'Impuesto de Alcabala',
  detalle:
    'Lo paga el comprador. Grava la transferencia de propiedad con una tasa del 3 % sobre el valor de transferencia, que no puede ser menor al autoavalúo del ejercicio. Las primeras 10 UIT del valor no están afectas.',
  entidad: 'SAT de Lima o municipalidad provincial',
  plazo: 'Hasta el último día hábil del mes siguiente a la transferencia',
  costo: { tipico: 0.03, unidad: 'proporción del valor sobre 10 UIT', periodicidad: 'por-evento' },
  origen: 'OFICIAL',
  requisitos: [
    'Minuta o documento que acredita la transferencia',
    'Autoavalúo (HR y PU) del ejercicio corriente',
    'DNI del adquirente',
  ],
  fuentes: [FUENTES.satLima, FUENTES.uit2026],
}

const prediales: Tramite = {
  id: 'predial-arbitrios',
  titulo: 'Impuesto predial y arbitrios',
  detalle:
    'Desde que se es propietario hay una obligación anual. El predial es progresivo por tramos de UIT sobre el autoavalúo; los arbitrios (limpieza, parques, serenazgo) los fija cada municipalidad y se pagan trimestral o mensualmente.',
  entidad: 'Municipalidad distrital / SAT',
  plazo: 'Declaración jurada anual; pago al contado o en cuatro cuotas',
  costo: { min: 0.002, tipico: 0.006, max: 0.01, unidad: 'proporción del autoavalúo al año', periodicidad: 'anual' },
  origen: 'OFICIAL',
  fuentes: [FUENTES.satLima],
}

const tasacion: Tramite = {
  id: 'tasacion',
  titulo: 'Tasación del inmueble',
  detalle: 'El banco exige una tasación hecha por un perito de su lista para determinar el valor de garantía. Se paga aunque el crédito no se apruebe.',
  entidad: 'Perito tasador autorizado por la entidad financiera',
  costo: { min: 300, tipico: 550, max: 1200, unidad: 'S/ por tasación', periodicidad: 'por-evento' },
  origen: 'MERCADO',
  fuentes: [FUENTES.sbsHipotecario],
}

// --------------------------------------------------------------------- rutas

export const RUTAS_VIVIENDA: RutaVivienda[] = [
  {
    id: 'terreno',
    titulo: 'Comprar un terreno y construir por etapas',
    descripcion:
      'La ruta más común fuera del mercado formal. El desembolso inicial es menor, pero el proyecto no termina con la compra: recién empieza.',
    loQueQueda:
      'Después de comprar quedan: licencia de edificación, cimentación, estructura, techo, muros, instalaciones, acabados, conexiones de servicios y declaratoria de fábrica. Entre 3 y 15 años de obra por etapas es un plazo realista en autoconstrucción.',
    tramites: [minutaEscritura, inscripcionSunarp, alcabala, prediales],
    costos: [
      {
        id: 'terreno-precio',
        etiqueta: 'Precio del terreno',
        descripcion:
          'Depende casi por completo de la ubicación y de si está habilitado (con servicios y calles) o no. Un lote sin habilitación urbana cuesta menos y obliga a asumir después el costo de conectar agua y luz.',
        monto: { min: 120, tipico: 700, max: 4500, unidad: 'S/ por m² de terreno', periodicidad: 'unico' },
        origen: 'MERCADO',
        fuentes: [FUENTES.satLima, FUENTES.sunarpEnLinea],
        advertencia: 'Verifica la partida antes de dar cualquier adelanto. Un terreno sin inscribir no sirve como garantía y puede tener más de un «propietario».',
      },
      {
        id: 'terreno-gastos-cierre',
        etiqueta: 'Gastos de cierre (notaría, registro, alcabala)',
        descripcion: 'Sumados, los costos de formalizar la compra suelen representar entre 3 % y 5 % del valor del predio.',
        monto: { min: 0.03, tipico: 0.04, max: 0.055, unidad: 'proporción del precio', periodicidad: 'unico' },
        origen: 'ESTIMADO',
        fuentes: [FUENTES.satLima, FUENTES.notarios, FUENTES.sunarpCalculadora],
      },
    ],
  },
  {
    id: 'casa-construida',
    titulo: 'Comprar una casa ya construida',
    descripcion: 'Se entra a vivir de inmediato y el precio incorpora la construcción. El riesgo se traslada a la verificación: qué se está comprando realmente.',
    loQueQueda:
      'Verificar que lo construido esté declarado (declaratoria de fábrica inscrita), que no haya ampliaciones sin licencia y que no existan cargas, hipotecas o embargos vigentes en la partida.',
    tramites: [minutaEscritura, inscripcionSunarp, alcabala, prediales, tasacion],
    costos: [
      {
        id: 'casa-precio',
        etiqueta: 'Precio de la vivienda',
        descripcion: 'El rango es enorme entre distritos y entre ciudades. Sin verificar precios comparables en la zona exacta, cualquier cifra es decorativa.',
        monto: { min: 90_000, tipico: 320_000, max: 1_200_000, unidad: 'S/ por vivienda', periodicidad: 'unico' },
        origen: 'MERCADO',
        fuentes: [FUENTES.fondoMivivienda, FUENTES.satLima],
        advertencia: 'Si hay áreas construidas que no figuran en la partida, el comprador hereda el problema y el costo de regularizarlas.',
      },
    ],
  },
  {
    id: 'departamento',
    titulo: 'Comprar un departamento en el mercado formal',
    descripcion: 'La ruta con más financiamiento disponible: crédito hipotecario, Nuevo Crédito MIVIVIENDA y Bono del Buen Pagador.',
    loQueQueda: 'Cuota inicial, evaluación crediticia, gastos de cierre y, después, cuota mensual de mantenimiento del edificio además del predial y los arbitrios.',
    tramites: [tasacion, minutaEscritura, inscripcionSunarp, alcabala, prediales],
    costos: [
      {
        id: 'depa-precio',
        etiqueta: 'Precio del departamento',
        descripcion: 'Los programas de MIVIVIENDA tienen topes de valor de vivienda que se actualizan por resolución; fuera de esos topes, el crédito es hipotecario común.',
        monto: { min: 120_000, tipico: 380_000, max: 900_000, unidad: 'S/ por unidad', periodicidad: 'unico' },
        origen: 'MERCADO',
        fuentes: [FUENTES.fondoMivivienda],
      },
      {
        id: 'depa-mantenimiento',
        etiqueta: 'Cuota de mantenimiento del edificio',
        descripcion: 'Gasto mensual permanente que no existe en una casa independiente. Cubre limpieza, vigilancia, ascensores y áreas comunes.',
        monto: { min: 80, tipico: 220, max: 600, unidad: 'S/ al mes', periodicidad: 'mensual' },
        origen: 'MERCADO',
        fuentes: [FUENTES.indecopi],
      },
    ],
  },
  {
    id: 'alquiler',
    titulo: 'Alquilar',
    descripcion: 'Sin deuda ni trámites registrales, pero sin patrimonio acumulado. El costo es real y recurrente.',
    loQueQueda: 'Garantía y adelanto al inicio, y una renta que sube con el tiempo sin construir ningún activo.',
    tramites: [
      {
        id: 'contrato-alquiler',
        titulo: 'Contrato de arrendamiento',
        detalle:
          'Conviene firmarlo con firmas legalizadas ante notario. El propietario debe declarar y pagar el impuesto a la renta de primera categoría y entregar el comprobante; exigirlo protege al inquilino.',
        entidad: 'Notaría / SUNAT',
        costo: { min: 30, tipico: 90, max: 250, unidad: 'S/ por legalización', periodicidad: 'por-evento' },
        origen: 'OFICIAL',
        fuentes: [FUENTES.sunatPersonas, FUENTES.notarios],
      },
    ],
    costos: [
      {
        id: 'alquiler-renta',
        etiqueta: 'Renta mensual',
        descripcion: 'Varía por distrito, tamaño y antigüedad. El desembolso inicial suele ser un mes de adelanto más uno o dos de garantía.',
        monto: { min: 500, tipico: 1400, max: 4500, unidad: 'S/ al mes', periodicidad: 'mensual' },
        origen: 'MERCADO',
        fuentes: [FUENTES.indecopi],
      },
    ],
  },
  {
    id: 'familia',
    titulo: 'Vivir con la familia',
    descripcion: 'Costo habitacional bajo o nulo. Es la etapa en la que más rápido se puede acumular una cuota inicial, si el excedente efectivamente se ahorra.',
    loQueQueda: 'La decisión sigue pendiente. Lo que cambia es el margen para tomarla sin apuro.',
    tramites: [],
    costos: [
      {
        id: 'familia-aporte',
        etiqueta: 'Aporte al hogar familiar',
        descripcion: 'Aun sin alquiler, suele haber un aporte a servicios y alimentación. Ignorarlo infla artificialmente la capacidad de ahorro simulada.',
        monto: { min: 0, tipico: 400, max: 1200, unidad: 'S/ al mes', periodicidad: 'mensual' },
        origen: 'ESTIMADO',
        fuentes: [FUENTES.mtpe],
      },
    ],
  },
]

// ------------------------------------------------------------ crédito hipotecario

export interface ProductoCredito {
  id: string
  nombre: string
  descripcion: string
  teaMin: number
  teaTipica: number
  teaMax: number
  inicialMin: number
  plazoMaxAnios: number
  notas: string[]
  fuentes: typeof FUENTES.sbsHipotecario[]
}

export const PRODUCTOS_CREDITO: ProductoCredito[] = [
  {
    id: 'hipotecario',
    nombre: 'Crédito hipotecario tradicional',
    descripcion: 'El banco financia un porcentaje del valor de tasación y se queda con el inmueble en garantía. La cuota inicial habitual va del 10 % al 20 %.',
    teaMin: 7.2,
    teaTipica: 8.4,
    teaMax: 10.5,
    inicialMin: 0.1,
    plazoMaxAnios: 25,
    notas: [
      'La TEA es solo el interés. Lo que realmente se paga es la TCEA, que incluye seguro de desgravamen, seguro del inmueble, comisiones y portes.',
      'La cuota mensual no debería comprometer más de un tercio del ingreso neto del hogar; los bancos suelen evaluar con ese criterio.',
      'La tasa depende del perfil crediticio: mejor historial y mayor inicial, menor tasa.',
    ],
    fuentes: [FUENTES.sbsHipotecario, FUENTES.sbsTasas],
  },
  {
    id: 'mivivienda',
    nombre: 'Nuevo Crédito MIVIVIENDA',
    descripcion:
      'Crédito canalizado por bancos, cajas y financieras con recursos del Fondo MIVIVIENDA, para viviendas dentro de un tope de valor. Incluye el Bono del Buen Pagador, que reduce el saldo si se paga puntualmente.',
    teaMin: 6.5,
    teaTipica: 7.8,
    teaMax: 9.5,
    inicialMin: 0.075,
    plazoMaxAnios: 25,
    notas: [
      'Los topes de valor de vivienda y los montos del Bono del Buen Pagador se actualizan por resolución: hay que consultarlos vigentes antes de calcular.',
      'No se puede haber sido propietario de otra vivienda ni haber recibido apoyo habitacional del Estado.',
    ],
    fuentes: [FUENTES.fondoMivivienda, FUENTES.sbsHipotecario],
  },
  {
    id: 'techo-propio',
    nombre: 'Techo Propio — Bono Familiar Habitacional',
    descripcion:
      'Subsidio directo del Estado para familias de menores ingresos, en las modalidades de adquisición de vivienda nueva, construcción en sitio propio y mejoramiento de vivienda.',
    teaMin: 0,
    teaTipica: 0,
    teaMax: 0,
    inicialMin: 0.03,
    plazoMaxAnios: 0,
    notas: [
      'Es un bono, no un crédito: el monto y los requisitos de ingreso familiar máximo los fija el programa y se actualizan.',
      'La modalidad de construcción en sitio propio exige tener el terreno saneado a nombre del grupo familiar.',
    ],
    fuentes: [FUENTES.fondoMivivienda],
  },
]

/** Cuota mensual de un crédito francés a partir de la TEA anual. */
export function cuotaMensual(monto: number, teaAnual: number, anios: number): number {
  if (monto <= 0 || anios <= 0) return 0
  const meses = Math.round(anios * 12)
  const tem = Math.pow(1 + teaAnual / 100, 1 / 12) - 1
  if (tem <= 0) return monto / meses
  return (monto * tem) / (1 - Math.pow(1 + tem, -meses))
}

/** Cuánto se termina pagando en total, y cuánto de eso es solo interés. */
export function costoTotalCredito(monto: number, teaAnual: number, anios: number) {
  const cuota = cuotaMensual(monto, teaAnual, anios)
  const total = cuota * Math.round(anios * 12)
  return { cuota, total, interes: total - monto }
}

/**
 * Monto máximo de crédito compatible con un ingreso, usando el criterio de que
 * la cuota no supere una proporción del ingreso neto del hogar.
 */
export function capacidadEndeudamiento(ingresoNetoMensual: number, teaAnual: number, anios: number, ratioCuota = 0.3): number {
  const cuotaObjetivo = Math.max(0, ingresoNetoMensual) * ratioCuota
  const meses = Math.round(anios * 12)
  const tem = Math.pow(1 + teaAnual / 100, 1 / 12) - 1
  if (tem <= 0) return cuotaObjetivo * meses
  return (cuotaObjetivo * (1 - Math.pow(1 + tem, -meses))) / tem
}

/** Alcabala: 3 % sobre el exceso de 10 UIT del valor de transferencia. */
export function calcularAlcabala(valorTransferencia: number, uit = UIT): number {
  const base = Math.max(0, valorTransferencia - 10 * uit)
  return base * 0.03
}

export const TRAMITES_ADQUISICION = [minutaEscritura, inscripcionSunarp, alcabala, prediales, tasacion]
