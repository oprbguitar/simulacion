import { expect, test, type Page } from '@playwright/test'

/** La Ruta avanza en horizontal: se llega a cada pantalla desde la línea de tiempo. */
async function irA(page: Page, titulo: string) {
  await page.locator('.rt-linea button', { hasText: titulo }).click()
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()
})

test('la portada pide el nombre y abre el juego con su marcador', async ({ page }) => {
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Acabas de llegar')
  await expect(page.getByLabel('¿Cómo te llamas?')).toBeVisible()
  await expect(page.locator('.rt-hud')).toContainText('Patrimonio al final')
  await expect(page.locator('.rt-linea li')).toHaveCount(10)
})

test('el nombre acompaña la ruta y empezar lleva a la primera decisión', async ({ page }) => {
  await page.getByLabel('¿Cómo te llamas?').fill('Rosa')
  await page.getByRole('button', { name: 'Empezar la ruta', exact: true }).click()
  await expect(page.locator('#partida')).toContainText('¿Quién eres al empezar?')
  await expect(page.locator('.rt-hud-marca')).toContainText('de Rosa')
  await expect(page.locator('.rt-linea li').nth(1)).toHaveClass(/es-actual/)
})

test('las flechas avanzan y regresan una pantalla a la vez', async ({ page }) => {
  await page.getByRole('button', { name: 'Avanzar a Partida' }).click()
  await expect(page.locator('#partida')).toBeVisible()
  await page.getByRole('button', { name: 'Avanzar a Vivienda' }).click()
  await expect(page.locator('#terreno')).toContainText('¿Dónde vas a vivir?')
  await expect(page.locator('#partida')).toHaveCount(0)
  await page.getByRole('button', { name: 'Regresar a Partida' }).click()
  await expect(page.locator('#partida')).toBeVisible()
})

test('las ocho pantallas de decisión están y traen su título', async ({ page }) => {
  for (const [paso, id, titulo] of [
    ['Partida', 'partida', '¿Quién eres al empezar?'],
    ['Vivienda', 'terreno', '¿Dónde vas a vivir?'],
    ['Obra', 'obra', 'Construir de a pocos'],
    ['Familia', 'familia', '¿Y si tienes hijos?'],
    ['Servicios', 'servicios', 'La casa también cobra todos los meses'],
    ['Trabajo', 'trabajo', '¿De qué vives?'],
    ['Imprevistos', 'cartas', 'Y entonces la vida se mete'],
    ['Tu ruta', 'mapa', 'Tu ruta, año por año'],
  ] as const) {
    await irA(page, paso)
    await expect(page.locator(`#${id}`)).toContainText(titulo)
  }
})

test('elegir un punto de partida cambia el marcador y sombrea la línea de tiempo', async ({ page }) => {
  await irA(page, 'Partida')
  const patrimonio = page.locator('.rt-hud-marcador > div').nth(2)
  const antes = await patrimonio.innerText()
  await page.getByRole('button', { name: /Recién empiezo/ }).click()
  await expect(page.getByRole('button', { name: /Recién empiezo/ })).toHaveAttribute('aria-pressed', 'true')
  await expect(patrimonio).not.toHaveText(antes)
  await expect(page.locator('.rt-linea li').nth(1)).toHaveClass(/es-hecho/)
})

test('un modo de juego completa todas las fases de golpe', async ({ page }) => {
  await page.getByRole('radio', { name: 'Pro' }).click()
  await expect(page.getByRole('radio', { name: 'Pro' })).toHaveAttribute('aria-checked', 'true')
  await expect(page.locator('.rt-linea li.es-hecho')).toHaveCount(10)
})

test('la palanca de años reparte el costo de la obra', async ({ page }) => {
  await irA(page, 'Obra')
  const palanca = page.getByLabel('¿En cuántos años la construyes?')
  await palanca.fill('4')
  const cuatro = await page.locator('#obra .rt-ficha').nth(2).innerText()
  await palanca.fill('16')
  const dieciseis = await page.locator('#obra .rt-ficha').nth(2).innerText()
  expect(cuatro).not.toEqual(dieciseis)
})

test('el tablero de vacunas muestra el esquema y explica cada una', async ({ page }) => {
  await irA(page, 'Familia')
  const tablero = page.locator('.rt-vacunas')
  await expect(tablero.locator('.rt-vacuna')).toHaveCount(29)
  await tablero.getByRole('button', { name: /Nirsevimab/ }).click()
  await expect(page.locator('.rt-vacuna-detalle')).toContainText('Virus Respiratorio Sincitial')
  await expect(page.locator('.rt-vacuna-detalle')).toContainText('S/ 0')
})

test('voltear una carta de imprevisto cambia el resultado', async ({ page }) => {
  await irA(page, 'Imprevistos')
  const carta = page.locator('.rt-naipe', { hasText: 'Pérdida del empleo' })
  await carta.click()
  await expect(carta).toHaveClass(/es-volteado/)
  await expect(page.locator('#cartas .rt-consecuencia')).toContainText('carta encima')
})

test('el mapa deja caminar la ruta año por año', async ({ page }) => {
  await irA(page, 'Tu ruta')
  await expect(page.locator('.rt-anio')).toContainText('Año 0')
  await page.locator('.rt-casilla').nth(14).click()
  await expect(page.locator('.rt-anio')).toContainText('Año 14')
})

test('el cajón muestra el detalle como lista plegable y se cierra con Escape', async ({ page }) => {
  await irA(page, 'Vivienda')
  await page.getByRole('button', { name: /trámites, requisitos y enlaces oficiales/ }).click()
  const cajon = page.getByRole('dialog', { name: 'Adquirir la propiedad' })
  await expect(cajon).toBeVisible()
  const tramites = cajon.locator('details.ex-plegable', { hasText: 'Los trámites, en orden' })
  await expect(tramites).not.toHaveAttribute('open', '')
  await tramites.locator('summary').click()
  await expect(tramites).toHaveAttribute('open', '')
  await expect(cajon.getByRole('link', { name: /SUNARP/ }).first()).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(cajon).toBeHidden()
})

test('deshacer devuelve la decisión anterior', async ({ page }) => {
  await irA(page, 'Obra')
  await page.getByRole('button', { name: /Alto Porcelanato/ }).click()
  const costo = page.locator('#obra .rt-ficha').first()
  const conAlto = await costo.innerText()
  await page.getByRole('button', { name: 'Deshacer la última decisión' }).click()
  await expect(costo).not.toHaveText(conAlto)
})

test('no desborda en horizontal ni baja de 12 px', async ({ page }) => {
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

test('el final descarga el expediente con el nombre y las elecciones', async ({ page }) => {
  await page.getByLabel('¿Cómo te llamas?').fill('Rosa Quispe')
  await irA(page, 'Final')
  const [descarga] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Descargar mi expediente completo' }).click(),
  ])
  expect(descarga.suggestedFilename()).toMatch(/^expediente-rosa-quispe-\d{4}-\d{2}-\d{2}\.html$/)
  const ruta = await descarga.path()
  const { readFile } = await import('node:fs/promises')
  const html = await readFile(ruta, 'utf8')
  expect(html).toContain('La ruta de Rosa Quispe')
  expect(html).toContain('Lo que elegiste')
})
