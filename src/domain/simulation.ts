import type {
  ActionId,
  ComparisonResult,
  ContentConfig,
  HousingPathId,
  InsightMessage,
  ScenarioResult,
  ScenarioState,
  StressEventId,
  TimelineEvent,
} from './types'

interface CashflowInputs {
  income: number
  essential: number
  housing: number
  debt: number
  project: number
  events: number
}

const finiteOrZero = (value: number): number => (Number.isFinite(value) ? value : 0)

export function calculateMonthlyCashflow(inputs: CashflowInputs): number {
  return finiteOrZero(inputs.income) - finiteOrZero(inputs.essential) - finiteOrZero(inputs.housing) - finiteOrZero(inputs.debt) - finiteOrZero(inputs.project) - finiteOrZero(inputs.events)
}

export function calculateReserveMonths(liquidSavings: number, essentialMonthlySpend: number): number {
  if (essentialMonthlySpend <= 0 || liquidSavings <= 0) return 0
  return Number((liquidSavings / essentialMonthlySpend).toFixed(1))
}

function pathStage(path: HousingPathId): ScenarioState['sceneStage'] {
  if (path === 'renting') return 'rental'
  if (path === 'land') return 'land'
  return 'family'
}

function defaultRoof(config: ContentConfig): ScenarioState['roofOption'] {
  return config.roofOptions.at(1)?.id ?? 'mixer'
}

export function createInitialScenario(config: ContentConfig): ScenarioState {
  return {
    housingPath: null,
    selectedAction: null,
    actionHistory: [],
    currentMonth: 0,
    liquidSavings: config.assumptions.initialSavings,
    monthlyIncome: config.assumptions.monthlyIncome,
    essentialMonthlySpend: config.assumptions.essentialMonthlySpend,
    monthlyHousingCost: 0,
    debtMonthly: config.assumptions.debtMonthly,
    projectMonthlyCost: 0,
    projectCost: 0,
    assetValue: 0,
    sceneStage: 'family',
    constructionStageIndex: 0,
    activeTimelineId: 'today',
    selectedLayer: 'structure',
    stressEvents: [],
    roofOption: defaultRoof(config),
    structuralPlanConfirmed: false,
  }
}

function timelineStatus(eventMonth: number, currentMonth: number): TimelineEvent['status'] {
  if (eventMonth < currentMonth) return 'done'
  if (eventMonth === currentMonth) return 'current'
  return 'planned'
}

function buildTimeline(state: ScenarioState, config: ContentConfig): TimelineEvent[] {
  const action = state.selectedAction
  const events = config.timeline.map((preset) => ({
    id: preset.id,
    month: preset.month,
    label: preset.label,
    description: preset.description,
    kind: preset.kind,
    status: timelineStatus(preset.month, state.currentMonth),
    origin: preset.origin,
  }))
  const pathLabel = state.housingPath === 'renting' ? 'Alquiler' : state.housingPath === 'land' ? 'Terreno propio' : state.housingPath === 'none' ? 'Comparar opciones' : 'Vivienda familiar'
  const first = events.at(0)
  const withPath = first
    ? [{ ...first, label: pathLabel, description: `Punto de partida: ${pathLabel}.` }, ...events.slice(1)]
    : events
  if (action === 'save-more' || action === 'keep-family-home') {
    return withPath.map((event) => (event.id === 'save' ? { ...event, status: 'current', description: 'Aumentas el colchón antes de decidir.' } : event))
  }
  if (action === 'buy-land') {
    return withPath.map((event) => {
      if (event.id === 'land') return { ...event, status: 'current', description: 'Terreno simulado; el proyecto ya tiene un lugar.' }
      if (event.id === 'save') return { ...event, status: 'done' }
      return event
    })
  }
  if (action === 'build-first-floor') {
    return withPath.map((event) => {
      if (event.id === 'land' || event.id === 'foundations') return { ...event, status: 'done' }
      if (event.id === 'structure') return { ...event, status: 'current', description: 'Estructura y muros en simulación.' }
      return event
    })
  }
  if (action === 'rent-home') {
    return withPath.map((event) => (event.id === 'save' ? { ...event, label: 'Mudanza', status: 'current', description: 'Costo recurrente para vivir de forma independiente.' } : event))
  }
  return withPath
}

function stressCost(id: StressEventId, state: ScenarioState, config: ContentConfig): number {
  const event = config.stressEvents.find((item) => item.id === id)
  if (!event) return 0
  if (id === 'unemployment-3') return state.essentialMonthlySpend * event.months
  return event.amount
}

function stressDelay(id: StressEventId, config: ContentConfig): number {
  return id === 'unemployment-3' ? (config.stressEvents.find((item) => item.id === id)?.months ?? 0) : 0
}

export function selectHousingPath(state: ScenarioState, path: HousingPathId): ScenarioState {
  return {
    ...state,
    housingPath: path,
    selectedAction: null,
    actionHistory: [],
    sceneStage: pathStage(path),
    currentMonth: 0,
    monthlyHousingCost: 0,
    projectMonthlyCost: 0,
    projectCost: 0,
    assetValue: 0,
    constructionStageIndex: 0,
    activeTimelineId: 'today',
    stressEvents: [],
  }
}

export function simulateAction(state: ScenarioState, action: ActionId, config: ContentConfig): ScenarioState {
  const assumptions = config.assumptions
  const nextBase: ScenarioState = {
    ...state,
    selectedAction: action,
    actionHistory: [...state.actionHistory, action],
    currentMonth: state.currentMonth,
  }
  if (action === 'save-more' || action === 'keep-family-home') {
    return {
      ...nextBase,
      housingPath: state.housingPath ?? 'family',
      sceneStage: 'family',
      currentMonth: state.currentMonth + 6,
      liquidSavings: state.liquidSavings + assumptions.monthlySavingBoost * 6,
      monthlyHousingCost: assumptions.familyHousingCost,
      projectMonthlyCost: 0,
      activeTimelineId: 'save',
    }
  }
  if (action === 'buy-land') {
    return {
      ...nextBase,
      housingPath: state.housingPath ?? 'family',
      sceneStage: 'land',
      currentMonth: Math.max(6, state.currentMonth + 6),
      liquidSavings: Math.max(0, state.liquidSavings - assumptions.landPurchaseCost),
      assetValue: state.assetValue + assumptions.landAssetValue,
      projectCost: state.projectCost + assumptions.landPurchaseCost,
      projectMonthlyCost: 0,
      constructionStageIndex: 2,
      activeTimelineId: 'land',
    }
  }
  if (action === 'build-first-floor') {
    return {
      ...nextBase,
      housingPath: state.housingPath ?? 'land',
      sceneStage: 'structure',
      currentMonth: state.currentMonth + 12,
      liquidSavings: Math.max(0, state.liquidSavings - assumptions.constructionInitialPayment),
      assetValue: state.assetValue + assumptions.constructionAssetValue,
      projectCost: state.projectCost + assumptions.constructionInitialPayment,
      projectMonthlyCost: assumptions.constructionMonthlyCost,
      constructionStageIndex: 4,
      activeTimelineId: 'structure',
    }
  }
  return {
    ...nextBase,
    housingPath: state.housingPath ?? 'none',
    sceneStage: 'rental',
    currentMonth: state.currentMonth + 1,
    monthlyHousingCost: assumptions.rentMonthly,
    projectMonthlyCost: 0,
    activeTimelineId: 'save',
  }
}

export function toggleStressEvent(state: ScenarioState, id: StressEventId, config: ContentConfig): ScenarioState {
  const active = state.stressEvents.includes(id)
  const eventCost = stressCost(id, state, config)
  const delay = stressDelay(id, config)
  const stressEvents = active ? state.stressEvents.filter((eventId) => eventId !== id) : [...state.stressEvents, id]
  return {
    ...state,
    stressEvents,
    liquidSavings: Math.max(0, state.liquidSavings + (active ? eventCost : -eventCost)),
    currentMonth: Math.max(0, state.currentMonth + (active ? -delay : delay)),
    activeTimelineId: active ? state.activeTimelineId : 'stress',
  }
}

function activeEventCost(state: ScenarioState, config: ContentConfig): number {
  return state.stressEvents.reduce((total, id) => total + stressCost(id, state, config), 0)
}

export function evaluateInsights(state: ScenarioState, config: ContentConfig): InsightMessage[] {
  const reserveMonths = calculateReserveMonths(state.liquidSavings, state.essentialMonthlySpend)
  const savingsUsageRatio = state.projectCost <= 0 ? 0 : Math.min(1, state.projectCost / Math.max(1, config.assumptions.initialSavings))
  return config.insights.map((rule) => {
    const active = rule.ruleId === 'LOW_RESERVE_AFTER_PURCHASE'
      ? reserveMonths < 3 && savingsUsageRatio > 0.8
      : rule.ruleId === 'FUTURE_STRUCTURAL_CAPACITY'
        ? state.sceneStage === 'structure' && !state.structuralPlanConfirmed
        : state.debtMonthly > 0 && state.currentMonth >= 12
    return { ...rule, active }
  })
}

function sceneLabel(state: ScenarioState): string {
  if (state.sceneStage === 'rental') return 'Vivienda alquilada'
  if (state.sceneStage === 'land') return 'Terreno en proceso'
  if (state.sceneStage === 'structure') return 'Construcción en marcha'
  if (state.sceneStage === 'home') return 'Hogar futuro'
  return 'Casa familiar'
}

function nextPrompt(state: ScenarioState): string {
  if (!state.housingPath) return 'Elige tu punto de partida para comenzar.'
  if (state.sceneStage === 'land') return 'El terreno ya está en la ruta. ¿Quieres comenzar el primer piso?'
  if (state.sceneStage === 'structure') return 'La estructura aparece. ¿Quieres cuidar la reserva o revisar el techo?'
  if (state.sceneStage === 'rental') return 'Ya tienes una vivienda independiente. ¿Quieres comparar cuánto cuesta sostenerla?'
  return '¿Qué quieres probar ahora?'
}

export function simulateScenario(state: ScenarioState, config: ContentConfig): ScenarioResult {
  const eventsCost = activeEventCost(state, config)
  const monthlyCashflow = calculateMonthlyCashflow({
    income: state.monthlyIncome,
    essential: state.essentialMonthlySpend,
    housing: state.monthlyHousingCost,
    debt: state.debtMonthly,
    project: state.projectMonthlyCost,
    events: 0,
  })
  const reserveMonths = calculateReserveMonths(state.liquidSavings, state.essentialMonthlySpend)
  const patrimony = Math.max(0, state.assetValue - state.debtMonthly * 12)
  const savingsUsageRatio = state.projectCost <= 0 ? 0 : Math.min(1, state.projectCost / Math.max(1, config.assumptions.initialSavings))
  const timeline: TimelineEvent[] = buildTimeline(state, config).map((event): TimelineEvent => {
    if (state.stressEvents.length > 0 && event.month >= state.currentMonth) return { ...event, status: 'at-risk' }
    return event
  })
  const insights = evaluateInsights(state, config)
  const activeInsight = insights.find((item) => item.active) ?? insights.at(0) ?? null
  const baseCost = Math.max(state.projectCost, config.assumptions.constructionInitialPayment)
  return {
    state: { ...state },
    reserveMonths,
    monthlyCashflow: monthlyCashflow - eventsCost,
    patrimony,
    savingsUsageRatio,
    timeline,
    insights,
    activeInsight,
    sceneLabel: sceneLabel(state),
    nextPrompt: nextPrompt(state),
    costRange: {
      low: Math.round(baseCost * config.assumptions.costRangeLowFactor),
      expected: Math.round(baseCost),
      high: Math.round(baseCost * config.assumptions.costRangeHighFactor),
    },
  }
}

export function compareScenarios(state: ScenarioState, config: ContentConfig): ComparisonResult[] {
  const assumptions = config.assumptions
  const baseline = state.liquidSavings
  return [
    {
      id: 'family',
      label: 'Seguir con familia',
      description: 'Más liquidez para ordenar el siguiente paso.',
      monthlyCost: assumptions.familyHousingCost,
      projectedSavings: baseline + assumptions.monthlySavingBoost * 24,
      projectedPatrimony: state.assetValue,
      origin: 'SEEDED_REFERENCE',
    },
    {
      id: 'renting',
      label: 'Alquilar',
      description: 'Independencia con costo mensual recurrente.',
      monthlyCost: assumptions.rentMonthly,
      projectedSavings: Math.max(0, baseline + (assumptions.monthlyIncome - assumptions.essentialMonthlySpend - assumptions.rentMonthly) * 24),
      projectedPatrimony: state.assetValue,
      origin: 'SEEDED_REFERENCE',
    },
    {
      id: 'build',
      label: 'Comprar + construir',
      description: 'Más patrimonio potencial, menos liquidez inicial.',
      monthlyCost: assumptions.constructionMonthlyCost,
      projectedSavings: Math.max(0, baseline - assumptions.landPurchaseCost - assumptions.constructionInitialPayment),
      projectedPatrimony: state.assetValue + assumptions.landAssetValue + assumptions.constructionAssetValue,
      origin: 'SEEDED_REFERENCE',
    },
  ]
}
