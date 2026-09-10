import { FUENTES } from '../fuentes'
import type { Fuente, ItemCosto, Monto } from '../tipos'

/**
 * Tener un hijo en Perú, desde antes de la concepción hasta el control de los
 * 11 años.
 *
 * El esquema de vacunación se transcribe del Esquema Nacional de
 * Inmunizaciones publicado por el MINSA (página actualizada el 31 de julio de
 * 2026): 23 vacunas y un anticuerpo monoclonal, gratuitos en establecimientos
 * del Estado. El costo privado que aparece al costado es referencia de mercado
 * para quien decide atenderse fuera del sistema público — no es lo que hay que
 * pagar.
 */

export type EtapaFamiliaId = 'preconcepcion' | 'gestacion' | 'parto' | 'primer-ano' | 'primera-infancia' | 'escolar'

export interface EtapaFamilia {
  id: EtapaFamiliaId
  numero: string
  titulo: string
  resumen: string
  cuando: string
}

export const ETAPAS_FAMILIA: EtapaFamilia[] = [
  {
    id: 'preconcepcion',
    numero: '01',
    titulo: 'Antes de concebir',
    resumen: 'La etapa que casi nadie presupuesta y la que más margen de prevención ofrece: tamizajes, suplementación y tratamiento de condiciones que después ya no se pueden corregir.',
    cuando: 'De 3 a 6 meses antes de buscar el embarazo',
  },
  {
    id: 'gestacion',
    numero: '02',
    titulo: 'Gestación',
    resumen: 'Controles prenatales, exámenes de laboratorio, ecografías y vacunas para la gestante.',
    cuando: 'Semanas 1 a 40',
  },
  { id: 'parto', numero: '03', titulo: 'Parto y puerperio', resumen: 'Atención del parto, hospitalización, atención inmediata del recién nacido y controles del puerperio.', cuando: 'Semana 37 en adelante' },
  { id: 'primer-ano', numero: '04', titulo: 'Primer año', resumen: 'La secuencia más densa de vacunas y controles de toda la vida: CRED mensual y siete citas de inmunización.', cuando: '0 a 12 meses' },
  { id: 'primera-infancia', numero: '05', titulo: 'Primera infancia', resumen: 'Refuerzos de vacunas, controles cada dos o tres meses y suplementación preventiva de hierro.', cuando: '1 a 5 años' },
  { id: 'escolar', numero: '06', titulo: 'Edad escolar', resumen: 'Controles CRED hasta los 11 años, vacuna contra el VPH entre los 9 y 18 años, y el gasto se traslada a educación.', cuando: '6 a 18 años' },
]

// ------------------------------------------------------------- preconcepción

export const CUIDADOS_PRECONCEPCION: ItemCosto[] = [
  {
    id: 'acido-folico',
    etiqueta: 'Ácido fólico preconcepcional',
    descripcion:
      'Iniciarlo al menos un mes antes de la concepción y mantenerlo en el primer trimestre reduce el riesgo de defectos del tubo neural. Se entrega gratis en los establecimientos del MINSA dentro de la atención preconcepcional.',
    monto: { min: 0, tipico: 0, max: 45, unidad: 'S/ (gratuito en el Estado; costo privado por frasco)', periodicidad: 'mensual' },
    origen: 'OFICIAL',
    fuentes: [FUENTES.minsaPublicaciones, FUENTES.sis],
  },
  {
    id: 'tamizaje-anemia',
    etiqueta: 'Tamizaje de anemia y perfil hematológico',
    descripcion:
      'La anemia materna es el déficit nutricional más frecuente en el país y afecta el desarrollo del bebé. Detectarla y tratarla antes del embarazo es más simple que corregirla durante.',
    monto: { min: 0, tipico: 0, max: 90, unidad: 'S/ (gratuito con SIS; costo privado por examen)', periodicidad: 'por-evento' },
    origen: 'OFICIAL',
    fuentes: [FUENTES.sis, FUENTES.minsaCred],
  },
  {
    id: 'tamizaje-its',
    etiqueta: 'Tamizaje de VIH, sífilis y hepatitis B',
    descripcion:
      'Detectarlas antes o al inicio del embarazo permite intervenir para evitar la transmisión al bebé. El tratamiento y el seguimiento están cubiertos por el Estado.',
    monto: { min: 0, tipico: 0, max: 150, unidad: 'S/ (gratuito en el Estado; costo privado por panel)', periodicidad: 'por-evento' },
    origen: 'OFICIAL',
    fuentes: [FUENTES.sis, FUENTES.minsaPublicaciones],
  },
  {
    id: 'consejeria-genetica',
    etiqueta: 'Consejería y evaluación genética',
    descripcion:
      'Indicada cuando hay antecedentes familiares de enfermedades hereditarias, consanguinidad, pérdidas gestacionales repetidas o edad materna avanzada. En el sistema público se accede por referencia desde el primer nivel; en el privado el costo varía mucho según el panel solicitado.',
    monto: { min: 250, tipico: 900, max: 4500, unidad: 'S/ por evaluación', periodicidad: 'por-evento' },
    origen: 'MERCADO',
    fuentes: [FUENTES.susalud, FUENTES.minsaPublicaciones],
    advertencia: 'No todos los paneles genéticos comerciales tienen utilidad clínica demostrada. La indicación debe venir de un genetista, no de una promoción.',
  },
  {
    id: 'control-cronico',
    etiqueta: 'Control de condiciones crónicas previas',
    descripcion:
      'Diabetes, hipertensión, hipotiroidismo, epilepsia y obesidad cambian el riesgo del embarazo y a veces obligan a cambiar la medicación antes de concebir. Esta consulta previa es la de mayor impacto de toda la etapa.',
    monto: { min: 0, tipico: 0, max: 250, unidad: 'S/ (gratuito con SIS o EsSalud; costo privado por consulta)', periodicidad: 'por-evento' },
    origen: 'OFICIAL',
    fuentes: [FUENTES.sis, FUENTES.essalud],
  },
]

// ----------------------------------------------------------------- gestación

export const CUIDADOS_GESTACION: ItemCosto[] = [
  {
    id: 'controles-prenatales',
    etiqueta: 'Controles prenatales (mínimo seis)',
    descripcion:
      'El MINSA considera gestante controlada a partir de seis atenciones prenatales. Incluyen peso, presión, altura uterina, latidos fetales, tamizajes y consejería. Gratuitos en el primer nivel de atención.',
    monto: { min: 0, tipico: 0, max: 180, unidad: 'S/ por control (gratuito en el Estado)', periodicidad: 'por-evento' },
    origen: 'OFICIAL',
    fuentes: [FUENTES.sis, FUENTES.minsaPublicaciones],
  },
  {
    id: 'ecografias',
    etiqueta: 'Ecografías obstétricas',
    descripcion: 'Al menos una por trimestre. La del segundo trimestre (morfológica, entre las semanas 20 y 24) es la que detecta malformaciones estructurales.',
    monto: { min: 0, tipico: 120, max: 400, unidad: 'S/ por ecografía', periodicidad: 'por-evento' },
    origen: 'MERCADO',
    fuentes: [FUENTES.sis, FUENTES.susalud],
  },
  {
    id: 'suplementacion-gestante',
    etiqueta: 'Suplementación con hierro y ácido fólico',
    descripcion: 'Se entrega gratuitamente durante toda la gestación en los establecimientos del MINSA.',
    monto: { min: 0, tipico: 0, max: 60, unidad: 'S/ al mes (gratuito en el Estado)', periodicidad: 'mensual' },
    origen: 'OFICIAL',
    fuentes: [FUENTES.sis],
  },
]

// ---------------------------------------------------------------------- parto

export const OPCIONES_PARTO: ItemCosto[] = [
  {
    id: 'parto-minsa',
    etiqueta: 'Parto en establecimiento del MINSA con SIS',
    descripcion: 'Atención del parto, hospitalización y atención inmediata del recién nacido sin costo para la afiliada al SIS.',
    monto: { tipico: 0, unidad: 'S/ (cobertura SIS)', periodicidad: 'por-evento' },
    origen: 'OFICIAL',
    fuentes: [FUENTES.sis],
  },
  {
    id: 'parto-essalud',
    etiqueta: 'Parto en EsSalud',
    descripcion: 'Cubierto para la asegurada titular y para la cónyuge o conviviente del asegurado. El aporte del 9 % lo hace el empleador.',
    monto: { tipico: 0, unidad: 'S/ (cobertura EsSalud)', periodicidad: 'por-evento' },
    origen: 'OFICIAL',
    fuentes: [FUENTES.essalud],
  },
  {
    id: 'parto-clinica',
    etiqueta: 'Parto en clínica privada',
    descripcion:
      'El paquete varía según sea vaginal o cesárea, los días de hospitalización y si el recién nacido requiere unidad de cuidados intermedios o intensivos. Esa última contingencia es la que dispara la cuenta.',
    monto: { min: 4500, tipico: 11_000, max: 35_000, unidad: 'S/ por parto', periodicidad: 'por-evento' },
    origen: 'MERCADO',
    fuentes: [FUENTES.susalud],
    advertencia:
      'Los planes privados suelen tener periodo de carencia para maternidad (con frecuencia de 10 a 12 meses). Contratar el seguro ya embarazada normalmente no cubre ese parto.',
  },
]

// ------------------------------------------------------------------- vacunas

export interface Vacuna {
  id: string
  edad: string
  /** Meses desde el nacimiento en que corresponde la dosis. */
  mes: number
  vacuna: string
  protegeDe: string
  dosis: string
  /** Costo referencial en el sector privado, por dosis. Gratuita en el Estado. */
  costoPrivado?: Monto
}

/**
 * Esquema Nacional de Inmunizaciones — MINSA.
 * Todas estas vacunas son gratuitas en establecimientos del Estado.
 */
export const ESQUEMA_VACUNACION: Vacuna[] = [
  { id: 'bcg', edad: 'Recién nacido', mes: 0, vacuna: 'BCG', protegeDe: 'Formas graves de tuberculosis infantil', dosis: 'Dosis única', costoPrivado: { min: 60, tipico: 90, max: 130, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'hvb-rn', edad: 'Recién nacido', mes: 0, vacuna: 'Hepatitis B (HVB)', protegeDe: 'Hepatitis B', dosis: 'Dosis única al nacer', costoPrivado: { min: 60, tipico: 85, max: 120, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'nirsevimab', edad: 'Recién nacido', mes: 0, vacuna: 'Nirsevimab (anticuerpo monoclonal)', protegeDe: 'Infecciones respiratorias graves por Virus Respiratorio Sincitial', dosis: 'Dosis única', costoPrivado: { min: 900, tipico: 1400, max: 2200, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'hexa-1', edad: '2 meses', mes: 2, vacuna: 'Hexavalente (1.ª dosis)', protegeDe: 'Difteria, tétanos, tos ferina, hepatitis B, poliomielitis y Haemophilus influenzae tipo b', dosis: '1 de 3', costoPrivado: { min: 220, tipico: 320, max: 430, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'rota-1', edad: '2 meses', mes: 2, vacuna: 'Rotavirus (1.ª dosis)', protegeDe: 'Diarreas graves por rotavirus', dosis: '1 de 2', costoPrivado: { min: 180, tipico: 260, max: 350, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'neumo-1', edad: '2 meses', mes: 2, vacuna: 'Antineumocócica (1.ª dosis)', protegeDe: 'Neumonía, meningitis y otitis media', dosis: '1 de 3', costoPrivado: { min: 250, tipico: 340, max: 460, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'hexa-2', edad: '4 meses', mes: 4, vacuna: 'Hexavalente (2.ª dosis)', protegeDe: 'Difteria, tétanos, tos ferina, hepatitis B, polio y Hib', dosis: '2 de 3', costoPrivado: { min: 220, tipico: 320, max: 430, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'rota-2', edad: '4 meses', mes: 4, vacuna: 'Rotavirus (2.ª dosis)', protegeDe: 'Diarreas graves por rotavirus', dosis: '2 de 2', costoPrivado: { min: 180, tipico: 260, max: 350, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'neumo-2', edad: '4 meses', mes: 4, vacuna: 'Antineumocócica (2.ª dosis)', protegeDe: 'Neumonía, meningitis y otitis media', dosis: '2 de 3', costoPrivado: { min: 250, tipico: 340, max: 460, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'hexa-3', edad: '6 meses', mes: 6, vacuna: 'Hexavalente (3.ª dosis)', protegeDe: 'Difteria, tétanos, tos ferina, hepatitis B, polio y Hib', dosis: '3 de 3', costoPrivado: { min: 220, tipico: 320, max: 430, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'influenza-1', edad: '6 meses', mes: 6, vacuna: 'Influenza pediátrica (1.ª dosis)', protegeDe: 'Gripe estacional', dosis: '1 de 2', costoPrivado: { min: 70, tipico: 110, max: 160, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'influenza-2', edad: '7 meses', mes: 7, vacuna: 'Influenza pediátrica (2.ª dosis)', protegeDe: 'Gripe estacional y sus complicaciones', dosis: '2 de 2', costoPrivado: { min: 70, tipico: 110, max: 160, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'spr-1', edad: '12 meses', mes: 12, vacuna: 'SPR (1.ª dosis)', protegeDe: 'Sarampión, paperas y rubéola', dosis: '1 de 2', costoPrivado: { min: 150, tipico: 220, max: 300, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'neumo-3', edad: '12 meses', mes: 12, vacuna: 'Antineumocócica (3.ª dosis)', protegeDe: 'Neumonía, meningitis y otitis media', dosis: '3 de 3', costoPrivado: { min: 250, tipico: 340, max: 460, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'varicela', edad: '12 meses', mes: 12, vacuna: 'Varicela', protegeDe: 'Varicela y sus complicaciones agudas', dosis: 'Dosis única', costoPrivado: { min: 180, tipico: 260, max: 360, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'influenza-anual-1', edad: '12 meses', mes: 12, vacuna: 'Influenza pediátrica (dosis anual)', protegeDe: 'Gripe estacional', dosis: 'Anual', costoPrivado: { min: 70, tipico: 110, max: 160, unidad: 'S/ por dosis', periodicidad: 'anual' } },
  { id: 'meningo-1', edad: '13 meses', mes: 13, vacuna: 'Meningococo (1.ª dosis)', protegeDe: 'Meningitis meningocócica', dosis: '1 de 2 — prioritaria en niños que viven con VIH', costoPrivado: { min: 300, tipico: 420, max: 600, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'ama', edad: '15 meses', mes: 15, vacuna: 'Antiamarílica (AMA)', protegeDe: 'Fiebre amarilla', dosis: 'Dosis única', costoPrivado: { min: 120, tipico: 190, max: 280, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'hepatitis-a', edad: '15 meses', mes: 15, vacuna: 'Hepatitis A', protegeDe: 'Hepatitis A', dosis: 'Dosis única', costoPrivado: { min: 150, tipico: 230, max: 320, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'meningo-2', edad: '15 meses', mes: 15, vacuna: 'Meningococo (2.ª dosis)', protegeDe: 'Meningitis meningocócica', dosis: '2 de 2', costoPrivado: { min: 300, tipico: 420, max: 600, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'dpt-r1', edad: '18 meses', mes: 18, vacuna: 'DPT (1.er refuerzo)', protegeDe: 'Difteria, tétanos y tos ferina', dosis: 'Refuerzo', costoPrivado: { min: 90, tipico: 140, max: 200, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'polio-r1', edad: '18 meses', mes: 18, vacuna: 'Antipolio (1.er refuerzo, IPV o APO)', protegeDe: 'Parálisis flácida aguda', dosis: 'Refuerzo', costoPrivado: { min: 90, tipico: 140, max: 200, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'spr-2', edad: '18 meses', mes: 18, vacuna: 'SPR (2.ª dosis)', protegeDe: 'Sarampión, paperas y rubéola', dosis: '2 de 2', costoPrivado: { min: 150, tipico: 220, max: 300, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'influenza-2a', edad: '2 años', mes: 24, vacuna: 'Influenza pediátrica', protegeDe: 'Gripe estacional', dosis: 'Anual', costoPrivado: { min: 70, tipico: 110, max: 160, unidad: 'S/ por dosis', periodicidad: 'anual' } },
  { id: 'influenza-3a', edad: '3 años', mes: 36, vacuna: 'Influenza pediátrica', protegeDe: 'Gripe estacional', dosis: 'Anual', costoPrivado: { min: 70, tipico: 110, max: 160, unidad: 'S/ por dosis', periodicidad: 'anual' } },
  { id: 'influenza-4a', edad: '4 años', mes: 48, vacuna: 'Influenza pediátrica', protegeDe: 'Gripe estacional', dosis: 'Anual', costoPrivado: { min: 70, tipico: 110, max: 160, unidad: 'S/ por dosis', periodicidad: 'anual' } },
  { id: 'dpt-r2', edad: '4 años', mes: 48, vacuna: 'DPT (2.º refuerzo)', protegeDe: 'Difteria, tétanos y tos ferina', dosis: 'Refuerzo', costoPrivado: { min: 90, tipico: 140, max: 200, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'apo-r2', edad: '4 años', mes: 48, vacuna: 'Antipolio oral (2.º refuerzo)', protegeDe: 'Poliomielitis', dosis: 'Refuerzo', costoPrivado: { min: 90, tipico: 140, max: 200, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
  { id: 'vph', edad: '9 a 18 años', mes: 108, vacuna: 'Virus del Papiloma Humano (VPH)', protegeDe: 'Cáncer de cuello uterino, lesiones precancerosas y verrugas genitales', dosis: 'Dosis única', costoPrivado: { min: 350, tipico: 500, max: 700, unidad: 'S/ por dosis', periodicidad: 'por-evento' } },
]

/** Vacunas del esquema para la gestante. */
export const VACUNAS_GESTANTE: Vacuna[] = [
  { id: 'vrs-gestante', edad: 'Semanas 32 a 36', mes: 8, vacuna: 'Virus Respiratorio Sincitial (VRS)', protegeDe: 'Infecciones respiratorias graves del recién nacido', dosis: 'Dosis única' },
  { id: 'tdap', edad: 'Semanas 20 a 36', mes: 6, vacuna: 'Tdap', protegeDe: 'Difteria, tos ferina y tétanos', dosis: 'Una en cada gestación' },
  { id: 'hvb-gestante', edad: 'Durante la gestación', mes: 4, vacuna: 'Hepatitis B', protegeDe: 'Transmisión vertical del virus al recién nacido', dosis: 'Tres dosis' },
  { id: 'dt-gestante', edad: 'Durante la gestación', mes: 4, vacuna: 'DT', protegeDe: 'Tétanos neonatal y difteria', dosis: 'Esquema regular' },
  { id: 'influenza-gestante', edad: 'Cualquier trimestre', mes: 5, vacuna: 'Influenza', protegeDe: 'Complicaciones de la gripe estacional', dosis: 'Dosis de temporada' },
]

export const FUENTES_VACUNACION: Fuente[] = [FUENTES.minsaVacunas, FUENTES.sis, FUENTES.minsaPublicaciones]

/** Costo total del esquema completo si se aplicara íntegro en el sector privado. */
export function costoEsquemaPrivado(): { min: number; tipico: number; max: number } {
  return ESQUEMA_VACUNACION.reduce(
    (acc, v) => ({
      min: acc.min + (v.costoPrivado?.min ?? v.costoPrivado?.tipico ?? 0),
      tipico: acc.tipico + (v.costoPrivado?.tipico ?? 0),
      max: acc.max + (v.costoPrivado?.max ?? v.costoPrivado?.tipico ?? 0),
    }),
    { min: 0, tipico: 0, max: 0 },
  )
}

// ---------------------------------------------------------------------- CRED

export const CALENDARIO_CRED = [
  { rango: '0 a 29 días', frecuencia: 'Semanal', controlesAlPeriodo: 4 },
  { rango: '1 a 11 meses', frecuencia: 'Mensual', controlesAlPeriodo: 11 },
  { rango: '1 a 2 años', frecuencia: 'Cada dos meses', controlesAlPeriodo: 6 },
  { rango: '2 a 4 años', frecuencia: 'Cada tres meses', controlesAlPeriodo: 8 },
] as const

export const CONTENIDO_CRED = [
  'Evaluación nutricional y física: peso y talla para detectar desnutrición, sobrepeso u obesidad a tiempo.',
  'Desarrollo psicomotor: habilidades motoras, de lenguaje, cognitivas y sociales según los hitos de la edad.',
  'Inmunizaciones: aplicación de las vacunas que corresponden según el esquema nacional vigente.',
  'Suplementación preventiva: entrega gratuita de hierro y tamizaje periódico de anemia y parasitosis.',
]

export const FUENTES_CRED: Fuente[] = [FUENTES.minsaCred, FUENTES.minsaCredServicio, FUENTES.sis]

// ------------------------------------------------------- costo mensual de crianza

export const COSTOS_CRIANZA: ItemCosto[] = [
  {
    id: 'panales-formula',
    etiqueta: 'Pañales, higiene y alimentación complementaria (0–2 años)',
    descripcion: 'El gasto más constante de los dos primeros años. La lactancia materna exclusiva los primeros seis meses reduce fuertemente la parte de fórmula.',
    monto: { min: 180, tipico: 380, max: 750, unidad: 'S/ al mes', periodicidad: 'mensual' },
    origen: 'MERCADO',
    fuentes: [FUENTES.minsaCred],
  },
  {
    id: 'cuidado-infantil',
    etiqueta: 'Cuidado infantil mientras los adultos trabajan',
    descripcion: 'Cuna, guardería o una persona cuidadora. Es el costo que decide, en la práctica, si el segundo ingreso del hogar se mantiene o no.',
    monto: { min: 0, tipico: 650, max: 2200, unidad: 'S/ al mes', periodicidad: 'mensual' },
    origen: 'MERCADO',
    fuentes: [FUENTES.mimp, FUENTES.mtpe],
  },
  {
    id: 'salud-nino',
    etiqueta: 'Salud del niño fuera de lo cubierto',
    descripcion: 'Consultas, medicamentos y emergencias no cubiertas. Con SIS o EsSalud el gasto de bolsillo baja mucho, pero no llega a cero.',
    monto: { min: 0, tipico: 120, max: 500, unidad: 'S/ al mes', periodicidad: 'mensual' },
    origen: 'ESTIMADO',
    fuentes: [FUENTES.sis, FUENTES.essalud, FUENTES.susalud],
  },
]
