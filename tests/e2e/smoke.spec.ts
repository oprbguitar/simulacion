import { expect, test } from '@playwright/test'

test('persona puede elegir un camino, avanzar y deshacerlo', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '¿Dónde vives actualmente?' })).toBeVisible()
  await expect(page.getByRole('img', { name: 'Familia reunida en la sala de una vivienda.' })).toBeVisible()
  await expect(page.getByRole('img', { name: /Casa familiar peruana en corte/ })).toBeVisible()
  await page.getByRole('button', { name: /Vivo con mi familia/ }).click()
  await expect(page.getByRole('button', { name: /Vivo con mi familia/ })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('button', { name: /Comprar terreno/ }).click()
  await expect(page.getByRole('heading', { name: 'Terreno en proceso' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Construir primer piso/ })).toBeVisible()
  await page.getByRole('button', { name: 'Deshacer último paso' }).click()
  await expect(page.getByRole('heading', { name: 'Casa familiar' })).toBeVisible()
})

test('la superficie no desborda en horizontal ni superpone sus bandas', async ({ page }, testInfo) => {
  await page.goto('/')
  const metrics = await page.evaluate(() => {
    const box = (selector: string) => {
      const element = document.querySelector(selector)
      if (!element) throw new Error(`falta ${selector}`)
      const rect = element.getBoundingClientRect()
      return { top: rect.top, bottom: rect.bottom }
    }
    const scene = box('.life-scene')
    const workbench = box('.sim-workbench')
    const deck = box('.decision-deck')
    const context = box('.context-panel')
    const timeline = box('.life-timeline')
    return {
      innerWidth,
      innerHeight,
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      sceneOverWorkbench: scene.bottom - workbench.top,
      workbenchOverTimeline: workbench.bottom - timeline.top,
      deckOverContext: deck.bottom - Math.max(context.top, deck.top),
    }
  })
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth)
  expect(metrics.sceneOverWorkbench).toBeLessThanOrEqual(1)
  expect(metrics.workbenchOverTimeline).toBeLessThanOrEqual(1)
  // En escritorio la experiencia completa debe caber sin scroll de documento.
  if (testInfo.project.name === 'desktop') expect(metrics.scrollHeight).toBeLessThanOrEqual(metrics.innerHeight)
  await expect(page.getByRole('heading', { name: 'Tu línea de tiempo' })).toBeVisible()
  await expect(page.getByRole('button', { name: /Modo «La vida pasa»/ })).toBeVisible()
})

test('ningún texto de la superficie baja de 12 px', async ({ page }) => {
  await page.goto('/')
  const tiny = await page.evaluate(() => {
    const found: string[] = []
    document.querySelectorAll('.sim-shell *').forEach((element) => {
      if (element.children.length > 0) return
      const text = element.textContent?.trim()
      if (!text || element.classList.contains('sr-only')) return
      if (parseFloat(getComputedStyle(element).fontSize) < 12) found.push(text.slice(0, 30))
    })
    return found
  })
  expect(tiny).toEqual([])
})

test('el modo «La vida pasa» aplica un imprevisto y lo revierte', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Modo «La vida pasa»/ }).click()
  await expect(page.getByRole('dialog')).toContainText('no son predicciones')
  await page.getByRole('button', { name: /Gasto médico inesperado/ }).click()
  await expect(page.getByRole('button', { name: /Gasto médico inesperado/ })).toHaveAttribute('aria-pressed', 'true')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toBeHidden()
  await page.getByRole('button', { name: 'Deshacer último paso' }).click()
  await expect(page.getByRole('button', { name: /Modo «La vida pasa»/ })).toHaveAttribute('aria-pressed', 'false')
})

test('el comparador muestra los tres caminos con la misma base', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Comparar alternativa', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('No hay un ganador universal')
  await expect(dialog.getByRole('row')).toHaveCount(4)
  await expect(dialog.getByText('Referencia sembrada')).toBeVisible()
})

test('construir habilita la decisión de vaciado del techo', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Comprar terreno/ }).click()
  await page.getByRole('button', { name: /Construir primer piso/ }).click()
  await page.getByRole('button', { name: /vaciado del techo/i }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toContainText('no dimensiona elementos estructurales')
  await dialog.getByRole('button', { name: /Mixer \+ bomba/ }).click()
  await expect(dialog.getByRole('button', { name: /Mixer \+ bomba/ })).toHaveAttribute('aria-pressed', 'true')
})

test('la ruta studio permite editar y volver al portal', async ({ page }) => {
  await page.goto('/_studio')
  await expect(page.getByText('HORIZONTE', { exact: true })).toBeVisible()
  const dataTab = page.getByRole('button', { name: 'Datos', exact: true })
  if (await dataTab.isVisible()) await dataTab.click()
  await page.getByLabel('Ahorro inicial').fill('30000')
  await expect(page.getByLabel('Ahorro inicial')).toHaveValue('30000')
  await page.getByRole('link', { name: /Ver simulador/ }).click()
  await expect(page.getByRole('heading', { name: '¿Dónde vives actualmente?' })).toBeVisible()
  await expect(page.getByText('S/ 30,000')).toBeVisible()
})

test('studio muestra gráficos y cabe en el viewport', async ({ page }) => {
  await page.goto('/_studio')
  await expect(page.getByText('Flujo mensual')).toBeVisible()
  await expect(page.getByText('Posición actual')).toBeVisible()
  await expect(page.getByText('Rango del paso')).toBeVisible()
  const dimensions = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.width)
  expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.height)
})
