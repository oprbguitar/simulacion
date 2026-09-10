# Changelog

## [0.8.0] — 2026-09-09

La misma información, jugable. El expediente era correcto y aburrido para su público; ahora hay una superficie que se recorre y otra que se consulta, sobre el mismo motor.

### Added

- **«La Ruta» (`/`)**, superficie jugable de ocho bandas a sangre, una decisión grande por banda y consecuencia inmediata en el marcador;
- **marcador pegajoso** con contadores de resorte, ficha de variación al cambiar una decisión, deshacer y reiniciar;
- **portada** con la escena en corte a sangre y parallax de puntero;
- **tres arranques** («recién empiezo», «como la mayoría», «me va bien») que sustituyen al formulario de ocho campos, que pasa a un cajón;
- **palanca de años de obra**: mover el plazo reparte el costo y muestra cuánto habría que juntar al mes;
- **tira de diez etapas de obra** desplegable, con su participación en el costo y el año en que caería;
- **cantidades de material como fichas de inventario** en vez de filas de tabla;
- **tablero de vacunas**: las 29 aplicaciones del Esquema Nacional agrupadas por tramo de edad, cada una explica de qué protege y cuánto costaría fuera del Estado;
- **fichas de régimen laboral** con tres barras comparables —red que te sostiene, libertad para moverte, hasta dónde puede crecer— declaradas como lectura editorial, no como métrica calculada;
- **naipes de imprevisto** que se voltean y golpean la proyección, con la vía institucional para responder;
- **mapa de la ruta**: una casilla por año, hitos con glifo, ficha que camina con `layoutId` y desglose del año seleccionado;
- **cajones laterales** que montan las secciones del expediente sin duplicar contenido: tablas, trámites, requisitos y las 42 fuentes siguen a un clic;
- `docs/18-LA-RUTA.md` y 11 pruebas de extremo a extremo nuevas en escritorio y móvil.

### Changed

- el expediente pasa de `/` a `/_expediente` y se enlaza desde el cierre de La Ruta;
- `expediente.css` se parte en dos: los tokens y la tipografía pasan a un selector compartido con `.rt-cajon-cuerpo`, y la rejilla de dos columnas se queda solo en `.ex-shell`, para que las secciones funcionen dentro de un cajón;
- las siete ilustraciones de acuarela vuelven a usarse: portada, cartas de vivienda, arranques y cabeceras de banda.

### Fixed

- `overflow-x: clip` en el contenedor rompía el marcador pegajoso: un ancestro con overflow recortado se convierte en el contenedor de desplazamiento de `position: sticky`;
- las piezas que entran al hacer scroll quedaban invisibles cuando el bloque era más alto que la pantalla; ahora se disparan 200 px antes de asomar;
- el ancla de banda quedaba debajo del marcador pegajoso: `scroll-margin-top` le deja sitio;
- «120 m²» y «160 m²» compartían la misma descripción;
- en pantalla chica el marcador se cortaba a media palabra: por debajo de 820 px suelta el horizonte y por debajo de 560 px también el costo de obra.

## [0.7.0] — 2026-09-09

Reescritura del producto: de un simulador de una pantalla con cifras sembradas a un expediente de vida con datos verificables.

### Added

- **capa de datos `src/domain/life/`** con siete módulos de catálogo —vivienda, construcción, servicios, familia, educación, trabajo e imprevistos— donde cada cifra declara su origen y sus fuentes;
- **registro único de fuentes** (`fuentes.ts`) con 42 direcciones de entidades peruanas, todas comprobadas con una petición real el 2026-09-09; la que no respondió 200 no entró;
- **catálogo de construcción**: diez fases de obra con su participación en el costo, metrados por unidad de obra, dosificaciones de concreto por resistencia, precios unitarios de material con enlace para verificarlos, y los trámites de licencia (Modalidad A y B) y declaratoria de fábrica con sus requisitos;
- **cálculo de materiales para el área que pone la persona**: bolsas de cemento, m³ de arena y piedra, kg de acero y unidades de ladrillo, con subtotal en rango;
- **Esquema Nacional de Inmunizaciones del MINSA transcrito completo** (29 aplicaciones pediátricas más las de la gestante), gratuito en el Estado y con referencia de costo privado al costado, más el calendario CRED;
- **educación de inicial a superior** con pensión pública y privada, gastos asociados y el costo total de escolarizar a un hijo;
- **cinco modos de ingreso** con sus cargas, beneficios y riesgos, los tramos del impuesto a la renta de trabajo y los aportes previsionales;
- **ocho imprevistos activables**, cada uno con su impacto y la vía institucional para responder;
- **motor de proyección determinista a 10 / 20 / 30 años** (`motor.ts`) con amortización mensual del crédito dentro del paso anual, obra por etapas, hijos, educación e imprevistos, y diagnósticos con identificador y palanca;
- **nueva superficie `/`**: índice fijo persistente más documento de ocho secciones numeradas, con paleta carbon + lima y tipografía Archivo / Public Sans / JetBrains Mono;
- 40 pruebas de unidad sobre motor y catálogo, y 10 de extremo a extremo sobre el expediente en escritorio y móvil;
- `docs/17-EXPEDIENTE-DE-VIDA.md`, y reescritura de `docs/08-DATA-SOURCES.md` como registro verificado.

### Changed

- el simulador de una pantalla se conserva en `/_legacy`; el Studio sigue editando sus supuestos y ahora enlaza allí;
- `docs/08-DATA-SOURCES.md` deja de decir «no hay fuentes externas conectadas».

### Fixed

- **el desembolso de la compra se descontaba dos veces del ahorro**: entraba por el flujo del año y además se restaba directamente del acumulado;
- **la preparación preuniversitaria se cobraba los cinco años de secundaria** en vez de uno o dos; pasa a ser un ítem aparte;
- **los servicios del hogar se cobraban desde el año cero** aunque todavía no hubiera dónde habitar; ahora empiezan cuando la casa es habitable o cuando se alquila, y hasta entonces el hogar paga alojamiento;
- microcopy y etiquetas por debajo de 12 px en la nueva superficie, contra la regla del proyecto;
- desborde horizontal en móvil causado por el ancho mínimo intrínseco de `<fieldset>` y `<select>`, y por la ficha de fuente con la fecha en `nowrap`.

## [0.6.0] — 2026-09-09

### Added

- **capa de movimiento** sobre `motion/react`, con tokens propios en `src/motion/tokens.ts` y primitivas en `src/motion/primitives.tsx`: contadores con resorte, fichas de variación, barrido de sugerencia, haz de borde, onda de cambio de etapa y parallax de puntero;
- indicadores del encabezado que muestran cuánto cambió el ahorro y el patrimonio con la última decisión, calculado desde el historial del dominio y no desde un render previo;
- foco de escena, opciones, hilo de la línea de tiempo y panel deslizante animados con resorte, con entrada escalonada por banda;
- `scripts/optimize-assets.mjs`: convierte las ilustraciones a WebP;
- `vercel.json`, favicon SVG, metadatos Open Graph y tarjeta social JPEG para la publicación en `amauta.online`.

### Changed

- las ilustraciones pasan de PNG a WebP: **12,5 MB → 395 kB (97 % menos)**; el `dist` completo baja de ~13 MB a ~1 MB;
- las animaciones de entrada dejan de hacerse con `@keyframes` y `--item-index` y pasan a variantes escalonadas, para que no compitan con el movimiento de estado.

### Fixed

- el rótulo «¿Has pensado en esto?» quedaba **invisible** tras el barrido: el degradado usaba `currentColor`, que resolvía al `color: transparent` de su propia regla. El color base va ahora explícito en `--sweep-base` y el degradado cubre siempre la caja completa.

### Accessibility

- `MotionConfig reducedMotion="user"` más un bloque `prefers-reduced-motion` para las animaciones CSS;
- `AnimatedNumber` pinta el valor final en el primer render: ninguna cifra en tránsito llega a un lector de pantalla;
- el parallax se desactiva en punteros gruesos, donde no hay hover que lo justifique.

## [0.5.0] — 2026-09-08

### Added

- mecánica «¿Has pensado en esto?» visible en pantalla, con el mensaje contextual y las acciones `Continuar`, `Guardar reserva` y `Comparar alternativa`;
- panel deslizante con comparador de caminos, detalle de hito, rango económico/probable/conservador y reglas explicables (`ver por qué aparece esta sugerencia`);
- interruptor «Modo La vida pasa» junto a la línea de tiempo, con la advertencia de que son simulaciones y no predicciones;
- decisión de vaciado del techo con las cuatro modalidades del RNE-alineadas del prototipo (obra, mixer, mixer + bomba y servicio integral) y su efecto en costo y liquidez;
- foco de escena que se desplaza según la etapa (casa familiar, terreno, cimientos, hogar futuro) para que cada decisión produzca un cambio visual;
- insignias de origen `REAL / SEEDED_REFERENCE / MOCK` en cada cifra externa del panel de detalle;
- acciones deterministas `advance-time` y `protect-reserve` en el motor.

### Fixed

- **tipografía comprimida**: la superficie ya no reduce la letra para caber. Ningún texto baja de 12 px y el ajuste se hace recortando microcopy secundaria o desplazando dentro de un panel, nunca achicando la fuente. Cubierto por una prueba E2E.
- eliminadas la superposición de bandas y el recorte de textos en 1280×720 y en móvil;
- en móvil se acepta un scroll corto y controlado en lugar de solapar contenido a 664 px de alto útil;
- `activeInsight` deja de mostrar una regla inactiva como si estuviera activa.

### Removed

- `src/styles.css` y siete componentes huérfanos que ya no participaban del render (`ChoiceRail`, `ComparisonStrip`, `InsightStrip`, `StressTester`, `HouseScene`, `Timeline`, `Hud`, `OriginBadge`).

## [0.4.0] — 2026-09-08

### Changed

- reconstruido `/_studio` como editor one-page maestro-detalle sin scroll de documento;
- añadidos escenarios interactivos y gráficos de flujo mensual, posición actual y rango económico/probable/conservador;
- expuestos 15 supuestos editables de finanzas, vivienda y obra mediante pestañas compactas;
- conectada la configuración validada del Studio con el simulador principal mediante almacenamiento local versionado;
- añadida navegación móvil por superficies y pruebas de persistencia, gráficos y ajuste al viewport.

## [0.3.0] — 2026-09-08

### Changed

- reconstruida la interfaz como un simulador de una sola pantalla y sin scroll de documento;
- incorporada una escena ilustrada de casa peruana en corte, con etiquetas y capas HTML interactivas;
- condensadas situación, decisiones, resiliencia, imprevistos y línea de tiempo dentro del primer viewport;
- añadidos layouts específicos para 360, 768, 1280 y 1600 px y una prueba E2E de ajuste exacto al viewport.

## [0.2.0] — 2026-09-08

### Changed

- reemplazado el rail de filas de texto por selectores visuales de vivienda y acciones;
- añadido detalle de ruta y paso simulado dentro de la misma superficie;
- reorganizada la escena a ancho completo y retirada la superposición de la barra de capas;
- incorporadas ilustraciones locales accesibles para los selectores y cobertura E2E del flujo visual.

## [0.1.0] — 2026-09-07

### Added

- auditoría, investigación de referencias, dirección visual y sistema de diseño;
- shell React/Vite en una sola superficie;
- simulación determinista seeded para vivienda, ahorro, terreno, alquiler y construcción inicial;
- escena SVG 2.5D, timeline, insights, stress-test y undo/redo;
- studio local con configuración validada, preview, reset e import/export;
- documentación base, ADRs, CI y pruebas unitarias/E2E.

### Known

- datos externos, publicación y 3D avanzado siguen pendientes.
