# Inventario de assets

## Assets existentes

| Asset | Uso | Proveniencia | Producción |
| --- | --- | --- | --- |
| `referencias/img/*.png` (16 archivos) | referencias visuales de producto | proporcionados en el repositorio | no se cargan en la app |

## Concepts generados

| Asset | Propósito | Brief | Dimensión | Ubicación | Fecha |
| --- | --- | --- | --- | --- | --- |
| `docs/design/concepts/concept-a-ruta-posible.png` | comparar primera dirección | pantalla jugable con HUD, escena y móvil | generada por Image Gen | repo | 2026-09-07 |
| `docs/design/concepts/concept-b-camino.png` | comparar dirección de ruta | escena territorial y timeline | generada por Image Gen | repo | 2026-09-07 |
| `docs/design/concepts/concept-c-horizonte.png` | concepto seleccionado | corte 2.5D, bandas, decisiones y móvil | generada por Image Gen | repo | 2026-09-07 |

## Assets de producto

La escena actual combina una ilustración raster local con etiquetas y capas code-native en `src/components/LifeScene.tsx`. El selector visual usa seis PNG locales generados con Image Gen y sin texto incrustado:

| Asset | Uso | Alt / estado | Ubicación |
| --- | --- | --- | --- |
| `path-family.webp` | punto de partida familiar y acción de continuidad | familia en una vivienda | `public/assets/` |
| `path-renting.webp` | punto de partida alquilando y acción de alquiler | edificio de departamentos | `public/assets/` |
| `path-land.webp` | punto de partida terreno y acción de compra | terreno delimitado | `public/assets/` |
| `path-none.webp` | punto de partida sin propiedad | futura vivienda por elegir | `public/assets/` |
| `action-save.webp` | acción de ahorro | frasco con monedas y brote | `public/assets/` |
| `action-build.webp` | acción de construcción | muros sobre losa de cimentación | `public/assets/` |
| `horizonte-life-scene-v1.webp` | escena principal one-page | casa familiar peruana en corte, terreno, cimientos y hogar futuro | `public/assets/` |

El contenido textual permanece en React para lectura asistida, selección por teclado y edición futura desde Studio. La escena principal fue generada con la herramienta Image Gen integrada a partir de la composición de referencia entregada por el usuario; la referencia se usó solo como guía visual y no se incrustó en el producto.

## Formato publicado (0.6)

Las siete ilustraciones se sirven en WebP. Las fuentes PNG (12,5 MB en total) quedan fuera del árbol publicado, en `assets-src/`, ignorada por git y recuperable del historial hasta `c47db07`. La conversión es reproducible con `node scripts/optimize-assets.mjs`: escena a 1920 px de ancho, selectores a 420 px, calidad 82.

| Archivo | Antes | Después |
| --- | --- | --- |
| `horizonte-life-scene-v1` | 2 475 kB | 250 kB |
| `action-save` | 1 518 kB | 39 kB |
| `path-family` | 1 944 kB | 26 kB |
| `path-land` | 1 734 kB | 26 kB |
| `path-none` | 1 585 kB | 20 kB |
| `path-renting` | 1 808 kB | 18 kB |
| `action-build` | 1 471 kB | 17 kB |
| **Total** | **12 535 kB** | **395 kB** |

`public/og-horizonte.jpg` (1200×630, 166 kB) es la tarjeta social; va en JPEG porque varios lectores de enlaces no resuelven WebP.
