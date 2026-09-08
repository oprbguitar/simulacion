# Diseño — Horizonte one-page

## Modo e intención

Superficie `operate` con narrativa visual. La tarea principal es elegir una situación habitacional, probar una decisión y leer su efecto económico y temporal sin abandonar la pantalla ni desplazarse verticalmente.

## Dirección visual

`Workspace estratificado`: cabecera de indicadores reales, escena ilustrada dominante, dos bandas de decisión y línea de tiempo inferior. La referencia de usuario fija la composición horizontal, el uso de imágenes y el carácter editorial peruano. El selector Pierre aporta densidad alta, tipografía Archivo + Public Sans, paleta arena + índigo profundo, geometría de 4–6 px y movimiento breve.

Se consideraron tres estructuras: rail lateral + canvas, canvas con inspector y workspace estratificado. Se elige la tercera porque mantiene simultáneamente escena, decisiones, resiliencia y tiempo, y puede comprimirse de forma controlada en una sola altura.

## Usuarios y tareas

Personas en Perú que quieren explorar decisiones de vivienda y construcción progresiva. Deben poder: cambiar su punto de partida, simular ahorro/terreno/alquiler/construcción, entender el estado de la escena, activar eventos de estrés, recorrer hitos y deshacer o rehacer.

## Tokens

- Color: tinta `#1B1B2F`, tinta suave `#56566B`, blanco `#FFFFFF`, arena `#F8F5EF`, línea `#D7D2C8`, índigo `#3B5BDB`, tierra `#B5651D`, verde `#247A3D`, ámbar `#E78319`, peligro `#B83A2F`.
- Tipografía: Archivo para marca, títulos y controles; Public Sans para contenido; JetBrains Mono para datos cortos.
- Espacio: escala 4, 8, 12, 16, 24 y 32 px; el layout usa proporciones de grid y `clamp()` para adaptarse a la altura.
- Forma: radio 4 o 6 px; bordes de 1 px; sombra únicamente sobre controles flotantes.
- Motion: 140–220 ms para selección y cambio de escena; escalonado inicial de 40 ms por opción; sin movimiento ambiental.

## Contenedor y rejilla

`html`, `body`, `#root` y `.sim-shell` ocupan `100dvh`; la página usa `overflow: hidden`. En escritorio: header, escena, workbench y timeline. El workbench reparte decisiones y panel de resiliencia. En móvil: header compacto, escena, selectores de imagen, acciones, resiliencia y timeline; el texto secundario se reduce, nunca las funciones.

## Componentes

- `HorizonHeader`: marca, periodo, ahorro, reserva, patrimonio, historial y Studio.
- `LifeScene`: ilustración raster de casa peruana en corte, estado y capas clicables.
- `DecisionDeck`: cuatro selectores visuales y acciones contextuales.
- `ResiliencePanel`: indicador derivado de meses de reserva, señales reales y eventos de estrés.
- `LifeTimeline`: hitos navegables con estado actual, completado, planificado o en riesgo.

## Estrategia de imágenes e iconos

La escena principal es una ilustración raster generada para el proyecto, sin texto incrustado; etiquetas, estados y controles permanecen en HTML. Los selectores usan assets locales con `alt`. Los iconos son SVG de trazo uniforme y nunca sustituyen una etiqueta crítica.

## Estados y accesibilidad

Todos los botones definen default, hover, active, focus-visible, disabled y selected. La selección combina borde, marca y `aria-pressed`. Existe un solo `h1`; header, main, sections, aside y footer/timeline tienen semántica. Objetivos táctiles de 44 px en móvil, texto legible y `prefers-reduced-motion`.

## Responsive

- 1600/1280: composición horizontal completa.
- 768: escena más baja, preguntas y opciones compactas, resiliencia lateral.
- 360: cabecera de dos bandas, escena recortada, cuatro selectores en fila, dos acciones y timeline comprimido. Sin scroll de documento.
- Alturas reducidas: se oculta microcopy secundaria antes de reducir objetivos táctiles o eliminar funciones.

## Anti-patrones

Sin hero de marketing, bento grid, tarjetas anidadas, degradado morado-azul, glassmorphism, radios gigantes, métricas inventadas, espacios muertos ni controles incrustados dentro de la imagen.

## Desviación intencional

El arquetipo automático `rail lateral + workspace` se reemplaza por un workspace estratificado: un rail restaría ancho a la escena y rompería la composición explícitamente solicitada. Se mantienen las demás restricciones del selector. La referencia muestra edad, puntos y ubicación; se omiten porque el simulador no dispone de esos datos. Se muestran únicamente periodo, ahorro, reserva y patrimonio calculados.
