# Diseño — Horizonte

## Intención

Superficie `experience` con una capa `operate`: una persona explora decisiones habitacionales y ve sus consecuencias sin sentirse frente a un formulario financiero.

## Dirección

Rediseño `experience` con una ruta visual de selección y detalle: la escena 2.5D ocupa el ancho útil y debajo aparece un conjunto comparable de imágenes de vivienda. El selector visual para esta iteración asignó `Source Serif 4` + `Source Sans 3` + `Source Code Pro`, paleta carbón + lima + azul de apoyo, arquetipo de portada tipográfica con índice, geometría recta y motion seco de 120–160 ms. La referencia entregada por la persona usuaria fija además tres decisiones: imágenes grandes antes del texto, estado seleccionado inequívoco y detalle contextual dentro de la misma superficie.

## Usuarios y tarea

Personas en Perú que quieren comparar vivir con familia, alquilar, comprar terreno o iniciar una construcción progresiva. Tarea principal: seleccionar el punto de partida, probar una decisión y entender el cambio.

## Layout y componentes

`AppShell` contiene `Hud`, `HouseScene`, `ChoiceRail`, `Timeline`, `InsightStrip` y `StressTester`. La escena es el foco visual de ancho completo; `ChoiceRail` deja de ser un listado lateral y se convierte en un workbench: selector de imágenes de punto de partida, panel de detalle persistente y selector de acciones con imágenes. En móvil las imágenes se convierten en una cuadrícula táctil de dos columnas, el detalle queda inmediatamente debajo y el timeline conserva su scroll local.

## Tipografía, color y tokens

Los tokens completos están en `docs/04-DESIGN-SYSTEM.md` y `src/styles.css`: fondo blanco real, tinta carbón, superficies gris muy claro, lima para selección/avance, azul para soporte y naranja para decisiones de costo. No se usa Inter, Geist, Roboto ni `system-ui`; `Source Serif 4` da jerarquía narrativa y `Source Sans 3` conserva legibilidad en controles.

## Datos y gráficos

La visualización principal es una escena 2.5D y un timeline; los valores financieros se muestran con barras etiquetadas, no con un chart decorativo. Futuras comparaciones pueden usar ECharts solo si una serie temporal o composición aporta más que el timeline.

## Motion

El verbo es `transformar`: cuando la persona elige una acción, la escena revela una nueva capa y el timeline avanza. El fallback reducido elimina transformaciones y conserva estado, labels y color.

## Estados

Todos los controles tienen hover, active, focus-visible, disabled y selected. Cada imagen de vivienda expone su selección con borde, marca y texto auxiliar; el panel `Detalle de esta ruta` cambia en el mismo documento sin abrir una pantalla nueva. `La vida pasa` tiene estado apagado, activo y eventos seleccionables.

## Anti-patrones

No hay bento grid, gradiente morado/azul, radios grandes, glassmorphism, sidebar extensa, métricas inventadas ni controles esenciales dentro de una imagen.

## Desviación intencional

La imagen de referencia muestra una escena y selector en una composición muy ancha. El MVP conserva esa jerarquía, pero mantiene la escena 2.5D SVG existente para que sus capas sigan siendo interactivas y trazables; las nuevas imágenes de selector son assets locales livianos, sin texto incrustado, para que cada tarjeta tenga `alt` y pueda cambiarse desde Studio. Se evita una navegación profunda y se mantiene el detalle en línea porque así lo pide la experiencia y la especificación adjunta.
