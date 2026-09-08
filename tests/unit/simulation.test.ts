import { describe, expect, it } from 'vitest'
import { defaultContent } from '../../src/domain/content'
import {
  calculateMonthlyCashflow,
  calculateReserveMonths,
  compareScenarios,
  createInitialScenario,
  evaluateInsights,
  selectHousingPath,
  simulateScenario,
  simulateAction,
  toggleStressEvent,
} from '../../src/domain/simulation'

describe('motor determinista de Horizonte', () => {
  it('calcula una reserva finita y estable', () => {
    expect(calculateReserveMonths(12_000, 2_000)).toBe(6)
    expect(calculateReserveMonths(12_000, 0)).toBe(0)
  })

  it('calcula flujo mensual sin permitir NaN', () => {
    expect(calculateMonthlyCashflow({ income: 4_800, essential: 2_500, housing: 800, debt: 300, project: 200, events: 0 })).toBe(1_000)
    expect(Number.isFinite(calculateMonthlyCashflow({ income: 0, essential: 0, housing: 0, debt: 0, project: 0, events: 0 }))).toBe(true)
    expect(calculateMonthlyCashflow({ income: Number.NaN, essential: Number.POSITIVE_INFINITY, housing: 0, debt: 0, project: 0, events: 0 })).toBe(0)
  })

  it('mantiene cero cuando no hay ahorro líquido', () => {
    expect(calculateReserveMonths(0, 2_000)).toBe(0)
    expect(calculateReserveMonths(-1, 2_000)).toBe(0)
  })

  it('permite cambiar entre los cuatro puntos de partida sin arrastrar decisiones', () => {
    const initial = createInitialScenario(defaultContent)
    for (const path of ['family', 'renting', 'land', 'none'] as const) {
      const next = selectHousingPath({ ...initial, selectedAction: 'buy-land', stressEvents: ['medical-shock'] }, path)
      expect(next.housingPath).toBe(path)
      expect(next.selectedAction).toBeNull()
      expect(next.stressEvents).toEqual([])
      expect(next.sceneStage).toBe(path === 'renting' ? 'rental' : path === 'land' ? 'land' : 'family')
    }
  })

  it('usa el fallback del techo si la colección llega vacía', () => {
    const config = { ...defaultContent, roofOptions: [] }
    expect(createInitialScenario(config).roofOption).toBe('mixer')
  })

  it('aplica comprar terreno como transición visual y temporal', () => {
    const initial = createInitialScenario(defaultContent)
    const next = simulateAction(initial, 'buy-land', defaultContent)
    expect(next.housingPath).toBe('family')
    expect(next.sceneStage).toBe('land')
    expect(next.liquidSavings).toBeLessThan(initial.liquidSavings)
    expect(simulateScenario(next, defaultContent).timeline.some((event) => event.kind === 'milestone' && event.label.includes('Terreno'))).toBe(true)
  })

  it('expone la regla de reserva baja después de construir', () => {
    const initial = createInitialScenario(defaultContent)
    const built = simulateAction(simulateAction(initial, 'buy-land', defaultContent), 'build-first-floor', defaultContent)
    const insights = evaluateInsights(built, defaultContent)
    expect(insights.map((item) => item.ruleId)).toContain('LOW_RESERVE_AFTER_PURCHASE')
    expect(simulateScenario(built, defaultContent).insights.find((item) => item.ruleId === 'FUTURE_STRUCTURAL_CAPACITY')?.active).toBe(true)
    expect(evaluateInsights({ ...built, structuralPlanConfirmed: true }, defaultContent).find((item) => item.ruleId === 'FUTURE_STRUCTURAL_CAPACITY')?.active).toBe(false)
  })

  it('simula ahorro, continuidad familiar y alquiler', () => {
    const initial = createInitialScenario(defaultContent)
    const saved = simulateAction(selectHousingPath(initial, 'family'), 'save-more', defaultContent)
    expect(saved.currentMonth).toBe(6)
    expect(saved.liquidSavings).toBeGreaterThan(initial.liquidSavings)
    const kept = simulateAction(saved, 'keep-family-home', defaultContent)
    expect(kept.sceneStage).toBe('family')
    const rented = simulateAction(selectHousingPath(initial, 'none'), 'rent-home', defaultContent)
    expect(rented.sceneStage).toBe('rental')
    expect(simulateScenario(rented, defaultContent).monthlyCashflow).toBeLessThan(saved.monthlyIncome - saved.essentialMonthlySpend)
  })

  it('activa y revierte stress sin mutar el estado anterior', () => {
    const initial = createInitialScenario(defaultContent)
    const stressed = toggleStressEvent(initial, 'unemployment-3', defaultContent)
    expect(stressed.stressEvents).toContain('unemployment-3')
    expect(stressed.liquidSavings).toBeLessThan(initial.liquidSavings)
    expect(initial.stressEvents).toEqual([])
    const restored = toggleStressEvent(stressed, 'unemployment-3', defaultContent)
    expect(restored.stressEvents).toEqual([])
    const medical = toggleStressEvent(initial, 'medical-shock', defaultContent)
    expect(medical.liquidSavings).toBe(initial.liquidSavings - 8_000)
    expect(simulateScenario(medical, defaultContent).timeline.some((event) => event.status === 'at-risk')).toBe(true)
    expect(toggleStressEvent(medical, 'medical-shock', defaultContent).liquidSavings).toBe(initial.liquidSavings)
  })

  it('evalúa deuda educativa cuando el escenario ya tiene historial', () => {
    const state = { ...createInitialScenario(defaultContent), currentMonth: 12, debtMonthly: 400 }
    expect(evaluateInsights(state, defaultContent).find((item) => item.ruleId === 'EDUCATION_DEBT_OVERLAP')?.active).toBe(true)
    expect(evaluateInsights({ ...state, currentMonth: 6 }, defaultContent).find((item) => item.ruleId === 'EDUCATION_DEBT_OVERLAP')?.active).toBe(false)
  })

  it('presenta timeline para cada acción y para el estado inicial', () => {
    const initial = createInitialScenario(defaultContent)
    const scenarios = [
      initial,
      simulateAction(initial, 'save-more', defaultContent),
      simulateAction(initial, 'keep-family-home', defaultContent),
      simulateAction(initial, 'buy-land', defaultContent),
      simulateAction(initial, 'build-first-floor', defaultContent),
      simulateAction(initial, 'rent-home', defaultContent),
      { ...initial, sceneStage: 'home' as const, housingPath: 'land' as const },
    ]
    for (const scenario of scenarios) expect(simulateScenario(scenario, defaultContent).timeline.length).toBeGreaterThan(0)
    expect(simulateScenario(initial, defaultContent).nextPrompt).toContain('Elige')
  })

  it('compara alternativas con la misma semántica', () => {
    const initial = createInitialScenario(defaultContent)
    const scenarios = compareScenarios(initial, defaultContent)
    expect(scenarios).toHaveLength(3)
    expect(scenarios.every((item) => Number.isFinite(item.monthlyCost) && Number.isFinite(item.projectedPatrimony))).toBe(true)
  })
})
