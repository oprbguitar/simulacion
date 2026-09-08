import { cloneContentConfig, defaultContent, validateContentConfig } from './content'
import type { ContentConfig } from './types'

export const CONTENT_STORAGE_KEY = 'horizonte.content.v1'

export function loadStoredContent(): ContentConfig {
  if (typeof window === 'undefined') return cloneContentConfig(defaultContent)
  try {
    const raw = window.localStorage.getItem(CONTENT_STORAGE_KEY)
    if (!raw) return cloneContentConfig(defaultContent)
    const checked = validateContentConfig(JSON.parse(raw) as unknown)
    return checked.success ? cloneContentConfig(checked.data) : cloneContentConfig(defaultContent)
  } catch {
    return cloneContentConfig(defaultContent)
  }
}

export function saveStoredContent(config: ContentConfig): boolean {
  if (typeof window === 'undefined') return false
  const checked = validateContentConfig(config)
  if (!checked.success) return false
  try {
    window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(checked.data))
    return true
  } catch {
    return false
  }
}

export function clearStoredContent(): void {
  if (typeof window !== 'undefined') window.localStorage.removeItem(CONTENT_STORAGE_KEY)
}
