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
  await expect(page.getByText('Frágil')).toBeVisible()
  await expect(page.getByRole('button', { name: /Construir primer piso/ })).toBeVisible()
  await page.getByRole('button', { name: 'Deshacer último paso' }).click()
  await expect(page.getByRole('heading', { name: 'Casa familiar' })).toBeVisible()
})

test('la experiencia completa cabe en una sola pantalla', async ({ page }) => {
  await page.goto('/')
  const dimensions = await page.evaluate(() => ({
    innerWidth,
    innerHeight,
    scrollWidth: document.documentElement.scrollWidth,
    scrollHeight: document.documentElement.scrollHeight,
  }))
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.innerWidth)
  expect(dimensions.scrollHeight).toBeLessThanOrEqual(dimensions.innerHeight)
  await expect(page.getByRole('heading', { name: 'La vida pasa' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Gasto médico inesperado' })).toBeVisible()
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
