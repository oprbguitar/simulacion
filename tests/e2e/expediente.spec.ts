import { expect, test } from '@playwright/test'

test('el expediente abre con su índice y sus ocho secciones', async ({ page }) => {
  await page.goto('/_expediente')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Llegaste al Perú')
  for (const titulo of [
    'Adquirir la propiedad',
    'Construir',
    'Traer un hijo al mundo',
    'Habitar la casa',
    'De dónde sale el ingreso',
    'Lo que el plan no contempla',
    'De dónde sale cada dato',
  ]) {
    await expect(page.getByRole('heading', { name: titulo, exact: true })).toBeVisible()
  }
})

test('no desborda en horizontal', async ({ page }) => {
  await page.goto('/_expediente')
  const metrics = await page.evaluate(() => ({
    innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth + 1)
})

test('ningún texto del expediente baja de 12 px', async ({ page }) => {
  await page.goto('/_expediente')
  const pequenos = await page.evaluate(() => {
    const encontrados: string[] = []
    document.querySelectorAll('.ex-shell *').forEach((element) => {
      if (element.children.length > 0) return
      const texto = element.textContent?.trim()
      if (!texto) return
      if (parseFloat(getComputedStyle(element).fontSize) < 12) encontrados.push(texto.slice(0, 30))
    })
    return encontrados
  })
  expect(pequenos).toEqual([])
})

test('cada fase de obra despliega su metrado y su enlace normativo', async ({ page }) => {
  await page.goto('/_expediente#construccion')
  await page.getByRole('button', { name: /Losa aligerada/ }).click()
  const fase = page.locator('.ex-fase.is-abierta')
  await expect(fase).toContainText('Ladrillo de techo 15 × 30 × 30 cm')
  await expect(fase).toContainText('m² de losa e = 20 cm')
  await expect(fase.getByRole('link', { name: /Reglamento Nacional de Edificaciones/ })).toBeVisible()
})

test('la tabla de materiales se recalcula con el área techada', async ({ page }) => {
  await page.goto('/_expediente')
  const area = page.getByLabel('Área techada por piso (m²)')
  await area.fill('60')
  await expect(page.locator('#construccion')).toContainText('Cuánto material entra en 60 m²')
  const cemento60 = await page.locator('#construccion tbody tr', { hasText: 'Cemento (bolsas de 42.5 kg)' }).innerText()
  await area.fill('120')
  await expect(page.locator('#construccion')).toContainText('Cuánto material entra en 120 m²')
  const cemento120 = await page.locator('#construccion tbody tr', { hasText: 'Cemento (bolsas de 42.5 kg)' }).innerText()
  expect(cemento120).not.toEqual(cemento60)
})

test('el esquema de vacunación aparece completo y marcado como gratuito', async ({ page }) => {
  await page.goto('/_expediente#familia')
  const tabla = page.locator('.ex-tabla-vacunas')
  await expect(tabla).toContainText('Nirsevimab')
  await expect(tabla).toContainText('Virus del Papiloma Humano (VPH)')
  await expect(tabla).toContainText('Hexavalente (1.ª dosis)')
  expect(await tabla.locator('tbody tr').count()).toBeGreaterThanOrEqual(28)
  expect(await tabla.getByText('Gratuita').count()).toBeGreaterThanOrEqual(28)
})

test('activar un imprevisto cambia el estado del plan', async ({ page }) => {
  await page.goto('/_expediente')
  const antes = await page.locator('.ex-estado dd').nth(1).innerText()
  await page.locator('.ex-imprevisto', { hasText: 'Pérdida del empleo' }).getByRole('button').first().click()
  await expect(page.locator('.ex-imprevisto', { hasText: 'Pérdida del empleo' })).toHaveClass(/is-on/)
  await expect(page.locator('.ex-estado dd').nth(1)).not.toHaveText(antes)
})

test('el gráfico de años permite abrir el detalle de un año concreto', async ({ page }) => {
  await page.goto('/_expediente#proyeccion')
  await expect(page.locator('.ex-detalle-anio header')).toContainText('Año 0')
  await page.locator('.ex-grafico-col').nth(12).click()
  await expect(page.locator('.ex-detalle-anio header')).toContainText('Año 12')
})

test('el índice de fuentes enlaza a entidades del Estado con fecha de verificación', async ({ page }) => {
  await page.goto('/_expediente#fuentes')
  const indice = page.locator('.ex-indice-fuentes')
  await expect(indice.getByRole('link', { name: /Esquema Nacional de Inmunizaciones/ })).toHaveAttribute(
    'href',
    'https://www.gob.pe/22037-esquema-nacional-de-inmunizaciones',
  )
  await expect(indice.getByRole('link').first()).toContainText('verificado')
  expect(await indice.getByRole('link').count()).toBeGreaterThanOrEqual(30)
})

test('en móvil el índice se abre y se cierra', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/_expediente')
  const toggle = page.getByRole('button', { name: 'Índice', exact: true })
  await expect(toggle).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Índice del expediente' })).toBeHidden()
  await toggle.click()
  await expect(page.getByRole('navigation', { name: 'Índice del expediente' })).toBeVisible()
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
  await expect(page.getByRole('navigation', { name: 'Índice del expediente' })).toBeHidden()
})
