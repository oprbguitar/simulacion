import { FUENTES } from '../fuentes'
import type { Fuente, ItemCosto, Monto } from '../tipos'

/**
 * Educación en Perú, de inicial a superior.
 *
 * La educación pública es gratuita; lo que no es gratuito es el gasto asociado
 * (uniformes, útiles, movilidad, alimentación). Ese gasto sí entra al flujo del
 * hogar y por eso está desagregado aquí.
 */

export type NivelEducativoId = 'inicial' | 'primaria' | 'secundaria' | 'superior'

export interface NivelEducativo {
  id: NivelEducativoId
  numero: string
  titulo: string
  edades: string
  aniosDuracion: number
  edadInicio: number
  descripcion: string
  publico: Monto
  privado: Monto
  gastosAsociados: ItemCosto[]
  fuentes: Fuente[]
  notas: string[]
}

const utiles = (min: number, tipico: number, max: number): ItemCosto => ({
  id: 'utiles',
  etiqueta: 'Útiles, textos y uniformes',
  descripcion:
    'Gasto concentrado en marzo. Las instituciones no pueden condicionar la matrícula a comprar en un proveedor determinado ni exigir marcas: eso se denuncia ante INDECOPI.',
  monto: { min, tipico, max, unidad: 'S/ al año', periodicidad: 'anual' },
  origen: 'MERCADO',
  fuentes: [FUENTES.indecopi, FUENTES.mineduPublicaciones],
})

const movilidadYalimentacion = (min: number, tipico: number, max: number): ItemCosto => ({
  id: 'movilidad-alimentacion',
  etiqueta: 'Movilidad y alimentación escolar',
  descripcion: 'Depende de la distancia al colegio y de si hay jornada completa. En muchos hogares supera a la propia pensión.',
  monto: { min, tipico, max, unidad: 'S/ al mes', periodicidad: 'mensual' },
  origen: 'ESTIMADO',
  fuentes: [FUENTES.mineduPublicaciones],
})

export const NIVELES_EDUCATIVOS: NivelEducativo[] = [
  {
    id: 'inicial',
    numero: '01',
    titulo: 'Educación inicial',
    edades: '3 a 5 años',
    aniosDuracion: 3,
    edadInicio: 3,
    descripcion:
      'Nivel obligatorio del sistema educativo peruano. En la institución pública no hay pensión; el costo real está en útiles, movilidad y alimentación.',
    publico: { tipico: 0, unidad: 'S/ al mes (gratuito)', periodicidad: 'mensual' },
    privado: { min: 250, tipico: 550, max: 2200, unidad: 'S/ al mes', periodicidad: 'mensual' },
    gastosAsociados: [utiles(300, 650, 1400), movilidadYalimentacion(80, 220, 600)],
    fuentes: [FUENTES.identicole, FUENTES.mineduPublicaciones],
    notas: [
      'En Identicole se puede consultar la pensión, la cuota de ingreso y la matrícula que cada colegio privado declaró: sirve para comparar antes de decidir.',
      'La cuota de ingreso de los colegios privados se paga una sola vez y en algunos casos supera el costo de un año completo de pensiones.',
    ],
  },
  {
    id: 'primaria',
    numero: '02',
    titulo: 'Educación primaria',
    edades: '6 a 11 años',
    aniosDuracion: 6,
    edadInicio: 6,
    descripcion: 'Seis grados. Es el tramo más largo del gasto escolar y el que más se subestima al proyectar a diez años.',
    publico: { tipico: 0, unidad: 'S/ al mes (gratuito)', periodicidad: 'mensual' },
    privado: { min: 300, tipico: 680, max: 3000, unidad: 'S/ al mes', periodicidad: 'mensual' },
    gastosAsociados: [utiles(400, 800, 1800), movilidadYalimentacion(100, 280, 700)],
    fuentes: [FUENTES.identicole, FUENTES.mineduPublicaciones],
    notas: ['Las pensiones privadas se cobran normalmente en 10 cuotas al año, más matrícula.'],
  },
  {
    id: 'secundaria',
    numero: '03',
    titulo: 'Educación secundaria',
    edades: '12 a 16 años',
    aniosDuracion: 5,
    edadInicio: 12,
    descripcion: 'Cinco años. Al final aparece un gasto nuevo que casi nunca se presupuesta: la preparación preuniversitaria.',
    publico: { tipico: 0, unidad: 'S/ al mes (gratuito)', periodicidad: 'mensual' },
    privado: { min: 350, tipico: 790, max: 3500, unidad: 'S/ al mes', periodicidad: 'mensual' },
    gastosAsociados: [utiles(450, 900, 2000), movilidadYalimentacion(120, 320, 800)],
    fuentes: [FUENTES.identicole, FUENTES.mineduPublicaciones],
    notas: [
      'La preparación preuniversitaria es un gasto aparte, de uno o dos años, y está listada abajo: no se paga durante los cinco años de secundaria.',
    ],
  },
  {
    id: 'superior',
    numero: '04',
    titulo: 'Educación superior',
    edades: '17 años en adelante',
    aniosDuracion: 5,
    edadInicio: 17,
    descripcion:
      'Universidad pública (sin pensión), universidad privada o instituto de educación superior tecnológica. La diferencia de costo entre las tres rutas es de un orden de magnitud.',
    publico: { tipico: 0, unidad: 'S/ al mes (universidad pública)', periodicidad: 'mensual' },
    privado: { min: 600, tipico: 1600, max: 5500, unidad: 'S/ al mes', periodicidad: 'mensual' },
    gastosAsociados: [
      {
        id: 'materiales-superior',
        etiqueta: 'Materiales, equipos y prácticas',
        descripcion: 'Laptop, software, materiales de taller o laboratorio, prácticas preprofesionales y, si la universidad está en otra ciudad, alojamiento.',
        monto: { min: 150, tipico: 450, max: 1600, unidad: 'S/ al mes', periodicidad: 'mensual' },
        origen: 'ESTIMADO',
        fuentes: [FUENTES.sunedu, FUENTES.pronabec],
      },
    ],
    fuentes: [FUENTES.sunedu, FUENTES.pronabec],
    notas: [
      'Verifica en SUNEDU que la universidad tenga licencia institucional vigente antes de matricularte: hay programas que no otorgan grados válidos.',
      'PRONABEC administra becas y crédito educativo. Postular a tiempo cambia por completo la ecuación de este nivel.',
      'La universidad pública no cobra pensión, pero sí exige un proceso de admisión competitivo cuyo costo de preparación es real.',
    ],
  },
]

/**
 * Gasto de transición entre secundaria y superior. Va aparte porque dura uno o
 * dos años, no los cinco de secundaria: meterlo en el nivel multiplicaría por
 * cinco un costo que no se paga cinco veces.
 */
export const PREPARACION_PREUNIVERSITARIA: ItemCosto = {
  id: 'preuniversitaria',
  etiqueta: 'Preparación preuniversitaria',
  descripcion:
    'Academia o ciclo preuniversitario durante el último año de secundaria o después de terminarla. Dura entre uno y dos años, no toda la secundaria.',
  monto: { min: 250, tipico: 600, max: 1800, unidad: 'S/ al mes', periodicidad: 'mensual' },
  origen: 'MERCADO',
  fuentes: [FUENTES.sunedu, FUENTES.pronabec],
}

export const FUENTES_EDUCACION: Fuente[] = [FUENTES.identicole, FUENTES.mineduPublicaciones, FUENTES.sunedu, FUENTES.pronabec, FUENTES.indecopi]

/** Costo total de escolarizar a un hijo desde inicial hasta el fin de secundaria. */
export function costoEscolaridadCompleta(privado: boolean): { min: number; tipico: number; max: number } {
  return NIVELES_EDUCATIVOS.filter((n) => n.id !== 'superior').reduce(
    (acc, nivel) => {
      const pension = privado ? nivel.privado : nivel.publico
      const mesesPagados = privado ? 11 : 0 // matrícula + 10 pensiones
      const asociadosMensuales = nivel.gastosAsociados.filter((g) => g.monto.periodicidad === 'mensual')
      const asociadosAnuales = nivel.gastosAsociados.filter((g) => g.monto.periodicidad === 'anual')
      const suma = (sel: 'min' | 'tipico' | 'max') => {
        const p = (pension[sel] ?? pension.tipico) * mesesPagados
        const m = asociadosMensuales.reduce((s, g) => s + (g.monto[sel] ?? g.monto.tipico) * 10, 0)
        const a = asociadosAnuales.reduce((s, g) => s + (g.monto[sel] ?? g.monto.tipico), 0)
        return (p + m + a) * nivel.aniosDuracion
      }
      return { min: acc.min + suma('min'), tipico: acc.tipico + suma('tipico'), max: acc.max + suma('max') }
    },
    { min: 0, tipico: 0, max: 0 },
  )
}
