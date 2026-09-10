import { FUENTES } from '../fuentes'
import type { FaseObra, ItemCosto, Tramite } from '../tipos'

/**
 * Construcción progresiva de vivienda unifamiliar en Perú.
 *
 * Dos capas separadas a propósito:
 *
 *  1. METRADOS (origen TECNICO). Cuánto material entra por unidad de obra.
 *     Son constantes de ingeniería: no se mueven con la inflación.
 *  2. PRECIOS UNITARIOS (origen MERCADO). Cuánto cuesta hoy ese material.
 *     Se mueven todo el tiempo, por eso van con rango y con enlace para
 *     verificar el precio del día.
 *
 * Multiplicar (1) por (2) da un presupuesto defendible. Publicar un total sin
 * mostrar (1) y (2) es lo que este archivo existe para evitar.
 */

/** Peso de una bolsa de cemento en el mercado peruano. */
export const BOLSA_CEMENTO_KG = 42.5

// ---------------------------------------------------------------- materiales

export interface PrecioMaterial {
  id: string
  material: string
  unidad: string
  /** Rango de precio puesto en obra, Lima, referencia 2026. */
  min: number
  tipico: number
  max: number
  verificarEn: string
  nota?: string
}

export const PRECIOS_MATERIALES: PrecioMaterial[] = [
  {
    id: 'cemento',
    material: 'Cemento Portland Tipo I (bolsa 42.5 kg)',
    unidad: 'bolsa',
    min: 27,
    tipico: 31,
    max: 36,
    verificarEn: 'https://www.sodimac.com.pe/sodimac-pe/lista/CATG15056/Cemento',
    nota: 'En zonas con sulfatos en el suelo el RNE E.060 exige Tipo V o MS, entre 8 % y 15 % más caro.',
  },
  {
    id: 'arena-gruesa',
    material: 'Arena gruesa puesta en obra',
    unidad: 'm³',
    min: 55,
    tipico: 72,
    max: 95,
    verificarEn: 'https://www.inei.gob.pe/estadisticas/indice-tematico/precios/',
    nota: 'El flete manda: el precio sube fuerte según la distancia a la cantera.',
  },
  {
    id: 'arena-fina',
    material: 'Arena fina puesta en obra',
    unidad: 'm³',
    min: 60,
    tipico: 80,
    max: 105,
    verificarEn: 'https://www.inei.gob.pe/estadisticas/indice-tematico/precios/',
  },
  {
    id: 'piedra-chancada',
    material: 'Piedra chancada de 1/2"',
    unidad: 'm³',
    min: 65,
    tipico: 85,
    max: 110,
    verificarEn: 'https://www.inei.gob.pe/estadisticas/indice-tematico/precios/',
  },
  {
    id: 'acero',
    material: 'Fierro corrugado grado 60 (varilla de 9 m)',
    unidad: 'kg',
    min: 4.2,
    tipico: 5.1,
    max: 6.3,
    verificarEn: 'https://acerosarequipa.com/pe/es/',
    nota: 'Una varilla de 1/2" × 9 m pesa 9.06 kg; una de 3/8" × 9 m pesa 5.1 kg.',
  },
  {
    id: 'ladrillo-kk',
    material: 'Ladrillo King Kong 18 huecos (9 × 13 × 24 cm)',
    unidad: 'unidad',
    min: 1.0,
    tipico: 1.35,
    max: 1.8,
    verificarEn: 'https://www.promart.pe/buscar?q=ladrillo',
    nota: 'Para muros portantes el RNE E.070 pide ladrillo sólido o de percentaje de vacíos limitado. El de 18 huecos es tabique, no muro portante.',
  },
  {
    id: 'ladrillo-techo',
    material: 'Ladrillo de techo 15 × 30 × 30 cm',
    unidad: 'unidad',
    min: 1.9,
    tipico: 2.4,
    max: 3.1,
    verificarEn: 'https://www.promart.pe/buscar?q=ladrillo%20techo',
  },
  {
    id: 'concreto-premezclado',
    material: 'Concreto premezclado f’c = 210 kg/cm² con mixer',
    unidad: 'm³',
    min: 380,
    tipico: 430,
    max: 520,
    verificarEn: 'https://unacem.pe/',
    nota: 'El servicio de bomba se cobra aparte y suele tener un mínimo de metros cúbicos por viaje.',
  },
  {
    id: 'mano-obra',
    material: 'Cuadrilla de obra (operario + oficial + peón), jornal conjunto',
    unidad: 'día',
    min: 210,
    tipico: 265,
    max: 330,
    verificarEn: 'https://capeco.org/',
    nota: 'El pliego de construcción civil fija jornales básicos por categoría, más BUC, bonificaciones y dominical.',
  },
]

export const precioMaterial = (id: string): PrecioMaterial | undefined =>
  PRECIOS_MATERIALES.find((item) => item.id === id)

// ------------------------------------------------------------------ metrados

/**
 * Dosificaciones de concreto: bolsas de cemento por m³ según resistencia.
 * Valores de diseño de mezcla habituales para agregados de Lima.
 */
export const DOSIFICACION_CONCRETO = [
  { resistencia: "f'c = 140 kg/cm²", uso: 'Falso piso, veredas, solados', bolsas: 7.01, arena: 0.56, piedra: 0.57 },
  { resistencia: "f'c = 175 kg/cm²", uso: 'Sobrecimientos, elementos no estructurales', bolsas: 8.43, arena: 0.54, piedra: 0.55 },
  { resistencia: "f'c = 210 kg/cm²", uso: 'Zapatas, columnas, vigas y losas de vivienda', bolsas: 9.73, arena: 0.52, piedra: 0.53 },
  { resistencia: "f'c = 280 kg/cm²", uso: 'Elementos exigidos por cálculo estructural', bolsas: 11.5, arena: 0.5, piedra: 0.51 },
] as const

// ------------------------------------------------------------------- trámites

const tramiteLicenciaA: Tramite = {
  id: 'licencia-edificacion-a',
  titulo: 'Licencia de edificación — Modalidad A',
  detalle:
    'Aprobación automática con firma de profesionales. Cubre vivienda unifamiliar nueva de hasta 120 m², ampliación hasta 200 m² sobre una edificación con licencia, y obras menores de menos de 30 m². El cargo de ingreso del expediente ES la licencia: se puede empezar la obra desde ese momento.',
  entidad: 'Municipalidad distrital o provincial',
  plazo: 'Automática al presentar el expediente completo. Vigencia de 36 meses, prorrogable 12 más.',
  origen: 'OFICIAL',
  requisitos: [
    'Formulario Único de Edificación (FUE) firmado por el propietario y los profesionales responsables',
    'Certificado literal de dominio con antigüedad máxima de 30 días calendario',
    'Certificado de Parámetros Urbanísticos y Edificatorios emitido por la municipalidad',
    'Planos de ubicación y localización',
    'Declaración jurada de habilidad de los profesionales (arquitecto e ingenieros)',
    'Pago del derecho de trámite fijado en el TUPA de la municipalidad',
  ],
  fuentes: [FUENTES.licenciaEdificacionA, FUENTES.licenciaModalidades],
}

const tramiteLicenciaB: Tramite = {
  id: 'licencia-edificacion-b',
  titulo: 'Licencia de edificación — Modalidad B',
  detalle:
    'Evaluación previa del proyecto por la municipalidad. Aplica a vivienda unifamiliar o multifamiliar de hasta 5 pisos y hasta 3,000 m² de área construida. Requiere el juego completo de planos de arquitectura, estructuras, instalaciones eléctricas y sanitarias.',
  entidad: 'Municipalidad distrital (Comisión Técnica o revisor urbano)',
  plazo: 'Evaluación en plazo del TUPA municipal',
  origen: 'OFICIAL',
  requisitos: [
    'FUE y documentación de la Modalidad A',
    'Planos de arquitectura, estructuras, instalaciones eléctricas y sanitarias firmados por profesionales colegiados y habilitados',
    'Memoria descriptiva y especificaciones técnicas',
    'Estudio de mecánica de suelos cuando el proyecto lo requiere (RNE E.050)',
    'Póliza CAR (Contractor All Risk) según el caso',
  ],
  fuentes: [FUENTES.licenciaModalidades, FUENTES.rne],
}

const tramiteDeclaratoria: Tramite = {
  id: 'declaratoria-fabrica',
  titulo: 'Conformidad de obra y declaratoria de fábrica',
  detalle:
    'Al terminar la obra se solicita la conformidad de obra en la municipalidad y luego se inscribe la declaratoria de fábrica en SUNARP. Sin este paso, la casa construida no existe registralmente: no se puede hipotecar, vender con facilidad ni heredar sin problemas.',
  entidad: 'Municipalidad + SUNARP',
  plazo: 'Según TUPA municipal; la inscripción registral tiene plazo propio',
  origen: 'OFICIAL',
  requisitos: [
    'Licencia de edificación y planos aprobados',
    'FUE — Conformidad de Obra y Declaratoria de Edificación',
    'Planos de replanteo si hubo variaciones respecto del proyecto aprobado',
    'Pago de derechos registrales (calculable en la calculadora de SUNARP)',
  ],
  fuentes: [FUENTES.licenciaEdificacionA, FUENTES.sunarpCalculadora, FUENTES.sunarpServicios],
}

// ------------------------------------------------------------------ las fases

export const FASES_OBRA: FaseObra[] = [
  {
    id: 'legal',
    nombre: 'Situación legal del terreno',
    resumen:
      'Antes de comprar un saco de cemento: verificar que el terreno está inscrito, que quien vende es quien figura en la partida, que no hay cargas ni gravámenes y que el uso permitido admite vivienda.',
    participacion: 0.01,
    costoPorM2: { min: 3, tipico: 8, max: 20, unidad: 'S/ por m² techado', periodicidad: 'por-metro' },
    insumos: [],
    tramites: [
      {
        id: 'busqueda-partida',
        titulo: 'Búsqueda y lectura de la partida registral',
        detalle:
          'En el SPRL de SUNARP se busca la partida por dirección o por nombre del titular y luego se visualiza. La búsqueda de predios entrega resultado en aproximadamente 30 minutos; la de personas y bienes muebles, en unas 2 horas.',
        entidad: 'SUNARP',
        plazo: 'Búsqueda de predios: ~30 minutos',
        costo: { min: 5, tipico: 7, max: 7, unidad: 'S/ por búsqueda', periodicidad: 'por-evento' },
        origen: 'OFICIAL',
        requisitos: ['Cuenta en el SPRL con saldo cargado (tarjeta VISA)', 'Dirección exacta del predio o nombre del titular'],
        fuentes: [FUENTES.sunarpEnLinea, FUENTES.sunarpServicios],
      },
      {
        id: 'certificado-literal',
        titulo: 'Certificado literal de dominio',
        detalle:
          'Documento con valor legal que reproduce el contenido de la partida. Es requisito de la licencia de edificación y del crédito hipotecario, y debe tener menos de 30 días de emitido.',
        entidad: 'SUNARP',
        costo: { min: 12, tipico: 26, max: 60, unidad: 'S/ por certificado', periodicidad: 'por-evento' },
        origen: 'OFICIAL',
        fuentes: [FUENTES.sunarpEnLinea, FUENTES.sunarpCalculadora],
      },
      {
        id: 'parametros-urbanisticos',
        titulo: 'Certificado de Parámetros Urbanísticos y Edificatorios',
        detalle:
          'Dice cuántos pisos se pueden levantar, qué porcentaje de área libre hay que dejar, cuál es el retiro y qué usos admite la zonificación. Determina si el proyecto que se imagina es siquiera legal en ese lote.',
        entidad: 'Municipalidad distrital',
        costo: { min: 20, tipico: 70, max: 180, unidad: 'S/ por certificado', periodicidad: 'por-evento' },
        origen: 'OFICIAL',
        fuentes: [FUENTES.licenciaEdificacionA],
      },
    ],
    advertencias: [
      'Un terreno que solo tiene «constancia de posesión» no está inscrito: no sirve como garantía hipotecaria.',
      'Si el predio proviene de una posesión informal, la vía es COFOPRI antes que la notaría.',
    ],
    fuentes: [FUENTES.sunarpEnLinea, FUENTES.cofopri, FUENTES.licenciaEdificacionA],
  },
  {
    id: 'proyecto',
    nombre: 'Proyecto y licencia',
    resumen:
      'Planos de arquitectura, estructuras, instalaciones eléctricas y sanitarias, estudio de suelos y la licencia municipal. Es la etapa que más gente se salta y la que más caro sale saltarse.',
    participacion: 0.05,
    costoPorM2: { min: 25, tipico: 55, max: 120, unidad: 'S/ por m² techado', periodicidad: 'por-metro' },
    insumos: [],
    tramites: [
      tramiteLicenciaA,
      tramiteLicenciaB,
      {
        id: 'estudio-suelos',
        titulo: 'Estudio de mecánica de suelos (EMS)',
        detalle:
          'La norma E.050 del RNE define cuándo es obligatorio. Determina la capacidad portante del terreno y con ella la profundidad y dimensión de las zapatas. Sin EMS, el dimensionamiento de la cimentación es una apuesta.',
        entidad: 'Laboratorio de mecánica de suelos',
        costo: { min: 1200, tipico: 2200, max: 4500, unidad: 'S/ por estudio', periodicidad: 'por-evento' },
        origen: 'MERCADO',
        fuentes: [FUENTES.rne],
      },
    ],
    advertencias: [
      'Esta simulación NO dimensiona elementos estructurales. Las cantidades que muestra sirven para presupuestar, no para construir.',
      'Si se piensa levantar un segundo piso después, la cimentación y las columnas del primero deben diseñarse desde ahora para esa carga. Reforzar después cuesta varias veces más.',
    ],
    fuentes: [FUENTES.rne, FUENTES.licenciaEdificacionA],
  },
  {
    id: 'preliminares',
    nombre: 'Obras preliminares y movimiento de tierras',
    resumen: 'Limpieza del terreno, trazo y replanteo, excavación de zanjas para cimientos, eliminación de material excedente, agua y luz provisionales.',
    participacion: 0.05,
    costoPorM2: { min: 45, tipico: 80, max: 160, unidad: 'S/ por m² techado', periodicidad: 'por-metro' },
    insumos: [
      { material: 'Excavación manual de zanja', cantidad: 0.35, unidad: 'm³', por: 'm² techado', nota: 'Sube fuerte si el terreno tiene relleno o roca.' },
      { material: 'Eliminación de material excedente', cantidad: 0.44, unidad: 'm³', por: 'm² techado', nota: 'Se esponja ~25 % respecto del volumen excavado.' },
    ],
    tramites: [],
    advertencias: ['La conexión provisional de agua y energía para obra se tramita ante la EPS y la distribuidora eléctrica de la zona.'],
    fuentes: [FUENTES.rne, FUENTES.valoresUnitariosCap],
  },
  {
    id: 'cimentacion',
    nombre: 'Cimentación',
    resumen: 'Zapatas, cimientos corridos, sobrecimientos y falso piso. Es la parte que nadie ve y la única que no se puede corregir después sin demoler.',
    participacion: 0.14,
    costoPorM2: { min: 180, tipico: 260, max: 400, unidad: 'S/ por m² techado', periodicidad: 'por-metro' },
    insumos: [
      { material: 'Concreto ciclópeo 1:10 + 30 % piedra grande (cimiento corrido)', cantidad: 0.18, unidad: 'm³', por: 'm² techado' },
      { material: 'Cemento para cimiento corrido', cantidad: 2.9, unidad: 'bolsa', por: 'm³ de concreto ciclópeo' },
      { material: 'Concreto f’c = 210 para zapatas', cantidad: 0.07, unidad: 'm³', por: 'm² techado' },
      { material: 'Cemento para concreto f’c = 210', cantidad: 9.73, unidad: 'bolsa', por: 'm³ de concreto' },
      { material: 'Arena gruesa para concreto f’c = 210', cantidad: 0.52, unidad: 'm³', por: 'm³ de concreto' },
      { material: 'Piedra chancada 1/2" para concreto f’c = 210', cantidad: 0.53, unidad: 'm³', por: 'm³ de concreto' },
      { material: 'Acero de refuerzo en zapatas', cantidad: 55, unidad: 'kg', por: 'm³ de concreto de zapata' },
      { material: 'Concreto 1:8 + 25 % piedra mediana (sobrecimiento)', cantidad: 0.04, unidad: 'm³', por: 'm² techado' },
      { material: 'Falso piso e = 4", concreto 1:8', cantidad: 0.1, unidad: 'm³', por: 'm² de piso' },
    ],
    tramites: [],
    advertencias: [
      'La profundidad y dimensión de las zapatas dependen del estudio de suelos, no de la superficie de la casa.',
      'En suelos con sulfatos, el RNE E.060 exige cemento Tipo V o MS en todo elemento en contacto con el terreno.',
    ],
    fuentes: [FUENTES.rne, FUENTES.valoresUnitariosCap],
  },
  {
    id: 'estructura',
    nombre: 'Columnas y vigas',
    resumen: 'Habilitación y armado del acero, encofrado, vaciado y desencofrado de columnas y vigas. Aquí se decide cuánto peso podrá cargar la casa en el futuro.',
    participacion: 0.15,
    costoPorM2: { min: 200, tipico: 290, max: 430, unidad: 'S/ por m² techado', periodicidad: 'por-metro' },
    insumos: [
      { material: 'Concreto f’c = 210 en columnas y vigas', cantidad: 0.1, unidad: 'm³', por: 'm² techado' },
      { material: 'Cemento', cantidad: 9.73, unidad: 'bolsa', por: 'm³ de concreto f’c = 210' },
      { material: 'Acero de refuerzo en columnas', cantidad: 105, unidad: 'kg', por: 'm³ de concreto de columna', nota: 'Rango habitual 90–120 kg/m³ según el diseño estructural.' },
      { material: 'Acero de refuerzo en vigas', cantidad: 120, unidad: 'kg', por: 'm³ de concreto de viga' },
      { material: 'Encofrado (madera tornillo, uso repetido)', cantidad: 4.2, unidad: 'm²', por: 'm² techado' },
      { material: 'Alambre negro N.° 16 para amarre', cantidad: 0.06, unidad: 'kg', por: 'kg de acero' },
    ],
    tramites: [],
    advertencias: [
      'La cantidad de acero depende del cálculo estructural del proyecto. El valor mostrado es un rendimiento de referencia para presupuestar.',
      'Dejar las mechas de acero para el siguiente piso cuesta poco ahora y muchísimo después.',
    ],
    fuentes: [FUENTES.rne, FUENTES.valoresUnitariosCap],
  },
  {
    id: 'losa',
    nombre: 'Losa aligerada (el techo)',
    resumen:
      'Losa aligerada de 20 cm con ladrillo de techo, viguetas y losa de compresión de 5 cm. El día del vaciado es logística pura: hay una ventana de tiempo y no se puede parar a la mitad.',
    participacion: 0.12,
    costoPorM2: { min: 150, tipico: 215, max: 320, unidad: 'S/ por m² de losa', periodicidad: 'por-metro' },
    insumos: [
      { material: 'Ladrillo de techo 15 × 30 × 30 cm', cantidad: 8.33, unidad: 'unidad', por: 'm² de losa e = 20 cm' },
      { material: 'Concreto f’c = 210 en losa', cantidad: 0.087, unidad: 'm³', por: 'm² de losa e = 20 cm' },
      { material: 'Cemento', cantidad: 9.73, unidad: 'bolsa', por: 'm³ de concreto f’c = 210' },
      { material: 'Acero de refuerzo en losa (viguetas + temperatura)', cantidad: 5.5, unidad: 'kg', por: 'm² de losa' },
      { material: 'Encofrado de fondo de losa', cantidad: 1.05, unidad: 'm²', por: 'm² de losa' },
    ],
    tramites: [],
    advertencias: [
      'El desencofrado de fondo de losa no debe hacerse antes del plazo que fija la norma E.060 según el tipo de elemento y las cargas.',
      'El curado del concreto durante los primeros días define la resistencia real que alcanzará: es gratis y es lo primero que se omite.',
    ],
    fuentes: [FUENTES.rne, FUENTES.valoresUnitariosCap],
  },
  {
    id: 'albanileria',
    nombre: 'Muros y tabiquería',
    resumen: 'Asentado de ladrillo en muros portantes y tabiques, más los dinteles y alféizares.',
    participacion: 0.1,
    costoPorM2: { min: 110, tipico: 165, max: 250, unidad: 'S/ por m² techado', periodicidad: 'por-metro' },
    insumos: [
      { material: 'Ladrillo King Kong, aparejo de soga', cantidad: 39, unidad: 'unidad', por: 'm² de muro' },
      { material: 'Ladrillo King Kong, aparejo de cabeza', cantidad: 68, unidad: 'unidad', por: 'm² de muro' },
      { material: 'Mortero 1:5 para asentado', cantidad: 0.029, unidad: 'm³', por: 'm² de muro de soga' },
      { material: 'Cemento en mortero de asentado', cantidad: 0.22, unidad: 'bolsa', por: 'm² de muro de soga' },
      { material: 'Arena gruesa en mortero de asentado', cantidad: 0.03, unidad: 'm³', por: 'm² de muro de soga' },
      { material: 'Superficie de muro por metro techado', cantidad: 2.0, unidad: 'm² de muro', por: 'm² techado', nota: 'Referencia para vivienda de un piso con distribución convencional.' },
    ],
    tramites: [],
    advertencias: ['El ladrillo de 18 huecos es tabique. Para muro portante el RNE E.070 limita el porcentaje de vacíos.'],
    fuentes: [FUENTES.rne, FUENTES.valoresUnitariosCap],
  },
  {
    id: 'instalaciones',
    nombre: 'Instalaciones sanitarias y eléctricas',
    resumen: 'Redes de agua fría y caliente, desagüe y ventilación, tablero, circuitos, salidas y puesta a tierra. Van embebidas antes del tarrajeo: rehacerlas después implica picar.',
    participacion: 0.1,
    costoPorM2: { min: 100, tipico: 160, max: 280, unidad: 'S/ por m² techado', periodicidad: 'por-metro' },
    insumos: [
      { material: 'Tubería PVC-SAP para agua fría', cantidad: 0.9, unidad: 'm', por: 'm² techado' },
      { material: 'Tubería PVC-SAL para desagüe', cantidad: 0.6, unidad: 'm', por: 'm² techado' },
      { material: 'Tubería PVC-SEL para electricidad', cantidad: 1.8, unidad: 'm', por: 'm² techado' },
      { material: 'Cable THW / NH-80', cantidad: 5.5, unidad: 'm', por: 'm² techado' },
      { material: 'Pozo a tierra', cantidad: 1, unidad: 'unidad', por: 'vivienda', nota: 'Exigido por el Código Nacional de Electricidad para la conexión definitiva.' },
    ],
    tramites: [
      {
        id: 'conexion-electrica',
        titulo: 'Conexión eléctrica domiciliaria definitiva',
        detalle: 'Se solicita a la distribuidora de la zona (Enel/Luz del Sur en Lima, Hidrandina, Seal, Electro Sur Este, etc.). El costo de conexión está regulado y publicado en el pliego tarifario.',
        entidad: 'Empresa distribuidora de electricidad',
        costo: { min: 350, tipico: 700, max: 1600, unidad: 'S/ por conexión', periodicidad: 'por-evento' },
        origen: 'REGULADO',
        fuentes: [FUENTES.osinergminTarifas],
      },
      {
        id: 'conexion-agua',
        titulo: 'Conexión de agua potable y alcantarillado',
        detalle: 'Se solicita a la EPS de la zona (SEDAPAL en Lima). El cargo de conexión está en el estudio tarifario aprobado por SUNASS para esa EPS.',
        entidad: 'Empresa prestadora de servicios de saneamiento (EPS)',
        costo: { min: 800, tipico: 1600, max: 3500, unidad: 'S/ por conexión', periodicidad: 'por-evento' },
        origen: 'REGULADO',
        fuentes: [FUENTES.sedapal, FUENTES.sunassPublicaciones],
      },
    ],
    advertencias: ['Sin pozo a tierra la distribuidora puede observar la instalación interior antes de dar el suministro definitivo.'],
    fuentes: [FUENTES.osinergminTarifas, FUENTES.sunass, FUENTES.rne],
  },
  {
    id: 'acabados',
    nombre: 'Acabados',
    resumen:
      'Tarrajeo, pisos, carpintería, aparatos sanitarios, pintura, puertas y ventanas. Es la partida más elástica del presupuesto: aquí es donde una misma casa puede costar el doble.',
    participacion: 0.26,
    costoPorM2: { min: 300, tipico: 620, max: 1400, unidad: 'S/ por m² techado', periodicidad: 'por-metro' },
    insumos: [
      { material: 'Tarrajeo de muros e = 1.5 cm, mortero 1:5', cantidad: 5.2, unidad: 'm²', por: 'm² techado', nota: 'Se tarrajean ambas caras del muro.' },
      { material: 'Cemento para tarrajeo', cantidad: 0.117, unidad: 'bolsa', por: 'm² de tarrajeo' },
      { material: 'Arena fina para tarrajeo', cantidad: 0.0161, unidad: 'm³', por: 'm² de tarrajeo' },
      { material: 'Piso cerámico o porcelanato', cantidad: 1.05, unidad: 'm²', por: 'm² de piso', nota: 'Se compra 5 % extra por cortes y desperdicio.' },
      { material: 'Pintura látex, dos manos', cantidad: 0.25, unidad: 'galón', por: 'm² de superficie pintada' },
    ],
    tramites: [],
    advertencias: [
      'Los acabados se pueden hacer por etapas sin comprometer la estructura: es la palanca real de la construcción progresiva.',
      'Los Valores Unitarios Oficiales de Edificación separan estructuras, acabados e instalaciones en categorías A–I. Sirven para ubicar en qué nivel está un presupuesto.',
    ],
    fuentes: [FUENTES.valoresUnitariosCap, FUENTES.valoresUnitariosRm],
  },
  {
    id: 'formalizacion',
    nombre: 'Conformidad de obra y declaratoria de fábrica',
    resumen: 'Cerrar el ciclo: la municipalidad certifica que lo construido corresponde a lo aprobado y SUNARP inscribe la edificación en la partida del predio.',
    participacion: 0.02,
    costoPorM2: { min: 8, tipico: 18, max: 45, unidad: 'S/ por m² techado', periodicidad: 'por-metro' },
    insumos: [],
    tramites: [tramiteDeclaratoria],
    advertencias: [
      'Una casa sin declaratoria de fábrica inscrita no puede usarse como garantía hipotecaria y complica cualquier venta o sucesión.',
      'Al inscribir la fábrica, el autoavalúo sube y con él el impuesto predial y los arbitrios.',
    ],
    fuentes: [FUENTES.sunarpCalculadora, FUENTES.satLima],
  },
]

// ---------------------------------------------------------- costos indirectos

export const COSTOS_INDIRECTOS: ItemCosto[] = [
  {
    id: 'direccion-tecnica',
    etiqueta: 'Dirección técnica de obra',
    descripcion: 'Un ingeniero o arquitecto responsable de la obra, aunque sea por visitas periódicas. En autoconstrucción es lo primero que se recorta y la causa más frecuente de los problemas que aparecen después.',
    monto: { min: 0.03, tipico: 0.06, max: 0.1, unidad: 'proporción del costo directo', periodicidad: 'unico' },
    origen: 'MERCADO',
    fuentes: [FUENTES.capeco],
  },
  {
    id: 'seguro-car',
    etiqueta: 'Póliza CAR (todo riesgo construcción)',
    descripcion: 'Cubre daños durante la obra y responsabilidad civil frente a terceros. Exigida en algunas modalidades de licencia y por los bancos al financiar construcción.',
    monto: { min: 0.004, tipico: 0.008, max: 0.015, unidad: 'proporción del costo directo', periodicidad: 'unico' },
    origen: 'MERCADO',
    fuentes: [FUENTES.licenciaModalidades],
  },
  {
    id: 'contingencia',
    etiqueta: 'Contingencia de obra',
    descripcion: 'Reserva para lo que no estaba en el presupuesto: terreno peor de lo esperado, subida de precio del acero, un cambio de decisión a media obra. Sin esta reserva, la obra se detiene.',
    monto: { min: 0.05, tipico: 0.1, max: 0.2, unidad: 'proporción del costo directo', periodicidad: 'unico' },
    origen: 'ESTIMADO',
    fuentes: [FUENTES.capeco, FUENTES.ineiPrecios],
  },
]

/** Costo directo por m² sumando todas las fases, en rango. */
export function costoDirectoPorM2(): { min: number; tipico: number; max: number } {
  return FASES_OBRA.reduce(
    (acc, fase) => ({
      min: acc.min + (fase.costoPorM2.min ?? fase.costoPorM2.tipico),
      tipico: acc.tipico + fase.costoPorM2.tipico,
      max: acc.max + (fase.costoPorM2.max ?? fase.costoPorM2.tipico),
    }),
    { min: 0, tipico: 0, max: 0 },
  )
}

/**
 * Cantidades de material para un área techada dada, agregando las fases.
 * Devuelve solo los insumos expresados por m² techado o por m² de losa/piso,
 * que son los que se pueden escalar directamente con el área.
 */
export interface CantidadObra {
  material: string
  cantidad: number
  unidad: string
  fase: string
}

export function metradoParaArea(areaM2: number, pisos = 1): CantidadObra[] {
  const area = Math.max(0, areaM2) * Math.max(1, pisos)
  const salida: CantidadObra[] = []

  const concretoPorM2 = 0.07 + 0.1 + 0.087 // zapatas + columnas/vigas + losa
  const cementoConcreto = concretoPorM2 * 9.73
  const cementoCiclopeo = 0.18 * 2.9
  const cementoMuros = 2.0 * 0.22
  const cementoTarrajeo = 5.2 * 0.117
  const cementoTotalPorM2 = cementoConcreto + cementoCiclopeo + cementoMuros + cementoTarrajeo

  salida.push({ material: 'Cemento (bolsas de 42.5 kg)', cantidad: cementoTotalPorM2 * area, unidad: 'bolsa', fase: 'Todas las fases' })
  salida.push({ material: 'Arena gruesa', cantidad: (concretoPorM2 * 0.52 + 2.0 * 0.03) * area, unidad: 'm³', fase: 'Concreto y mortero' })
  salida.push({ material: 'Arena fina', cantidad: 5.2 * 0.0161 * area, unidad: 'm³', fase: 'Tarrajeo' })
  salida.push({ material: 'Piedra chancada 1/2"', cantidad: concretoPorM2 * 0.53 * area, unidad: 'm³', fase: 'Concreto' })
  salida.push({ material: 'Acero de refuerzo', cantidad: (0.07 * 55 + 0.1 * 110 + 5.5) * area, unidad: 'kg', fase: 'Zapatas, columnas, vigas y losa' })
  salida.push({ material: 'Ladrillo King Kong', cantidad: 2.0 * 39 * area, unidad: 'unidad', fase: 'Muros y tabiquería' })
  salida.push({ material: 'Ladrillo de techo 15 × 30 × 30', cantidad: 8.33 * Math.max(0, areaM2) * Math.max(1, pisos), unidad: 'unidad', fase: 'Losa aligerada' })
  salida.push({ material: 'Concreto total', cantidad: concretoPorM2 * area, unidad: 'm³', fase: 'Estructura' })

  return salida.map((item) => ({ ...item, cantidad: Math.round(item.cantidad * 10) / 10 }))
}

/** Costo de materiales para un área techada, usando el rango de precios. */
export function costoMaterialesParaArea(areaM2: number, pisos = 1) {
  const metrado = metradoParaArea(areaM2, pisos)
  const mapa: Record<string, string> = {
    'Cemento (bolsas de 42.5 kg)': 'cemento',
    'Arena gruesa': 'arena-gruesa',
    'Arena fina': 'arena-fina',
    'Piedra chancada 1/2"': 'piedra-chancada',
    'Acero de refuerzo': 'acero',
    'Ladrillo King Kong': 'ladrillo-kk',
    'Ladrillo de techo 15 × 30 × 30': 'ladrillo-techo',
  }
  return metrado
    .filter((item) => mapa[item.material])
    .map((item) => {
      const precio = precioMaterial(mapa[item.material])
      if (!precio) return null
      return {
        ...item,
        precioUnitario: precio,
        subtotalMin: item.cantidad * precio.min,
        subtotalTipico: item.cantidad * precio.tipico,
        subtotalMax: item.cantidad * precio.max,
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
}

export const TRAMITES_CONSTRUCCION = [tramiteLicenciaA, tramiteLicenciaB, tramiteDeclaratoria]
