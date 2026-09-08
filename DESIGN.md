# Diseño — Horizonte

## Intención

Superficie `experience` con una capa `operate`: una persona explora decisiones habitacionales y ve sus consecuencias sin sentirse frente a un formulario financiero.

## Dirección

Tablero de ruta editorial por bandas, escena 2.5D de vivienda/terreno, timeline accionable, tinta oscura, acero, verde eléctrico y separadores fuertes. El selector visual asignó `Space Grotesk` + `Noto Sans` + `Space Mono`, paleta acero + verde eléctrico, geometría de bloque y motion mínimo.

## Usuarios y tarea

Personas en Perú que quieren comparar vivir con familia, alquilar, comprar terreno o iniciar una construcción progresiva. Tarea principal: seleccionar el punto de partida, probar una decisión y entender el cambio.

## Layout y componentes

`AppShell` contiene `Hud`, `HouseScene`, `ChoiceRail`, `Timeline`, `InsightStrip` y `StressTester`. La escena permanece cerca del inicio; en móvil aparece antes del rail de decisiones y el timeline conserva su scroll local.

## Tipografía, color y tokens

Los tokens completos están en `docs/04-DESIGN-SYSTEM.md` y `src/styles.css`. No se usa Inter, Geist, Roboto ni `system-ui`.

## Datos y gráficos

La visualización principal es una escena 2.5D y un timeline; los valores financieros se muestran con barras etiquetadas, no con un chart decorativo. Futuras comparaciones pueden usar ECharts solo si una serie temporal o composición aporta más que el timeline.

## Motion

El verbo es `transformar`: cuando la persona elige una acción, la escena revela una nueva capa y el timeline avanza. El fallback reducido elimina transformaciones y conserva estado, labels y color.

## Estados

Todos los controles tienen hover, active, focus-visible, disabled y selected. `La vida pasa` tiene estado apagado, activo y eventos seleccionables.

## Anti-patrones

No hay bento grid, gradiente morado/azul, radios grandes, glassmorphism, sidebar extensa, métricas inventadas ni controles esenciales dentro de una imagen.

## Desviación intencional

El concepto generado incluye una marca y algunos métricos visuales; la implementación los reduce a un nombre de trabajo y cuatro valores de dominio (ahorro, ingreso, reserva y patrimonio) para no inventar datos ajenos al MVP.
