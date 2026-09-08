# Investigación y dirección de diseño

## Lectura del material existente

Las 16 referencias del repositorio proponen una ilustración de Perú reconocible, colores vivos, familias, vivienda en construcción, hitos y mensajes manuscritos. Funcionan bien como tono emocional y demostración de posibilidades. Para el primer MVP, su composición tipo “etapa + muchas tarjetas + resumen lateral” compite con la decisión que el usuario debe tomar.

## Tres conceptos generados

1. `concept-a-ruta-posible.png`: HUD y escena panorámica, con acciones en una placa inferior. Muy claro, pero la escena se acerca a una fotografía y la selección se siente más formulario.
2. `concept-b-camino.png`: ruta ilustrada con nodos y fases. Es el mejor modelo narrativo, pero la gran escena reduce espacio para comparar decisiones.
3. `concept-c-horizonte.png`: corte 2.5D de casa/terreno, decisiones en bandas y timeline inferior, con variante móvil. Es el más alineado con el selector y con el bucle estado → decisión → consecuencia.

## Dirección elegida

**Horizonte / tablero de ruta:** experiencia editorial jugable, bandas de ancho completo, escena de corte 2.5D como evidencia principal, timeline como segundo eje y decisiones expresadas como filas de alternativas. Geometría de bloque con separadores, sin radios ni sombras ornamentales.

### Criterios de selección

- lectura en menos de 30 segundos;
- un solo foco visual;
- decisión directa sin cuestionario largo;
- timeline accionable y reversible;
- equivalencia móvil real;
- implementación ligera y accesible;
- diferenciación frente a dashboard/ERP.

## Contrato de concepto

Bloqueado: escena central, HUD superior compacto, pregunta habitacional, acciones de siguiente paso, timeline inferior, insight contextual, control “La vida pasa”, fondo blanco/acero, tinta oscura, verde eléctrico y separadores fuertes.

Flexible: copy exacto de la marca de trabajo, densidad de hitos, ilustración SVG concreta, proporciones menores y número de etapas visibles.

La UI, números, controles, fuentes, estados de datos y etiquetas son code-native. La imagen generada queda como referencia de diseño, no como captura usada en producción.
