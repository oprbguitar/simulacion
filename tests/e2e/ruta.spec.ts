import { expect, test } from '@playwright/test'

test('la portada abre el juego con su marcador', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Acabas de llegar')
  await expect(page.getByRole('link', { name: 'Empezar la ruta' })).toBeVisible()
  await expect(page.locator('.rt-hud')).toContainText('Patrimonio al final')
})

test('las ocho bandas están y traen su ilustración o su decisión', async ({ page }) => {
  await page.goto('/')
  for (const [id, titulo] of [
    ['partida', '¿Quién eres al empezar?'],
    ['terreno', '¿Dónde vas a vivir?'],
    ['obra', 'Construir de a pocos'],
    ['familia', '¿Y si tienes hijos?'],
    ['servicios', 'La casa también cobra todos los meses'],
    ['trabajo', '¿De qué vives?'],
    ['cartas', 'Y entonces la vida se mete'],
    ['mapa', 'Tu ruta, año por año'],
  ] as const) {
    await expect(page.locator(`#${id}`)).toContainText(titulo)
  }
})

test('elegir un punto de partida cambia el marcador', async ({ page }) => {
  await page.goto('/')
  await page.locator('#partida').scrollIntoViewIfNeeded()
  const patrimonio = page.locator('.rt-hud-marcador > div').nth(2)
  const antes = await patrimonio.innerText()
  await page.getByRole('button', { name: /Recién empiezo/ }).click()
  await expect(page.getByRole('button', { name: /Recién empiezo/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(patrimonio).not.toHaveText(antes)
})

test('la palanca de años reparte el costo de la obra', async ({ page }) => {
  await page.goto('/#obra')
  const palanca = page.getByLabel('¿En cuántos años la construyes?')
  await palanca.fill('4')
  const cuatro = await page.locator('#obra .rt-ficha').nth(2).innerText()
  await palanca.fill('16')
  const dieciseis = await page.locator('#obra .rt-ficha').nth(2).innerText()
  expect(cuatro).not.toEqual(dieciseis)
})

test('el tablero de vacunas muestra el esquema y explica cada una', async ({ page }) => {
  await page.goto('/#familia')
  const tablero = page.locator('.rt-vacunas')
  await expect(tablero.locator('.rt-vacuna')).toHaveCount(29)
  await tablero.getByRole('button', { name: /Nirsevimab/ }).click()
  await expect(page.locator('.rt-vacuna-detalle')).toContainText('Virus Respiratorio Sincitial')
  await expect(page.locator('.rt-vacuna-detalle')).toContainText('S/ 0')
})

test('voltear una carta de imprevisto cambia el resultado', async ({ page }) => {
  await page.goto('/#cartas')
  const carta = page.locator('.rt-naipe', { hasText: 'Pérdida del empleo' })
  await carta.click()
  await expect(carta).toHaveClass(/es-volteado/)
  await expect(page.locator('#cartas .rt-consecuencia')).toContainText('carta encima')
})

test('el mapa deja caminar la ruta año por año', async ({ page }) => {
  await page.goto('/#mapa')
  await expect(page.locator('.rt-anio')).toContainText('Año 0')
  await page.locator('.rt-casilla').nth(14).click()
  await expect(page.locator('.rt-anio')).toContainText('Año 14')
})

test('el cajón guarda el detalle denso con sus fuentes y se cierra con Escape', async ({ page }) => {
  await page.goto('/#terreno')
  await page.getByRole('button', { name: /trámites, requisitos y enlaces oficiales/ }).click()
  const cajon = page.getByRole('dialog', { name: 'Adquirir la propiedad' })
  await expect(cajon).toBeVisible()
  await expect(cajon.getByRole('link', { name: /SUNARP/ }).first()).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(cajon).toBeHidden()
})

test('deshacer devuelve la decisión anterior', async ({ page }) => {
  await page.goto('/#obra')
  await page.getByRole('button', { name: /Alto Porcelanato/ }).click()
  const costo = page.locator('#obra .rt-ficha').first()
  const conAlto = await costo.innerText()
  await page.getByRole('button', { name: 'Deshacer la última decisión' }).click()
  await expect(costo).not.toHaveText(conAlto)
})

test('no desborda en horizontal ni baja de 12 px', async ({ page }) => {
  await page.goto('/')
  const metricas = await page.evaluate(() => {
    const pequenos: string[] = []
    document.querySelectorAll('.rt-shell *').forEach((elemento) => {
      if (elemento.children.length > 0) return
      const texto = elemento.textContent?.trim()
      if (!texto) return
      if (parseFloat(getComputedStyle(elemento).fontSize) < 12) pequenos.push(texto.slice(0, 30))
    })
    return { innerWidth, scrollWidth: document.documentElement.scrollWidth, pequenos }
  })
  expect(metricas.scrollWidth).toBeLessThanOrEqual(metricas.innerWidth + 1)
  expect(metricas.pequenos).toEqual([])
})

test('el expediente completo sigue accesible desde el cierre', async ({ page }) => {
  await page.goto('/')
  await page.locator('.rt-cierre').scrollIntoViewIfNeeded()
  await expect(page.getByRole('link', { name: 'Abrir el expediente completo' })).toHaveAttribute('href', '/_expediente')
})
