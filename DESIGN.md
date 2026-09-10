# Diseño — Horizonte

Tres superficies con direcciones visuales distintas y deliberadas, sobre el mismo
motor y el mismo catálogo:

- **A. La Ruta** (`/`) — el recorrido jugable. Bandas a sangre, acero + verde
  eléctrico, Work Sans / Manrope.
- **B. El expediente** (`/_expediente`) — el documento. Índice fijo, carbon +
  lima, Archivo / Public Sans.
- **C. El simulador de una pantalla** (`/_legacy`) — conservado con su dirección
  original.

No comparten sistema a propósito: una se recorre, otra se consulta y la tercera se
opera. El detalle completo de A está en [`docs/18-LA-RUTA.md`](docs/18-LA-RUTA.md).

---

# A. La Ruta (`/`)

## Modo e intención

Superficie `experience`. El público objetivo son adolescentes de 14 a 16 años y
la tarea no es consultar: es **recorrer y probar**. Se decide con cartas grandes,
la consecuencia se ve al instante en el marcador y el detalle denso se guarda en
cajones.

## Dirección visual

**Bandas a sangre contrastadas.** Cada capítulo de la vida es una franja de ancho
completo con su propio color, su ilustración y una sola decisión. Nada de hero +
tres tarjetas.

Se consideraron tres estructuras antes de elegir:

1. **Tablero de casillas tipo juego de mesa** (avanzar de casilla en casilla).
   Descartada: obliga a una progresión lineal y a esconder lo que no toca, y aquí
   el valor está en poder volver y comparar.
2. **Asistente a pantalla completa, una decisión por pantalla.** Descartada por lo
   mismo, y porque en móvil se convierte en un cuestionario.
3. **Bandas a sangre.** Elegida: cada capítulo se lee de un vistazo, el scroll da
   la sensación de recorrido, y el color de banda funciona como señalización de en
   qué parte de la vida estás.

## Tokens

- **Color.** Tinta `#161A1D`, superficie `#F2F4F5`, blanco `#FFFFFF`, línea
  `#D3D9DC`. Acento verde `#2F9E44` (con `#51CF66` para fondos oscuros),
  apoyo azul `#1971C2`, alarma `#D63939`, ámbar `#C07A00`.
- **Colores de capítulo.** Noche `#12181D`, océano `#10314F`, selva
  `#123524`, tierra `#43210F`, ocre `#3D2F08`. **Son señalización, no
  adorno**: el acento verde nunca se usa como fondo grande.
- **Tipografía.** Work Sans 800/900 para títulos y cifras; Manrope para el cuerpo.
- **Espacio.** 4, 8, 12, 16, 24, 32, 48, 72 y 104 px.
- **Forma.** Radio 2 px. Bordes de 1 y 2 px. El estado elegido se marca con borde
  del acento más un filete interno, no con sombra.
- **Motion.** 220 ms con `cubic-bezier(.2,0,0,1)`, transformaciones de posición
  para dar continuidad espacial. Contadores de resorte en el marcador. Todo se
  apaga con `prefers-reduced-motion`.

## Reglas de la superficie

1. Una decisión grande por banda.
2. Tres cifras visibles por banda; el resto, en el cajón.
3. La consecuencia de cada decisión aparece escrita, no solo numérica.
4. Nada del expediente se duplica: los cajones montan sus secciones tal cual.
5. Piso tipográfico de 12 px, verificado por prueba automatizada.

## Dos trampas que costó encontrar

- **`overflow-x: clip` en el contenedor rompe `position: sticky`.** Un
  ancestro con overflow recortado se convierte en el contenedor de desplazamiento
  del elemento pegajoso, así que el marcador se quedaba pegado al tope del
  documento en vez de al de la ventana.
- **Las entradas por scroll dejan contenido invisible** cuando el bloque es más
  alto que la pantalla: la pieza está dentro de la banda visible pero nunca cruza
  el umbral. Se dispara 200 px antes de asomar.

---

# B. Expediente de vida (`/_expediente`)

## Modo e intención

Superficie `redesign`. La tarea no es operar un panel: es **leer y comprobar**. La
persona ajusta su punto de partida y luego recorre un documento denso donde cada
cifra se puede rastrear hasta la entidad que la publica. El éxito no es que la
pantalla se vea bien, es que alguien pueda hacer clic y verificar el número.

## Dirección visual

**Índice fijo + documento.** Un índice persistente a la izquierda con las nueve
secciones numeradas y el estado del plan siempre visible; a la derecha, el
documento. La tipografía es la estructura: números de sección grandes en el acento,
jerarquía por peso y línea, ningún adorno que no informe.

Se consideraron tres estructuras antes de elegir:

1. **Tablero de pistas paralelas** (una fila por dominio a lo largo de 30 años).
   Descartada: el contenido no es principalmente temporal, es documental; obligaba
   a esconder el detalle en tarjetas y el detalle es el producto.
2. **Asistente por pasos** (una decisión por pantalla). Descartada: impide comparar
   y volver, que es exactamente lo que se necesita cuando el gasto de un módulo
   depende del de otro.
3. **Índice fijo + documento.** Elegida: permite densidad alta sin perder la
   ubicación, se imprime bien, y el índice funciona como resumen ejecutivo
   permanente del estado del plan.

## Tokens

- **Color.** Tinta `#191B18`, tinta media `#4A504A`, tinta suave `#767D75`;
  papel `#F6F7F3`, papel elevado `#FDFDFB`, papel hundido `#ECEFE6`; línea
  `#D5DACD` y línea fuerte `#A8B09E`; acento lima `#74B816` con su oscuro
  `#4D7C0C` y su tenue `#EEF7E0`; apoyo azul `#4263EB`; alarma `#C0392B`;
  ámbar `#A86A00`.
  **El acento marca cifra, estado y acción. Nunca es fondo decorativo grande.**
- **Tipografía.** Archivo para marca, títulos y controles; Public Sans para el
  cuerpo; JetBrains Mono para cifras, códigos de regla y etiquetas de metadato.
  El monoespaciado nunca se usa para texto corrido.
- **Espacio.** Escala 4, 8, 12, 16, 24, 32, 48 y 72 px.
- **Forma.** Radio 4 px, 6 px como máximo. Bordes de 1 px. Los estados se marcan
  con un filete interno de 3 px del color correspondiente, no con sombra.
- **Motion.** Seco: 140 ms, `cubic-bezier(.2,0,.2,1)`, solo para estado y foco.
  Nada ambiental. Se desactiva por completo con `prefers-reduced-motion`.

## Los cinco colores de origen

Cada cifra lleva una insignia que dice de dónde viene, y el color no es decorativo:

| Origen | Color | Lectura |
| --- | --- | --- |
| `OFICIAL` | lima | Publicado por el Estado. Es la referencia. |
| `REGULADO` | azul | Fijado o supervisado por un regulador. |
| `MERCADO` | ámbar | Precio observado. Cambia rápido: verificar. |
| `TECNICO` | gris | Constante de ingeniería. Estable. |
| `ESTIMADO` | alarma | Supuesto del simulador. El dato más débil. |

Que `ESTIMADO` comparta color con la alarma es intencional: es el número que hay
que mirar con más desconfianza y no debe pasar desapercibido.

## Regla dura de legibilidad

**12 px es el piso absoluto.** Cuando falta espacio se recorta microcopy o se
permite scroll, nunca se reduce la letra. Hay una prueba de extremo a extremo que
recorre todos los nodos de texto de la superficie y falla si alguno queda por
debajo. La primera versión de esta hoja tenía etiquetas de metadato en 10 px; la
prueba las detectó y todas subieron a 12 px.

## Contenedor y rejilla

`.ex-shell` es una rejilla de dos columnas: índice de 268 px (300 px desde
1600 px) y documento de hasta 1080 px (1240 px desde 1600 px). El índice es
`position: sticky` a altura completa con tres filas: marca, navegación scrollable
y estado del plan.

**Responsive.**

- **≥ 1280 px**: dos columnas, documento a ancho cómodo.
- **900–1279 px**: dos columnas con menos aire lateral.
- **< 900 px**: el índice se convierte en una barra superior pegajosa con un botón
  `Índice` que despliega la navegación y el estado; el documento ocupa todo.
- **< 640 px**: las fichas de fuente se apilan (el enlace y su fecha dejan de
  competir por el ancho) y las rejillas de datos pasan a una columna.
- **< 560 px**: la cabecera de sección apila número y título, y el costo de cada
  fase de obra baja a su propia línea.

Las tablas anchas viven dentro de `.ex-tabla-envoltura` con `overflow-x: auto`:
la tabla se desplaza dentro de su caja y la página nunca lo hace.

### Dos trampas de ancho que costó encontrar

- Un `<fieldset>` no baja de la anchura mínima de su contenido, y un `<select>`
  mide lo que su opción más larga. Sin `min-width: 0` en el fieldset y en los
  controles, el formulario del punto de partida empujaba todo el documento.
- La ficha de fuente tiene la fecha de verificación en `white-space: nowrap`. En
  pantallas estrechas eso forzaba un ancho mínimo mayor que el viewport; por
  debajo de 640 px la ficha se apila y la fecha vuelve a poder romper línea.

## Estados

Definidos para todo control interactivo: reposo, hover (fondo lima tenue o papel
hundido), active (fondo línea), `focus-visible` (contorno azul de 2 px con
desplazamiento de 2 px), seleccionado (filete interno de 3 px + fondo tenue) y
deshabilitado (opacidad 0.45 + cursor `not-allowed`).

## Impresión

El índice desaparece, el shell pasa a una columna y las fases de obra se despliegan
todas. El expediente está pensado para poder llevarse impreso a una notaría o a una
municipalidad.

---

# C. Simulador de una pantalla (`/_legacy`)

## Modo e intención (superficie heredada)

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
