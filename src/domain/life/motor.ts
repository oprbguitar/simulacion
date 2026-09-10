import { COSTOS_INDIRECTOS, FASES_OBRA, costoDirectoPorM2, costoMaterialesParaArea, metradoParaArea } from './catalogo/construccion'
import { NIVELES_EDUCATIVOS } from './catalogo/educacion'
import { COSTOS_CRIANZA, ESQUEMA_VACUNACION } from './catalogo/familia'
import { IMPREVISTOS } from './catalogo/imprevistos'
import { CONSUMOS_REFERENCIA, boletaAgua, boletaElectrica } from './catalogo/servicios'
import { MODOS_INGRESO, type ModoIngresoId, modoIngreso } from './catalogo/trabajo'
import { RUTAS_VIVIENDA, type RutaViviendaId, calcularAlcabala, cuotaMensual } from './catalogo/vivienda'

/**
 * Motor de proyección a 10, 20 o 30 años.
 *
 * Todo es determinista: el mismo perfil produce siempre el mismo resultado.
 * Los imprevistos no se sortean al azar — se activan explícitamente y el motor
 * los coloca en un año fijo, para que el usuario pueda comparar el mismo
 * escenario con y sin el golpe.
 */

export type NivelAcabado = 'basico' | 'medio' | 'alto'
export type Financiamiento = 'ahorro' | 'hipotecario' | 'mivivienda'
export type Region = 'lima' | 'costa' | 'sierra' | 'selva'

export interface HijoPerfil {
  id: string
  /** Año de la proyección en que nace (0 = hoy). */
  anioNacimiento: number
  educacion: 'publica' | 'privada'
  saludPrivada: boolean
}

export interface Perfil {
  edadInicial: number
  region: Region
  personasHogar: number
  ingresoMensualBruto: number
  modoIngreso: ModoIngresoId
  ahorroInicial: number
  gastoEsencialMensual: number
  rutaVivienda: RutaViviendaId
  /** Precio del terreno o de la vivienda, según la ruta. */
  precioInmueble: number
  areaTechada: number
  pisos: number
  nivelAcabado: NivelAcabado
  financiamiento: Financiamiento
  inicialProporcion: number
  plazoCreditoAnios: number
  teaAnual: number
  /** Año de la proyección en que se compra el terreno o la vivienda. */
  anioCompra: number
  /** Año de la proyección en que arranca la obra. */
  anioInicioObra: number
  /** Años que dura la construcción por etapas. */
  duracionObraAnios: number
  hijos: HijoPerfil[]
  horizonteAnios: number
  imprevistosActivos: string[]
  crecimientoIngresoAnual: number
  inflacionAnual: number
}

export const PERFIL_INICIAL: Perfil = {
  edadInicial: 28,
  region: 'lima',
  personasHogar: 2,
  ingresoMensualBruto: 3200,
  modoIngreso: 'dependiente',
  ahorroInicial: 12_000,
  gastoEsencialMensual: 1900,
  rutaVivienda: 'terreno',
  precioInmueble: 45_000,
  areaTechada: 60,
  pisos: 1,
  nivelAcabado: 'basico',
  financiamiento: 'ahorro',
  inicialProporcion: 0.15,
  plazoCreditoAnios: 20,
  teaAnual: 8.4,
  anioCompra: 6,
  anioInicioObra: 9,
  duracionObraAnios: 12,
  hijos: [{ id: 'hijo-1', anioNacimiento: 4, educacion: 'publica', saludPrivada: false }],
  horizonteAnios: 30,
  imprevistosActivos: [],
  crecimientoIngresoAnual: 0.03,
  inflacionAnual: 0.03,
}

/** Multiplicador de costo de obra por nivel de acabado. */
const FACTOR_ACABADO: Record<NivelAcabado, number> = { basico: 0.82, medio: 1, alto: 1.45 }

/** Ajuste regional del costo de construcción por flete y mano de obra. */
const FACTOR_REGION: Record<Region, number> = { lima: 1, costa: 0.94, sierra: 1.08, selva: 1.16 }

export interface AnioProyeccion {
  anio: number
  edad: number
  ingresoAnual: number
  descuentosAnual: number
  gastoEsencialAnual: number
  gastoViviendaAnual: number
  gastoServiciosAnual: number
  gastoHijosAnual: number
  gastoEducacionAnual: number
  gastoObraAnual: number
  cuotaCreditoAnual: number
  imprevistosAnual: number
  flujoAnual: number
  ahorroAcumulado: number
  deudaPendiente: number
  patrimonio: number
  eventos: EventoAnio[]
}

export interface EventoAnio {
  tipo: 'vivienda' | 'obra' | 'familia' | 'educacion' | 'trabajo' | 'imprevisto' | 'servicio'
  titulo: string
  detalle: string
  monto?: number
}

export interface Proyeccion {
  perfil: Perfil
  anios: AnioProyeccion[]
  /** Costo total de la construcción, en rango. */
  costoObra: { min: number; tipico: number; max: number }
  costoTerreno: number
  alcabala: number
  gastosCierre: number
  montoCredito: number
  cuotaMensual: number
  interesTotal: number
  materiales: ReturnType<typeof costoMaterialesParaArea>
  metrado: ReturnType<typeof metradoParaArea>
  /** Diagnósticos legibles, sin puntaje oculto. */
  alertas: Alerta[]
}

export interface Alerta {
  id: string
  severidad: 'critica' | 'atencion' | 'nota'
  titulo: string
  mensaje: string
  /** Qué mover para cambiar el resultado. */
  palanca: string
}

const redondea = (n: number) => Math.round(n)

// ------------------------------------------------------------------- vivienda

export function costoConstruccion(perfil: Perfil) {
  const base = costoDirectoPorM2()
  const factor = FACTOR_ACABADO[perfil.nivelAcabado] * FACTOR_REGION[perfil.region]
  const area = perfil.areaTechada * Math.max(1, perfil.pisos)
  const directo = {
    min: base.min * factor * area,
    tipico: base.tipico * factor * area,
    max: base.max * factor * area,
  }
  const indirecto = COSTOS_INDIRECTOS.reduce(
    (acc, item) => ({
      min: acc.min + directo.min * (item.monto.min ?? item.monto.tipico),
      tipico: acc.tipico + directo.tipico * item.monto.tipico,
      max: acc.max + directo.max * (item.monto.max ?? item.monto.tipico),
    }),
    { min: 0, tipico: 0, max: 0 },
  )
  return {
    min: directo.min + indirecto.min,
    tipico: directo.tipico + indirecto.tipico,
    max: directo.max + indirecto.max,
  }
}

/** Reparto del costo de obra por fase, para el plan de etapas. */
export function planDeEtapas(perfil: Perfil) {
  const total = costoConstruccion(perfil).tipico
  return FASES_OBRA.map((fase) => ({
    fase,
    costo: total * fase.participacion,
    /** Año de la proyección en que se ejecuta esta fase. */
    anio: perfil.anioInicioObra + Math.floor(fase.participacion === 0 ? 0 : acumulado(fase.id) * perfil.duracionObraAnios),
  }))
}

function acumulado(faseId: string): number {
  let suma = 0
  for (const fase of FASES_OBRA) {
    if (fase.id === faseId) return suma
    suma += fase.participacion
  }
  return suma
}

// ------------------------------------------------------------------- proyección

export function proyectar(perfil: Perfil): Proyeccion {
  const modo = modoIngreso(perfil.modoIngreso)
  const costoObra = costoConstruccion(perfil)
  const rutaCompra = perfil.rutaVivienda === 'terreno' || perfil.rutaVivienda === 'casa-construida' || perfil.rutaVivienda === 'departamento'
  const costoTerreno = rutaCompra ? perfil.precioInmueble : 0
  const alcabala = rutaCompra ? calcularAlcabala(perfil.precioInmueble) : 0
  const gastosCierre = rutaCompra ? perfil.precioInmueble * 0.04 : 0

  const usaCredito = rutaCompra && perfil.financiamiento !== 'ahorro'
  const montoCredito = usaCredito ? perfil.precioInmueble * (1 - perfil.inicialProporcion) : 0
  const cuota = usaCredito ? cuotaMensual(montoCredito, perfil.teaAnual, perfil.plazoCreditoAnios) : 0
  const interesTotal = usaCredito ? cuota * perfil.plazoCreditoAnios * 12 - montoCredito : 0

  const etapas = planDeEtapas(perfil)
  // La casa se puede habitar cuando termina la fase de instalaciones; los
  // acabados se pueden seguir haciendo viviendo adentro.
  const anioHabitable = etapas.find((e) => e.fase.id === 'instalaciones')?.anio ?? perfil.anioInicioObra + perfil.duracionObraAnios
  const consumo = CONSUMOS_REFERENCIA.reduce((mejor, item) =>
    Math.abs(item.personas - perfil.personasHogar) < Math.abs(mejor.personas - perfil.personasHogar) ? item : mejor,
  )

  const anios: AnioProyeccion[] = []
  let ahorro = perfil.ahorroInicial
  let deuda = 0
  let valorInmueble = 0
  let obraEjecutada = 0

  const tem = Math.pow(1 + perfil.teaAnual / 100, 1 / 12) - 1

  for (let a = 0; a < perfil.horizonteAnios; a += 1) {
    const eventos: EventoAnio[] = []
    const infla = Math.pow(1 + perfil.inflacionAnual, a)
    const ingresoMensual = perfil.ingresoMensualBruto * Math.pow(1 + perfil.crecimientoIngresoAnual, a)
    const mesesIngreso = modo.id === 'dependiente' ? 14 : 12
    const ingresoAnual = ingresoMensual * mesesIngreso
    const descuentosAnual = modo.descuentoMensual(ingresoMensual) * 12

    const gastoEsencialAnual = perfil.gastoEsencialMensual * infla * 12

    // --- vivienda: compra, alquiler o aporte familiar
    let gastoViviendaAnual = 0
    if (a === perfil.anioCompra && rutaCompra) {
      const inicial = usaCredito ? perfil.precioInmueble * perfil.inicialProporcion : perfil.precioInmueble
      const desembolso = inicial + alcabala + gastosCierre
      // El desembolso entra por el flujo del año; no se resta dos veces.
      gastoViviendaAnual += desembolso
      valorInmueble += perfil.precioInmueble
      if (usaCredito) deuda = montoCredito
      eventos.push({
        tipo: 'vivienda',
        titulo: usaCredito ? 'Cuota inicial y gastos de cierre' : 'Compra al contado',
        detalle: `Alcabala S/ ${redondea(alcabala).toLocaleString('es-PE')} · gastos de cierre S/ ${redondea(gastosCierre).toLocaleString('es-PE')}`,
        monto: desembolso,
      })
    }
    if (perfil.rutaVivienda === 'alquiler') {
      const renta = RUTAS_VIVIENDA.find((r) => r.id === 'alquiler')?.costos[0].monto.tipico ?? 1400
      gastoViviendaAnual += renta * infla * 12
    }
    if (perfil.rutaVivienda === 'familia') {
      gastoViviendaAnual += 400 * infla * 12
    }
    // Comprar un terreno no resuelve dónde dormir: hasta que la casa sea
    // habitable el hogar sigue pagando alojamiento en algún lado.
    if (perfil.rutaVivienda === 'terreno' && a < anioHabitable) {
      gastoViviendaAnual += 400 * infla * 12
    }

    // --- crédito
    let cuotaCreditoAnual = 0
    if (deuda > 0) {
      for (let m = 0; m < 12 && deuda > 0; m += 1) {
        const interes = deuda * tem
        const amortiza = Math.min(deuda, cuota - interes)
        deuda = Math.max(0, deuda - amortiza)
        cuotaCreditoAnual += Math.min(cuota, amortiza + interes)
      }
      if (deuda === 0) eventos.push({ tipo: 'vivienda', titulo: 'Crédito cancelado', detalle: 'La cuota deja de comprometer el flujo mensual.' })
    }

    // --- obra por etapas
    let gastoObraAnual = 0
    for (const etapa of etapas) {
      if (etapa.anio === a) {
        const costo = etapa.costo * infla
        gastoObraAnual += costo
        obraEjecutada += costo
        valorInmueble += costo * 0.85
        eventos.push({ tipo: 'obra', titulo: etapa.fase.nombre, detalle: etapa.fase.resumen, monto: costo })
      }
    }

    // --- servicios: solo cuando ya se habita una vivienda propia o alquilada
    const habitaVivienda =
      perfil.rutaVivienda === 'alquiler' ||
      ((perfil.rutaVivienda === 'casa-construida' || perfil.rutaVivienda === 'departamento') && a >= perfil.anioCompra) ||
      (perfil.rutaVivienda === 'terreno' && a >= anioHabitable)
    const gastoServiciosAnual = habitaVivienda
      ? (boletaElectrica(consumo.kwh) + boletaAgua(consumo.m3) + 110 + 75) * infla * 12
      : 0

    // --- hijos
    let gastoHijosAnual = 0
    let gastoEducacionAnual = 0
    for (const hijo of perfil.hijos) {
      const edadHijo = a - hijo.anioNacimiento
      if (edadHijo < 0) continue
      if (edadHijo === 0) {
        const parto = hijo.saludPrivada ? 11_000 : 0
        gastoHijosAnual += parto * infla
        eventos.push({
          tipo: 'familia',
          titulo: 'Nacimiento',
          detalle: hijo.saludPrivada
            ? 'Parto en clínica privada. Verifica el periodo de carencia del plan de salud.'
            : 'Parto cubierto por el Estado (SIS o EsSalud). CRED y vacunas del esquema nacional, gratuitos.',
          monto: parto * infla,
        })
      }
      if (edadHijo >= 0 && edadHijo <= 2) {
        gastoHijosAnual += COSTOS_CRIANZA.reduce((s, c) => s + c.monto.tipico, 0) * infla * 12
      } else if (edadHijo <= 5) {
        gastoHijosAnual += 350 * infla * 12
      } else {
        gastoHijosAnual += 250 * infla * 12
      }
      if (hijo.saludPrivada && edadHijo <= 1) {
        const vac = ESQUEMA_VACUNACION.filter((v) => v.mes <= 12).reduce((s, v) => s + (v.costoPrivado?.tipico ?? 0), 0)
        gastoHijosAnual += vac * infla
        eventos.push({ tipo: 'familia', titulo: 'Esquema de vacunación en el sector privado', detalle: 'Las mismas vacunas son gratuitas en cualquier establecimiento del MINSA.', monto: vac * infla })
      }

      for (const nivel of NIVELES_EDUCATIVOS) {
        const dentro = edadHijo >= nivel.edadInicio && edadHijo < nivel.edadInicio + nivel.aniosDuracion
        if (!dentro) continue
        const pension = hijo.educacion === 'privada' ? nivel.privado.tipico * 11 : 0
        const asociados = nivel.gastosAsociados.reduce(
          (s, g) => s + (g.monto.periodicidad === 'mensual' ? g.monto.tipico * 10 : g.monto.tipico),
          0,
        )
        gastoEducacionAnual += (pension + asociados) * infla
        if (edadHijo === nivel.edadInicio) {
          eventos.push({
            tipo: 'educacion',
            titulo: `Ingreso a ${nivel.titulo.toLowerCase()}`,
            detalle: hijo.educacion === 'privada' ? 'Pensión privada más matrícula y gastos asociados.' : 'Institución pública: sin pensión, con gastos asociados.',
            monto: (pension + asociados) * infla,
          })
        }
      }
    }

    // --- imprevistos activos
    let imprevistosAnual = 0
    for (const id of perfil.imprevistosActivos) {
      const ev = IMPREVISTOS.find((i) => i.id === id)
      if (!ev) continue
      const anioGolpe = 1 + (IMPREVISTOS.indexOf(ev) * 3) % Math.max(1, perfil.horizonteAnios - 2)
      if (a !== anioGolpe) continue
      const monto =
        ev.id === 'desempleo'
          ? (ingresoAnual / mesesIngreso) * ev.impacto.tipico
          : ev.impacto.unidad.startsWith('proporción')
            ? costoObra.tipico * ev.impacto.tipico
            : ev.impacto.tipico
      imprevistosAnual += monto * infla
      eventos.push({ tipo: 'imprevisto', titulo: ev.titulo, detalle: ev.detalle, monto: monto * infla })
    }

    const salidas =
      descuentosAnual + gastoEsencialAnual + gastoViviendaAnual + gastoServiciosAnual + gastoHijosAnual + gastoEducacionAnual + gastoObraAnual + cuotaCreditoAnual + imprevistosAnual
    const flujoAnual = ingresoAnual - salidas
    ahorro += flujoAnual

    anios.push({
      anio: a,
      edad: perfil.edadInicial + a,
      ingresoAnual: redondea(ingresoAnual),
      descuentosAnual: redondea(descuentosAnual),
      gastoEsencialAnual: redondea(gastoEsencialAnual),
      gastoViviendaAnual: redondea(gastoViviendaAnual),
      gastoServiciosAnual: redondea(gastoServiciosAnual),
      gastoHijosAnual: redondea(gastoHijosAnual),
      gastoEducacionAnual: redondea(gastoEducacionAnual),
      gastoObraAnual: redondea(gastoObraAnual),
      cuotaCreditoAnual: redondea(cuotaCreditoAnual),
      imprevistosAnual: redondea(imprevistosAnual),
      flujoAnual: redondea(flujoAnual),
      ahorroAcumulado: redondea(ahorro),
      deudaPendiente: redondea(deuda),
      patrimonio: redondea(ahorro + valorInmueble - deuda),
      eventos,
    })
  }

  return {
    perfil,
    anios,
    costoObra,
    costoTerreno,
    alcabala,
    gastosCierre,
    montoCredito,
    cuotaMensual: cuota,
    interesTotal,
    materiales: costoMaterialesParaArea(perfil.areaTechada, perfil.pisos),
    metrado: metradoParaArea(perfil.areaTechada, perfil.pisos),
    alertas: diagnosticar(perfil, anios, cuota, obraEjecutada),
  }
}

// ------------------------------------------------------------------- alertas

function diagnosticar(perfil: Perfil, anios: AnioProyeccion[], cuota: number, obraEjecutada: number): Alerta[] {
  const alertas: Alerta[] = []
  const modo = modoIngreso(perfil.modoIngreso)
  const ingresoNeto = perfil.ingresoMensualBruto - modo.descuentoMensual(perfil.ingresoMensualBruto)

  const primerNegativo = anios.find((a) => a.ahorroAcumulado < 0)
  if (primerNegativo) {
    alertas.push({
      id: 'AHORRO_NEGATIVO',
      severidad: 'critica',
      titulo: `El plan se queda sin fondos en el año ${primerNegativo.anio}`,
      mensaje: `Con este perfil, el ahorro acumulado llega a S/ ${primerNegativo.ahorroAcumulado.toLocaleString('es-PE')} a los ${primerNegativo.edad} años. En la práctica eso significa detener la obra o endeudarse a tasa de consumo.`,
      palanca: 'Alargar la duración de la obra, bajar el nivel de acabado o reducir el área techada.',
    })
  }

  if (cuota > 0 && cuota > ingresoNeto * 0.3) {
    alertas.push({
      id: 'CUOTA_SOBRE_TERCIO',
      severidad: 'critica',
      titulo: 'La cuota supera un tercio del ingreso neto',
      mensaje: `La cuota mensual sería de S/ ${redondea(cuota).toLocaleString('es-PE')} frente a un ingreso neto de S/ ${redondea(ingresoNeto).toLocaleString('es-PE')}. Es el umbral con el que los bancos suelen rechazar la solicitud.`,
      palanca: 'Aumentar la cuota inicial, alargar el plazo o buscar un inmueble de menor valor.',
    })
  }

  const reserva = perfil.ahorroInicial / Math.max(1, perfil.gastoEsencialMensual)
  if (reserva < 3) {
    alertas.push({
      id: 'RESERVA_INSUFICIENTE',
      severidad: 'atencion',
      titulo: 'La reserva cubre menos de tres meses',
      mensaje: `El ahorro inicial equivale a ${reserva.toFixed(1)} meses de gastos esenciales. Cualquier imprevisto obliga a endeudarse.`,
      palanca: 'Construir el fondo de emergencia antes de comprometer la cuota inicial.',
    })
  }

  if (obraEjecutada > 0 && perfil.pisos === 1) {
    alertas.push({
      id: 'CAPACIDAD_ESTRUCTURAL_FUTURA',
      severidad: 'nota',
      titulo: 'Si planeas un segundo piso, decídelo antes de la cimentación',
      mensaje:
        'La cimentación y las columnas del primer piso deben diseñarse desde ahora para la carga futura. Reforzar después implica demoler y rehacer. Esta simulación no dimensiona elementos estructurales: eso lo define el proyecto estructural.',
      palanca: 'Encargar el proyecto estructural considerando la ampliación desde el inicio.',
    })
  }

  if (perfil.modoIngreso === 'independiente') {
    alertas.push({
      id: 'SIN_COBERTURA_AUTOMATICA',
      severidad: 'atencion',
      titulo: 'Trabajando por cuenta propia, la cobertura de salud y la pensión no son automáticas',
      mensaje: 'No hay gratificaciones, ni CTS, ni EsSalud por planilla. Una enfermedad corta el ingreso y agrega el gasto al mismo tiempo.',
      palanca: 'Presupuestar explícitamente el seguro de salud y un aporte previsional voluntario.',
    })
  }

  const hijosEnEducacion = perfil.hijos.filter((h) => h.educacion === 'privada').length
  if (hijosEnEducacion > 0 && perfil.financiamiento !== 'ahorro') {
    alertas.push({
      id: 'CRUCE_DEUDA_EDUCACION',
      severidad: 'atencion',
      titulo: 'La cuota del crédito y las pensiones escolares se superponen',
      mensaje: 'Durante varios años coinciden la cuota hipotecaria y la pensión privada. Mirar cada gasto por separado esconde el pico combinado.',
      palanca: 'Comparar el mismo escenario con educación pública o con un plazo de crédito distinto.',
    })
  }

  return alertas
}

export const MODOS = MODOS_INGRESO
