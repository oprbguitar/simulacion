# Sistema de diseño — Horizonte 0.3

## Lenguaje

Horizonte usa un `workspace estratificado`: cada franja corresponde a una parte del modelo mental —situación, hogar, decisión, resiliencia y tiempo— y todas permanecen visibles en un solo viewport. La escena es protagonista; las tarjetas solo aparecen donde existen opciones comparables.

## Tokens

```css
--sim-ink: #1B1B2F;
--sim-ink-soft: #56566B;
--sim-paper: #FFFFFF;
--sim-sand: #F8F5EF;
--sim-line: #D7D2C8;
--sim-indigo: #3B5BDB;
--sim-earth: #B5651D;
--sim-green: #247A3D;
--sim-orange: #E78319;
--sim-red: #B83A2F;
--font-display: "Archivo", Arial, sans-serif;
--font-body: "Public Sans", Arial, sans-serif;
--font-data: "JetBrains Mono", Consolas, monospace;
--space: 4px 8px 12px 16px 24px 32px;
--radius: 4px;
--radius-large: 6px;
--motion-fast: 140ms;
--motion-medium: 220ms;
```

## Componentes

- `HorizonHeader`: marca y cuatro datos calculados; a 1050 px oculta patrimonio y en móvil conserva periodo, ahorro y reserva.
- `LifeScene`: raster sin texto, estado en vivo y cuatro labels interactivos. En móvil los labels se convierten en puntos táctiles con nombre accesible.
- `DecisionDeck`: cuatro caminos visuales y dos decisiones contextuales; borde, check y `aria-pressed` comunican selección.
- `ResiliencePanel`: porcentaje derivado de `reserveMonths / 9`, tres señales del escenario y dos pruebas de estrés.
- `LifeTimeline`: seis hitos clicables; su estado se comunica mediante color, posición y selección.

## Responsive y altura

La superficie usa `height: 100dvh` y `overflow: hidden`; no existe scroll del documento. Las filas se distribuyen con CSS Grid y `minmax()`. Hay compactación adicional por anchura (`1050`, `700`) y por altura (`760`, `700`). Los puntos de control son 360, 768, 1280 y 1600 px.

## Accesibilidad y movimiento

Un solo `h1` describe la aplicación. Los grupos de opciones tienen etiquetas, las imágenes tienen `alt`, todos los controles conservan foco visible y los estados no dependen solo del color. `prefers-reduced-motion` reduce animaciones y transiciones a una duración imperceptible.
