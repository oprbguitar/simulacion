# Changelog

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
