# Presupuesto y medición de rendimiento

## Decisiones de Fase 0/1

- No se carga Three.js ni una biblioteca de charts en el primer render.
- La escena 2.5D usa un SVG pequeño y estático, con transiciones CSS solamente.
- El timeline usa DOM semántico y scroll horizontal local en móvil.
- El studio se carga por ruta, no como panel adicional en la superficie pública.

## Presupuesto objetivo

| Medida | Objetivo | Estado |
| --- | --- | --- |
| JS inicial sin dependencias 3D | < 250 KB gzip | medir en build final |
| escena inicial | sin red externa | cumplido por diseño |
| animación | solo al cambiar estado; reduced motion | cumplido por diseño |
| overflow horizontal | únicamente rails intencionales | revisar en Playwright |

La medición de producción se incorpora cuando exista build publicado. Los tiempos de Vite local no se presentan como rendimiento de producción.
