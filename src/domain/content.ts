import type {
  ContentConfig,
  DataOrigin,
  StressEventConfig,
} from './types'

const seededOrigin: DataOrigin = 'SEEDED_REFERENCE'

const source: ContentConfig['assumptions']['source'] = {
  origin: seededOrigin,
  sourceName: 'Supuesto editable del prototipo',
  note: 'No representa un precio vigente ni una cotización profesional.',
}

export const defaultContent: ContentConfig = {
  version: 1,
  productName: 'Horizonte',
  assumptions: {
    initialSavings: 22_500,
    monthlyIncome: 4_800,
    essentialMonthlySpend: 2_500,
    familyHousingCost: 0,
    rentMonthly: 1_650,
    monthlySavingBoost: 500,
    landPurchaseCost: 18_500,
    landAssetValue: 18_500,
    constructionInitialPayment: 12_500,
    constructionAssetValue: 35_000,
    constructionMonthlyCost: 1_800,
    debtMonthly: 0,
    maintenanceMonthly: 150,
    costRangeLowFactor: 0.9,
    costRangeHighFactor: 1.15,
    source,
  },
  housingPaths: [
    {
      id: 'family',
      label: 'Vivo con mi familia',
      description: 'Tengo apoyo de mi entorno y puedo ordenar mi siguiente paso.',
      icon: 'family',
      image: '/assets/path-family.png',
      imageAlt: 'Familia reunida en la sala de una vivienda.',
      detail: 'Compartir vivienda puede darte una base de apoyo y más margen para ordenar tu ahorro antes de asumir un costo habitacional.',
      origin: seededOrigin,
    },
    {
      id: 'renting',
      label: 'Vivo alquilando',
      description: 'Tengo un costo mensual y busco más estabilidad.',
      icon: 'renting',
      image: '/assets/path-renting.png',
      imageAlt: 'Edificio pequeño de departamentos en una ciudad costera.',
      detail: 'Alquilar puede darte independencia inmediata, pero conviene mirar el costo mensual junto con tu reserva y tus siguientes metas.',
      origin: seededOrigin,
    },
    {
      id: 'land',
      label: 'Tengo un terreno',
      description: 'Ya existe un lugar donde el proyecto puede comenzar.',
      icon: 'land',
      image: '/assets/path-land.png',
      imageAlt: 'Terreno delimitado con una señal de inicio y un árbol joven.',
      detail: 'Tener el terreno cambia el punto de partida: el siguiente movimiento puede ser ordenar papeles, planificar la base o reservar recursos para construir.',
      origin: seededOrigin,
    },
    {
      id: 'none',
      label: 'No tengo propiedad',
      description: 'Quiero comparar alternativas antes de comprometerme.',
      icon: 'none',
      image: '/assets/path-none.png',
      imageAlt: 'Casa abierta que representa una futura vivienda por elegir.',
      detail: 'Comparar antes de comprometerte permite ver qué alternativa encaja mejor con tu liquidez, tu estabilidad y el tiempo que tienes para avanzar.',
      origin: seededOrigin,
    },
  ],
  constructionStages: [
    { id: 'legal', label: 'Situación legal', shortLabel: 'Legal', phase: 'base', origin: seededOrigin },
    { id: 'studies', label: 'Estudios y diseño', shortLabel: 'Estudios', phase: 'base', origin: seededOrigin },
    { id: 'site', label: 'Obras preliminares', shortLabel: 'Obra', phase: 'obra', origin: seededOrigin },
    { id: 'foundations', label: 'Cimientos', shortLabel: 'Base', phase: 'obra', origin: seededOrigin },
    { id: 'structure', label: 'Estructura y muros', shortLabel: 'Muros', phase: 'obra', origin: seededOrigin },
    { id: 'roof', label: 'Techo / losa', shortLabel: 'Techo', phase: 'obra', origin: seededOrigin },
    { id: 'systems', label: 'Agua y electricidad', shortLabel: 'Sistemas', phase: 'sistemas', origin: seededOrigin },
    { id: 'finishes', label: 'Acabados', shortLabel: 'Acabados', phase: 'acabados', origin: seededOrigin },
    { id: 'inspection', label: 'Pruebas y entrega', shortLabel: 'Entrega', phase: 'acabados', origin: seededOrigin },
  ],
  timeline: [
    { id: 'today', month: 0, label: 'Hoy', description: 'Tu punto de partida.', kind: 'milestone', origin: seededOrigin },
    { id: 'save', month: 6, label: 'Ordenar ahorro', description: 'Un colchón para elegir con más tranquilidad.', kind: 'decision', origin: seededOrigin },
    { id: 'land', month: 12, label: 'Terreno', description: 'Primer gran paso del proyecto.', kind: 'milestone', origin: seededOrigin },
    { id: 'foundations', month: 18, label: 'Cimientos', description: 'La base toma forma.', kind: 'construction_stage', origin: seededOrigin },
    { id: 'structure', month: 26, label: 'Muros y techo', description: 'La vivienda se vuelve visible.', kind: 'construction_stage', origin: seededOrigin },
    { id: 'home', month: 38, label: 'Hogar futuro', description: 'Una meta construida por etapas.', kind: 'milestone', origin: seededOrigin },
    { id: 'maintenance', month: 50, label: 'Mantenimiento', description: 'Cuidar también es parte del plan.', kind: 'expense', origin: seededOrigin },
  ],
  insights: [
    {
      ruleId: 'LOW_RESERVE_AFTER_PURCHASE',
      title: 'Cuida tu reserva',
      message: 'Después de este paso tu fondo cubriría menos de 3 meses de gastos.',
      detail: 'Usar más del 80 % del ahorro para avanzar puede dejar poco margen para una emergencia.',
      suggestions: ['Probar ahorrar seis meses más', 'Comparar una cuota inicial menor'],
      origin: seededOrigin,
    },
    {
      ruleId: 'FUTURE_STRUCTURAL_CAPACITY',
      title: 'Piensa en la siguiente planta',
      message: 'Si planeas ampliar, la estructura debe contemplarlo desde el inicio.',
      detail: 'Esta simulación no dimensiona elementos estructurales. La capacidad futura debe revisarla un profesional.',
      suggestions: ['Marcar la ampliación como objetivo', 'Consultar a un profesional'],
      origin: seededOrigin,
    },
    {
      ruleId: 'EDUCATION_DEBT_OVERLAP',
      title: 'Se cruzan dos decisiones',
      message: 'Un periodo de deuda alta puede coincidir con gastos familiares o educativos.',
      detail: 'Comparar los hitos en el tiempo ayuda a no mirar cada gasto como si estuviera aislado.',
      suggestions: ['Mover el hito familiar', 'Bajar la cuota mensual simulada'],
      origin: seededOrigin,
    },
  ],
  stressEvents: [
    {
      id: 'unemployment-3',
      label: '3 meses sin empleo',
      description: 'Simula cubrir gastos esenciales durante tres meses.',
      months: 3,
      amount: 0,
      origin: seededOrigin,
    },
    {
      id: 'medical-shock',
      label: 'Gasto médico inesperado',
      description: 'Simula un gasto extraordinario de salud de S/ 8,000.',
      months: 0,
      amount: 8_000,
      origin: seededOrigin,
    },
  ] satisfies StressEventConfig[],
  roofOptions: [
    { id: 'site-mix', label: 'Preparado en obra', detail: 'Menor costo, más coordinación y tiempo.', costFactor: 0.92, durationMonths: 2, origin: seededOrigin },
    { id: 'mixer', label: 'Mixer', detail: 'Concreto premezclado con descarga coordinada.', costFactor: 1, durationMonths: 1, origin: seededOrigin },
    { id: 'mixer-pump', label: 'Mixer + bomba', detail: 'Más alcance para accesos difíciles.', costFactor: 1.12, durationMonths: 1, origin: seededOrigin },
    { id: 'integral', label: 'Servicio integral', detail: 'Una empresa coordina toda la etapa.', costFactor: 1.2, durationMonths: 1, origin: seededOrigin },
  ],
}

export function cloneContentConfig(config: ContentConfig): ContentConfig {
  return JSON.parse(JSON.stringify(config)) as ContentConfig
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function hasFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function validateContentConfig(value: unknown): { success: true; data: ContentConfig } | { success: false; error: string } {
  if (!isRecord(value) || value.version !== 1 || !hasText(value.productName)) {
    return { success: false, error: 'La configuración debe usar la versión 1 y tener nombre.' }
  }
  if (!isRecord(value.assumptions) || !Array.isArray(value.housingPaths) || !Array.isArray(value.constructionStages)) {
    return { success: false, error: 'Faltan supuestos, caminos o etapas.' }
  }
  if (!Array.isArray(value.timeline) || value.timeline.length === 0 || !Array.isArray(value.insights) || value.insights.length < 3) {
    return { success: false, error: 'Se requieren timeline e insights suficientes.' }
  }
  const assumptions = value.assumptions
  const numericKeys = ['initialSavings', 'monthlyIncome', 'essentialMonthlySpend', 'rentMonthly', 'landPurchaseCost', 'constructionInitialPayment'] as const
  if (numericKeys.some((key) => !hasFiniteNumber(assumptions[key]))) {
    return { success: false, error: 'Hay un supuesto numérico inválido.' }
  }
  const pathsValid = value.housingPaths.length >= 4 && value.housingPaths.every((item) => isRecord(item) && hasText(item.label) && hasText(item.description))
  const stagesValid = value.constructionStages.length > 0 && value.constructionStages.every((item) => isRecord(item) && hasText(item.id) && hasText(item.label))
  const insightsValid = value.insights.every((item) => isRecord(item) && hasText(item.ruleId) && hasText(item.message))
  if (!pathsValid || !stagesValid || !insightsValid) {
    return { success: false, error: 'Hay un camino, etapa o regla incompleta.' }
  }
  return { success: true, data: value as unknown as ContentConfig }
}
