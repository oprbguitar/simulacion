import { expect, test } from '@playwright/test'

test('persona puede elegir un camino, avanzar y deshacerlo', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: '¿Dónde vives actualmente?' })).toBeVisible()
  await expect(page.getByRole('img', { name: 'Familia reunida en la sala de una vivienda.' })).toBeVisible()
  await page.getByRole('button', { name: /Vivo con mi familia/ }).click()
  await expect(page.getByRole('heading', { name: 'Vivo con mi familia' })).toBeVisible()
  await expect(page.getByText('Detalle de esta ruta')).toBeVisible()
  await page.getByRole('button', { name: /Comprar terreno/ }).click()
  await expect(page.getByRole('heading', { name: 'Terreno en proceso' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Comprar terreno' })).toBeVisible()
  await expect(page.getByText('LOW_RESERVE_AFTER_PURCHASE')).toBeVisible()
  await page.getByRole('button', { name: 'Deshacer último paso' }).click()
  await expect(page.getByRole('heading', { name: 'Casa familiar' })).toBeVisible()
})

test('la ruta studio permite editar y volver al portal', async ({ page }) => {
  await page.goto('/_studio')
  await expect(page.getByRole('heading', { name: 'Editar el mundo' })).toBeVisible()
  await page.getByLabel('Ahorro inicial').fill('30000')
  await expect(page.getByText('S/ 30,000')).toBeVisible()
  await page.getByRole('link', { name: 'Volver al simulador' }).click()
  await expect(page.getByRole('heading', { name: '¿Dónde vives actualmente?' })).toBeVisible()
})
