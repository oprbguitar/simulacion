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
- Motion: tres resortes nombrados (`snap` para controles, `smooth` para escena y paneles, `soft` para datos) y una curva seca de 160 ms para color y foco. Escalonado de 45 ms por elemento. Sin movimiento ambiental en bucle: la única animación continua es el haz del control recomendado.

## Contenedor y rejilla

En escritorio `.sim-shell` ocupa `100dvh` con `overflow: hidden` y reparte cuatro bandas: header (68 px), escena (`1fr`), workbench (280 px) y timeline (116 px). El workbench divide decisiones y panel de contexto. En móvil la altura útil real (≈664 px) no permite esa composición con texto legible, así que el shell pasa a `height: auto` y se acepta un scroll corto: escena `clamp(180px, 30dvh, 260px)` y bandas de decisión en tamaño natural.

### Regla dura de legibilidad

Ningún texto de la superficie baja de **12 px**. Cuando falta alto, el orden de ajuste es: (1) ocultar microcopy secundaria, (2) desplazar dentro de un panel, (3) permitir scroll corto de documento en móvil. Reducir el cuerpo tipográfico no es una opción. La regla está cubierta por dos pruebas E2E: una mide el `font-size` computado de cada nodo de texto y otra verifica que escena, workbench y timeline no se superpongan.

## Componentes

- `HorizonHeader`: marca, periodo, ahorro, ingreso, reserva, patrimonio, historial y Studio.
- `LifeScene`: ilustración raster de casa peruana en corte, tarjeta de estado, costo del paso como rango, capas clicables y **foco de escena** que se desplaza a la zona correspondiente a la etapa.
- `DecisionDeck`: cuatro selectores visuales, acciones contextuales y, durante la obra, la decisión de vaciado del techo.
- `ContextPanel`: mecánica «¿Has pensado en esto?», tres acciones (`Continuar`, `Guardar reserva`, `Comparar`) e índice de resiliencia derivado de la reserva.
- `LifeTimeline`: hitos navegables con estado y el interruptor «Modo La vida pasa».
- `DetailSheet`: panel deslizante único para comparador, detalle de hito, imprevistos, explicación de la regla y vaciado del techo. Cierra con `Escape` y con clic fuera.

### Por qué el foco de escena

La ilustración es una sola pieza raster que ya contiene el arco completo (casa familiar, patio/terreno, cimientos y hogar futuro bajo tierra). En lugar de intercambiar imágenes o montar un 3D prematuro, cada decisión mueve un marco de foco con etiqueta sobre la zona correspondiente. Es el cambio visual que exige el bucle de gameplay, con coste gráfico casi nulo y coherente con la dirección editorial.

## Estrategia de imágenes e iconos

La escena principal es una ilustración raster generada para el proyecto, sin texto incrustado; etiquetas, estados y controles permanecen en HTML. Los selectores usan assets locales con `alt`. Los iconos son SVG de trazo uniforme y nunca sustituyen una etiqueta crítica.

## Estados y accesibilidad

Todos los botones definen default, hover, active, focus-visible, disabled y selected. La selección combina borde, marca y `aria-pressed`. Existe un solo `h1`; header, main, sections, aside y footer/timeline tienen semántica. Objetivos táctiles de 44 px en móvil, texto legible y `prefers-reduced-motion`.

## Responsive

- 1600/1280: composición horizontal completa.
- 768: escena más baja, preguntas y opciones compactas, resiliencia lateral.
- 360–760: cabecera de dos bandas, escena recortada, cuatro selectores en fila, acciones en carrusel horizontal, contexto compacto (la reserva vive en el HUD) y timeline desplazable. Se acepta un scroll corto de documento.
- Alturas reducidas: se oculta microcopy secundaria antes de reducir objetivos táctiles, eliminar funciones o achicar la letra.

## Anti-patrones

Sin hero de marketing, bento grid, tarjetas anidadas, degradado morado-azul, glassmorphism, radios gigantes, métricas inventadas, espacios muertos ni controles incrustados dentro de la imagen.

## Desviación intencional respecto del selector automático

`design-pick` asignó para este corte `Command bar + tabla maestra`, Public Sans/IBM Plex Mono y paleta petróleo + coral. Se conserva la dirección ya establecida del producto (workspace estratificado, Archivo + Public Sans + JetBrains Mono, arena + índigo) porque se trata de una corrección y completado de una superficie existente, no de un rediseño: cambiar tipografía y paleta rompería la continuidad con el Studio y con los assets ilustrados. Se respetan las restricciones transversales del selector: nada de hero + tres tarjetas, ninguna fuente prohibida, acento reservado para acción y estado, sin degradados ni glassmorphism.

## Otras desviaciones

El arquetipo automático `rail lateral + workspace` se reemplaza por un workspace estratificado: un rail restaría ancho a la escena y rompería la composición explícitamente solicitada. Se mantienen las demás restricciones del selector. La referencia muestra edad, puntos y ubicación; se omiten porque el simulador no dispone de esos datos. Se muestran únicamente periodo, ahorro, reserva y patrimonio calculados.

## Horizonte Studio 0.4

### Modo y dirección

El Studio es una superficie `operate` independiente. Usa el arquetipo asignado `split maestro-detalle`: rail de escenarios a la izquierda, preview y gráficos en el centro, inspector contextual a la derecha. Su lenguaje es técnico sin parecer un ERP: IBM Plex Sans/Mono, grafito, señal naranja y petróleo, radio de 4–6 px y densidad alta.

### Lectura y gráficos

El trabajo analítico es comparación/composición sobre datos deterministas. Tres figuras code-native permanecen visibles: flujo mensual (ingreso, compromisos y margen), posición patrimonial (liquidez frente a activo) y rango del paso simulado (económico, probable y conservador). Los valores tienen etiquetas directas, no dependen de hover y aclaran que son supuestos locales.

### Interacción y persistencia

Los escenarios controlan punto de partida y siguiente acción. El inspector muestra como máximo cinco campos a la vez mediante pestañas `Finanzas`, `Vivienda`, `Obra` y `Fuente`. Cada cambio actualiza preview y gráficos, se valida, se guarda en `localStorage` y pasa al simulador principal. Importar, exportar, deshacer, rehacer y restablecer se conservan.

### Responsive Studio

En escritorio el split completo ocupa `100dvh` sin scroll. A 768 px el rail se vuelve una barra superior y el inspector conserva ancho compacto. A 360 px se muestran pestañas de superficie `Escenario`, `Resultados` y `Datos`; solo una zona ocupa el cuerpo disponible, evitando scroll vertical y controles superpuestos. Los campos activos y acciones siguen disponibles por teclado y tacto.

## Capa de movimiento (0.6)

### Qué se anima y por qué

El movimiento no es decoración: cada animación explica un cambio de estado que antes había que deducir comparando cifras.

| Elemento | Movimiento | Qué comunica |
| --- | --- | --- |
| Indicadores del encabezado | contador con resorte + ficha de variación que sube y se retira sola | cuánto cambió con la última decisión, y en qué dirección |
| Reserva baja | sacudida horizontal de 2 px | el umbral de tres meses se cruzó |
| Foco de escena | viaja con resorte entre zonas | qué parte de la casa toca la decisión |
| Escena completa | onda única al cambiar de etapa | dónde mirar |
| Ilustración | parallax de 12 px con el puntero | profundidad del corte; sólo en puntero fino |
| Estado de la escena | intercambio vertical del título | la historia avanzó |
| Situaciones habitacionales | un subrayado compartido viaja entre las cuatro | cuál está elegida |
| Próximas decisiones | entran y salen con `popLayout` | el conjunto de opciones depende de la etapa |
| Sugerencia | barrido de color sobre el rótulo, dos ciclos | la sugerencia es nueva |
| Control recomendado | haz de borde continuo | por dónde se sigue |
| Resiliencia | relleno con resorte | el margen se movió |
| Línea de tiempo | hilo que crece sobre el riel + pulso en el hito en curso | cuánto se ha recorrido y dónde estás |
| Panel deslizante | entrada y salida con resorte | de dónde viene y a dónde vuelve |

### Arquitectura

`src/motion/tokens.ts` guarda resortes, curvas y variantes: ningún componente inventa un número de animación. `src/motion/primitives.tsx` contiene las primitivas (`AnimatedNumber`, `DeltaChip`, `TextSweep`, `BorderBeam`, `Ripple`), `src/motion/useParallax.ts` el hook de puntero y `src/motion.css` el soporte declarativo. La gramática está inspirada en motion-primitives y MagicUI, pero reescrita sobre `motion/react` con los tokens del producto: no se copió código ni se introdujo Tailwind.

### Accesibilidad del movimiento

`MotionConfig reducedMotion="user"` neutraliza transform y opacidad animadas cuando el sistema lo pide; las animaciones puramente CSS (haz, barrido, pulso) se apagan en el bloque `prefers-reduced-motion` de `motion.css`. `AnimatedNumber` escribe el texto desde el MotionValue, así que el primer render ya muestra la cifra final y ningún lector de pantalla lee un número en tránsito.

Un fallo detectado y corregido durante la implementación: la primera versión del barrido usaba `currentColor` dentro del propio degradado, que resolvía al `color: transparent` de la misma regla y dejaba el rótulo invisible. El color base va ahora explícito en `--sweep-base` y el degradado ocupa siempre el 100 % de la caja.

### Desviación respecto del selector automático

`design-pick` asignó para este corte motion **seco** (120–160 ms, sólo estado y foco). La petición explícita del usuario es una superficie «muy animada», así que se sube a movimiento con resorte y se conserva el resto de la asignación. La restricción que sí se respeta íntegra es la de propósito: no hay animación de entrada teatral, ni bucles ambientales, ni partículas, ni contenido que se mueva mientras se lee.
