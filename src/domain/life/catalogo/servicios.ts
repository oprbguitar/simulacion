import { FUENTES } from '../fuentes'
import type { Fuente, ItemCosto } from '../tipos'

/**
 * Lo que cuesta habitar la casa una vez construida.
 *
 * Las tarifas de electricidad y agua están reguladas y publicadas: el pliego
 * tarifario vigente manda sobre cualquier promedio. Aquí se guardan los
 * consumos de referencia y el enlace al pliego, no una tarifa copiada que
 * quedará desactualizada.
 */

export interface ConsumoReferencia {
  id: string
  perfil: string
  personas: number
  /** Consumo mensual de electricidad, en kWh. */
  kwh: number
  /** Consumo mensual de agua, en m³. */
  m3: number
}

export const CONSUMOS_REFERENCIA: ConsumoReferencia[] = [
  { id: 'unipersonal', perfil: 'Una persona, departamento pequeño', personas: 1, kwh: 70, m3: 8 },
  { id: 'pareja', perfil: 'Pareja sin hijos', personas: 2, kwh: 110, m3: 14 },
  { id: 'familia-3', perfil: 'Familia de tres', personas: 3, kwh: 150, m3: 20 },
  { id: 'familia-5', perfil: 'Familia de cinco, casa con patio', personas: 5, kwh: 220, m3: 30 },
]

/**
 * Precio medio por kWh de la tarifa residencial BT5B, incluyendo cargo fijo
 * prorrateado y alumbrado público. Es una referencia para estimar la boleta;
 * el valor exacto está en el pliego tarifario vigente de cada distribuidora.
 */
export const PRECIO_KWH = { min: 0.72, tipico: 0.86, max: 1.05 }

/** Precio medio por m³ de agua y alcantarillado, incluyendo cargo fijo y IGV. */
export const PRECIO_M3_AGUA = { min: 2.6, tipico: 4.2, max: 7.5 }

export function boletaElectrica(kwh: number, nivel: 'min' | 'tipico' | 'max' = 'tipico'): number {
  return kwh * PRECIO_KWH[nivel] + 3.5
}

export function boletaAgua(m3: number, nivel: 'min' | 'tipico' | 'max' = 'tipico'): number {
  return m3 * PRECIO_M3_AGUA[nivel] + 5
}

export const SERVICIOS_HOGAR: ItemCosto[] = [
  {
    id: 'electricidad',
    etiqueta: 'Electricidad',
    descripcion:
      'La tarifa residencial típica es la BT5B. La boleta combina cargo fijo, cargo por energía y alumbrado público, y cambia cuatro veces al año por reajuste tarifario.',
    monto: { min: 55, tipico: 135, max: 320, unidad: 'S/ al mes', periodicidad: 'mensual' },
    origen: 'REGULADO',
    fuentes: [FUENTES.osinergminTarifas],
    advertencia: 'Terma eléctrica, aire acondicionado y cocina eléctrica pueden duplicar la boleta: son las tres cargas que más pesan en una vivienda.',
  },
  {
    id: 'agua',
    etiqueta: 'Agua potable y alcantarillado',
    descripcion:
      'La tarifa la aprueba SUNASS por EPS en un estudio tarifario quinquenal, con estructura por rangos de consumo. En Lima, la EPS es SEDAPAL.',
    monto: { min: 35, tipico: 95, max: 240, unidad: 'S/ al mes', periodicidad: 'mensual' },
    origen: 'REGULADO',
    fuentes: [FUENTES.sedapal, FUENTES.sunassPublicaciones, FUENTES.sunass],
    advertencia: 'Sin conexión a la red, el agua por camión cisterna cuesta varias veces más por metro cúbico que la tarifa de la EPS.',
  },
  {
    id: 'gas',
    etiqueta: 'Gas',
    descripcion: 'Gas natural por red donde hay concesión, o balón de GLP donde no la hay. La red es sensiblemente más barata por unidad de energía.',
    monto: { min: 25, tipico: 70, max: 160, unidad: 'S/ al mes', periodicidad: 'mensual' },
    origen: 'REGULADO',
    fuentes: [FUENTES.osinergminTarifas],
  },
  {
    id: 'internet',
    etiqueta: 'Internet y telefonía',
    descripcion: 'Servicio no regulado en precio. Varía según la tecnología disponible en la zona (fibra, cable, inalámbrico).',
    monto: { min: 60, tipico: 110, max: 250, unidad: 'S/ al mes', periodicidad: 'mensual' },
    origen: 'MERCADO',
    fuentes: [FUENTES.indecopi],
  },
  {
    id: 'arbitrios',
    etiqueta: 'Arbitrios municipales',
    descripcion: 'Limpieza pública, parques y jardines, y serenazgo. Los fija cada municipalidad por ordenanza y dependen del predio y del uso.',
    monto: { min: 20, tipico: 75, max: 300, unidad: 'S/ al mes', periodicidad: 'mensual' },
    origen: 'OFICIAL',
    fuentes: [FUENTES.satLima],
  },
  {
    id: 'mantenimiento',
    etiqueta: 'Mantenimiento de la vivienda',
    descripcion:
      'Pintura, impermeabilización de techos, reparación de instalaciones. Ignorarlo no elimina el costo: lo traslada a una reparación mayor más adelante.',
    monto: { min: 0.005, tipico: 0.01, max: 0.02, unidad: 'proporción del valor de la construcción al año', periodicidad: 'anual' },
    origen: 'ESTIMADO',
    fuentes: [FUENTES.capeco],
  },
]

export const FUENTES_SERVICIOS: Fuente[] = [FUENTES.osinergminTarifas, FUENTES.sunass, FUENTES.sedapal, FUENTES.satLima]
