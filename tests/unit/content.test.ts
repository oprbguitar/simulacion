import { describe, expect, it } from 'vitest'
import { cloneContentConfig, defaultContent, validateContentConfig } from '../../src/domain/content'

describe('contrato de contenido del studio', () => {
  it('acepta la configuración seeded', () => {
    expect(validateContentConfig(defaultContent).success).toBe(true)
    expect(cloneContentConfig(defaultContent)).toEqual(defaultContent)
    expect(cloneContentConfig(defaultContent)).not.toBe(defaultContent)
  })

  it('rechaza una configuración sin stages ni insights', () => {
    const invalid = { ...defaultContent, constructionStages: [], insights: [] }
    expect(validateContentConfig(invalid).success).toBe(false)
  })

  it('rechaza formas incompletas y números no finitos', () => {
    expect(validateContentConfig(null).success).toBe(false)
    expect(validateContentConfig({ ...defaultContent, productName: '' }).success).toBe(false)
    expect(validateContentConfig({ ...defaultContent, assumptions: null }).success).toBe(false)
    expect(validateContentConfig({ ...defaultContent, timeline: [] }).success).toBe(false)
    expect(validateContentConfig({ ...defaultContent, assumptions: { ...defaultContent.assumptions, rentMonthly: Number.NaN } }).success).toBe(false)
  })

  it('rechaza contenido que no tenga caminos, etapas o mensajes completos', () => {
    expect(validateContentConfig({ ...defaultContent, housingPaths: defaultContent.housingPaths.slice(0, 3) }).success).toBe(false)
    expect(validateContentConfig({ ...defaultContent, housingPaths: [{ ...defaultContent.housingPaths[0], label: '' }, ...defaultContent.housingPaths.slice(1)] }).success).toBe(false)
    expect(validateContentConfig({ ...defaultContent, constructionStages: [{ ...defaultContent.constructionStages[0], id: '' }] }).success).toBe(false)
    expect(validateContentConfig({ ...defaultContent, insights: [{ ...defaultContent.insights[0], message: '' }, ...defaultContent.insights.slice(1)] }).success).toBe(false)
  })
})
