export type DataOrigin = 'REAL' | 'SEEDED_REFERENCE' | 'MOCK'

export type HousingPathId = 'family' | 'renting' | 'land' | 'none'
export type ActionId = 'save-more' | 'buy-land' | 'rent-home' | 'build-first-floor' | 'keep-family-home'
export type SceneStage = 'family' | 'rental' | 'land' | 'foundation' | 'structure' | 'home'
export type LayerId = 'site' | 'structure' | 'systems' | 'finishes'
export type StressEventId = 'unemployment-3' | 'medical-shock'

export type TimelineKind =
  | 'decision'
  | 'milestone'
  | 'expense'
  | 'construction_stage'
  | 'risk_event'

export interface SourceMeta {
  origin: DataOrigin
  sourceName: string
  sourceUrl?: string
  capturedAt?: string
  note: string
}

export interface HousingPathConfig {
  id: HousingPathId
  label: string
  description: string
  icon: 'family' | 'renting' | 'land' | 'none'
  origin: DataOrigin
}

export interface ConstructionStageConfig {
  id: string
  label: string
  shortLabel: string
  phase: 'base' | 'obra' | 'sistemas' | 'acabados'
  origin: DataOrigin
}

export interface TimelinePreset {
  id: string
  month: number
  label: string
  description: string
  kind: TimelineKind
  origin: DataOrigin
}

export interface InsightConfig {
  ruleId: string
  title: string
  message: string
  detail: string
  suggestions: string[]
  origin: DataOrigin
}

export interface StressEventConfig {
  id: StressEventId
  label: string
  description: string
  months: number
  amount: number
  origin: DataOrigin
}

export interface RoofOptionConfig {
  id: 'site-mix' | 'mixer' | 'mixer-pump' | 'integral'
  label: string
  detail: string
  costFactor: number
  durationMonths: number
  origin: DataOrigin
}

export interface SimulationAssumptions {
  initialSavings: number
  monthlyIncome: number
  essentialMonthlySpend: number
  familyHousingCost: number
  rentMonthly: number
  monthlySavingBoost: number
  landPurchaseCost: number
  landAssetValue: number
  constructionInitialPayment: number
  constructionAssetValue: number
  constructionMonthlyCost: number
  debtMonthly: number
  maintenanceMonthly: number
  costRangeLowFactor: number
  costRangeHighFactor: number
  source: SourceMeta
}

export interface ContentConfig {
  version: 1
  productName: string
  assumptions: SimulationAssumptions
  housingPaths: HousingPathConfig[]
  constructionStages: ConstructionStageConfig[]
  timeline: TimelinePreset[]
  insights: InsightConfig[]
  stressEvents: StressEventConfig[]
  roofOptions: RoofOptionConfig[]
}

export interface TimelineEvent {
  id: string
  month: number
  label: string
  description: string
  kind: TimelineKind
  status: 'done' | 'current' | 'planned' | 'at-risk'
  origin: DataOrigin
}

export interface ScenarioState {
  housingPath: HousingPathId | null
  selectedAction: ActionId | null
  actionHistory: ActionId[]
  currentMonth: number
  liquidSavings: number
  monthlyIncome: number
  essentialMonthlySpend: number
  monthlyHousingCost: number
  debtMonthly: number
  projectMonthlyCost: number
  projectCost: number
  assetValue: number
  sceneStage: SceneStage
  constructionStageIndex: number
  activeTimelineId: string
  selectedLayer: LayerId
  stressEvents: StressEventId[]
  roofOption: RoofOptionConfig['id']
  structuralPlanConfirmed: boolean
}

export interface InsightMessage extends InsightConfig {
  active: boolean
}

export interface ScenarioResult {
  state: ScenarioState
  reserveMonths: number
  monthlyCashflow: number
  patrimony: number
  savingsUsageRatio: number
  timeline: TimelineEvent[]
  insights: InsightMessage[]
  activeInsight: InsightMessage | null
  sceneLabel: string
  nextPrompt: string
  costRange: {
    low: number
    expected: number
    high: number
  }
}

export interface ComparisonResult {
  id: string
  label: string
  description: string
  monthlyCost: number
  projectedSavings: number
  projectedPatrimony: number
  origin: DataOrigin
}
