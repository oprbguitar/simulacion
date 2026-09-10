import { FUENTES } from '../fuentes'
import type { Imprevisto } from '../tipos'

/**
 * Lo que el plan no contempla.
 *
 * Las probabilidades anuales son referencias gruesas para que el simulador
 * pueda mostrar frecuencia, no predicciones sobre una persona concreta. Cada
 * una lleva la vía institucional para responder cuando ocurre: esa parte sí es
 * verificable y es la más útil.
 */

export const IMPREVISTOS: Imprevisto[] = [
  {
    id: 'desempleo',
    titulo: 'Pérdida del empleo',
    detalle:
      'El ingreso se corta y con él la cobertura de EsSalud (queda un periodo de latencia limitado). Si hay crédito hipotecario, la cuota sigue corriendo igual.',
    probabilidadAnual: 0.12,
    impacto: { min: 3, tipico: 5, max: 9, unidad: 'meses sin ingreso principal', periodicidad: 'por-evento' },
    duracionMeses: 5,
    mitigacion: [
      'Un fondo de emergencia de al menos seis meses de gastos esenciales.',
      'La CTS existe exactamente para esto: es el seguro de desempleo del sistema peruano.',
      'Bolsa de trabajo y servicios de empleo del MTPE.',
      'Si el despido fue arbitrario, la vía es la inspección del trabajo (SUNAFIL) o la demanda laboral.',
    ],
    fuentes: [FUENTES.mtpe, FUENTES.essalud],
  },
  {
    id: 'enfermedad-grave',
    titulo: 'Enfermedad o accidente grave en el hogar',
    detalle:
      'Golpea dos veces: aparece un gasto y desaparece un ingreso, porque alguien tiene que dejar de trabajar para cuidar. Es la causa más frecuente de que una obra se detenga a medias.',
    probabilidadAnual: 0.08,
    impacto: { min: 3000, tipico: 15_000, max: 90_000, unidad: 'S/ de gasto de bolsillo', periodicidad: 'por-evento' },
    duracionMeses: 6,
    mitigacion: [
      'Mantener vigente la afiliación al SIS o a EsSalud aunque cambie la situación laboral.',
      'Revisar coberturas, exclusiones y periodos de carencia antes de necesitarlos, no durante.',
      'Si una IAFAS o una clínica niega una cobertura contratada, el reclamo va a SUSALUD.',
    ],
    fuentes: [FUENTES.sis, FUENTES.essalud, FUENTES.susalud],
  },
  {
    id: 'sismo',
    titulo: 'Sismo',
    detalle:
      'El Perú está en una zona de alta sismicidad. La diferencia entre una casa que resiste y una que no se decide en el diseño estructural y en la calidad del concreto, años antes del evento.',
    probabilidadAnual: 0.03,
    impacto: { min: 5000, tipico: 45_000, max: 250_000, unidad: 'S/ de daño a la vivienda', periodicidad: 'por-evento' },
    duracionMeses: 12,
    mitigacion: [
      'Cumplir la norma E.030 de diseño sismorresistente desde el proyecto: no es un trámite, es la variable que decide.',
      'No construir sobre relleno ni sobre laderas sin estudio de suelos (RNE E.050).',
      'Seguro contra todo riesgo de la vivienda; es obligatorio mientras haya hipoteca vigente.',
    ],
    fuentes: [FUENTES.rne, FUENTES.licenciaModalidades],
  },
  {
    id: 'robo',
    titulo: 'Robo de materiales o de bienes del hogar',
    detalle:
      'En obra, el robo de materiales acopiados es frecuente: cemento, fierro y herramientas son fáciles de revender. Un lote sin cerco perimétrico ni vigilancia acumula pérdidas silenciosas.',
    probabilidadAnual: 0.18,
    impacto: { min: 500, tipico: 3500, max: 20_000, unidad: 'S/ de pérdida', periodicidad: 'por-evento' },
    duracionMeses: 1,
    mitigacion: [
      'Comprar material por etapas, no acopiar todo al inicio.',
      'Cerco perimétrico y guardianía antes de empezar a acopiar.',
      'Denuncia policial: es lo que permite reclamar a un seguro y lo que alimenta las estadísticas del distrito.',
    ],
    fuentes: [FUENTES.indecopi],
  },
  {
    id: 'estafa-inmobiliaria',
    titulo: 'Estafa en la compra del predio',
    detalle:
      'Venta de un lote que no le pertenece a quien vende, doble venta del mismo predio, o terreno en zona no habilitada vendido como urbana. Casi siempre se evita con una consulta registral de S/ 7.',
    probabilidadAnual: 0.05,
    impacto: { min: 10_000, tipico: 60_000, max: 300_000, unidad: 'S/ perdidos', periodicidad: 'por-evento' },
    duracionMeses: 24,
    mitigacion: [
      'Verificar la partida registral en el SPRL de SUNARP antes de entregar cualquier adelanto.',
      'Confirmar que el vendedor que firma es el titular inscrito y que su estado civil está declarado correctamente.',
      'Pedir certificado de gravámenes vigente y revisar cargas, hipotecas y bloqueos.',
      'Bancarizar el pago: sin medio de pago trazable, probar la compra es mucho más difícil.',
    ],
    fuentes: [FUENTES.sunarpEnLinea, FUENTES.notarios, FUENTES.cofopri],
  },
  {
    id: 'alza-materiales',
    titulo: 'Alza del precio de los materiales',
    detalle:
      'El acero y el cemento se mueven con el tipo de cambio y con el precio internacional. Una obra que dura años atraviesa varios ciclos de precio, y el presupuesto inicial deja de servir.',
    probabilidadAnual: 0.35,
    impacto: { min: 0.05, tipico: 0.12, max: 0.3, unidad: 'proporción del presupuesto de materiales', periodicidad: 'anual' },
    duracionMeses: 12,
    mitigacion: [
      'Seguir el índice de precios de materiales de construcción del INEI para actualizar el presupuesto en vez de recotizar todo.',
      'Comprar el acero de una etapa completa cuando el precio está bajo, si hay dónde guardarlo con seguridad.',
    ],
    fuentes: [FUENTES.ineiPrecios, FUENTES.capeco],
  },
  {
    id: 'obra-detenida',
    titulo: 'Obra detenida a medio construir',
    detalle:
      'Una estructura expuesta a la intemperie se deteriora: el acero de las mechas se corrosiona y el concreto sin proteger sufre. Detener la obra tiene un costo que no aparece en ninguna cotización.',
    probabilidadAnual: 0.25,
    impacto: { min: 1500, tipico: 8000, max: 40_000, unidad: 'S/ de deterioro y retrabajo', periodicidad: 'por-evento' },
    duracionMeses: 12,
    mitigacion: [
      'Planificar la obra en etapas que puedan cerrarse: cada etapa debe terminar en un estado que resista la intemperie.',
      'Proteger las mechas de acero expuestas con lechada de cemento o pintura anticorrosiva.',
      'No empezar una etapa sin tener financiado su cierre.',
    ],
    fuentes: [FUENTES.rne, FUENTES.capeco],
  },
  {
    id: 'discriminacion',
    titulo: 'Discriminación en el acceso a empleo, crédito o vivienda',
    detalle:
      'Negar un servicio, un alquiler o un puesto por origen étnico, lugar de procedencia, género, discapacidad, edad u orientación es ilegal en el Perú. Ocurre y, cuando ocurre, cierra puertas que el plan daba por abiertas.',
    probabilidadAnual: 0.1,
    impacto: { min: 0, tipico: 0, max: 0, unidad: 'sin costo directo cuantificable', periodicidad: 'por-evento' },
    duracionMeses: 0,
    mitigacion: [
      'En consumo (banco, arrendador, comercio), la denuncia va a INDECOPI.',
      'En el ámbito laboral, a SUNAFIL y al MTPE.',
      'En casos de violencia de género o familiar, la Línea 100 del MIMP atiende las 24 horas.',
    ],
    fuentes: [FUENTES.indecopi, FUENTES.mtpe, FUENTES.mimp],
  },
]

export const imprevisto = (id: string): Imprevisto | undefined => IMPREVISTOS.find((item) => item.id === id)
