import { beforeEach, describe, expect, it } from 'vitest'
import { cloneContentConfig, defaultContent } from '../../src/domain/content'
import { clearStoredContent, CONTENT_STORAGE_KEY, loadStoredContent, saveStoredContent } from '../../src/domain/configStorage'

describe('persistencia local de supuestos', () => {
  beforeEach(() => localStorage.clear())

  it('guarda una configuración válida y la recupera como copia', () => {
    const config = cloneContentConfig(defaultContent)
    config.assumptions.initialSavings = 30_000
    expect(saveStoredContent(config)).toBe(true)
    expect(loadStoredContent().assumptions.initialSavings).toBe(30_000)
    expect(loadStoredContent()).not.toBe(config)
  })

  it('ignora datos inválidos y vuelve a los valores iniciales', () => {
    localStorage.setItem(CONTENT_STORAGE_KEY, '{"version":99}')
    expect(loadStoredContent()).toEqual(defaultContent)
    localStorage.setItem(CONTENT_STORAGE_KEY, 'no-json')
    expect(loadStoredContent()).toEqual(defaultContent)
  })

  it('elimina la configuración persistida', () => {
    expect(saveStoredContent(defaultContent)).toBe(true)
    clearStoredContent()
    expect(localStorage.getItem(CONTENT_STORAGE_KEY)).toBeNull()
  })
})
