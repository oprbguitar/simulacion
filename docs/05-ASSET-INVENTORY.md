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
| `path-family.png` | punto de partida familiar y acción de continuidad | familia en una vivienda | `public/assets/` |
| `path-renting.png` | punto de partida alquilando y acción de alquiler | edificio de departamentos | `public/assets/` |
| `path-land.png` | punto de partida terreno y acción de compra | terreno delimitado | `public/assets/` |
| `path-none.png` | punto de partida sin propiedad | futura vivienda por elegir | `public/assets/` |
| `action-save.png` | acción de ahorro | frasco con monedas y brote | `public/assets/` |
| `action-build.png` | acción de construcción | muros sobre losa de cimentación | `public/assets/` |
| `horizonte-life-scene-v1.png` | escena principal one-page | casa familiar peruana en corte, terreno, cimientos y hogar futuro | `public/assets/` |

El contenido textual permanece en React para lectura asistida, selección por teclado y edición futura desde Studio. La escena principal fue generada con la herramienta Image Gen integrada a partir de la composición de referencia entregada por el usuario; la referencia se usó solo como guía visual y no se incrustó en el producto.
