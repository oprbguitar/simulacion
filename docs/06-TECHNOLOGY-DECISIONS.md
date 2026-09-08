# Decisiones tecnológicas

## 0001 — React + Vite + TypeScript

Se elige React + Vite por ser una app de una sola superficie, con interacción local, carga rápida y sin backend requerido en el MVP. TypeScript estricto mantiene los contratos del dominio separados de la UI.

## 0002 — Motor puro sin dependencia de UI

Las fórmulas viven en `src/domain/simulation.ts`. La UI recibe resultados serializables; ningún componente calcula cuotas, reserva o patrimonio directamente.

## 0003 — SVG 2.5D antes de R3F

La escena debe ser entendible sin WebGL. SVG permite labels accesibles, fallback de bajo consumo y revisión visual simple. Three.js/R3F queda como mejora lazy-loaded cuando exista un modelo que añada información real.

## 0004 — Validación de configuración sin dependencia externa

`src/domain/content.ts` implementa un guard de runtime acotado para el JSON del studio. Se evita añadir Zod al MVP; el contrato está tipado, versionado y rechaza entradas incompletas antes de aplicarlas.

## 0005 — Preparación para D1 sin conexión en Fase 0

Se documenta la frontera de repositorios/adapters, pero no se crea un backend vacío. D1/R2 se evaluarán cuando exista persistencia publicada, fuentes o assets reales.

## 0006 — No Supabase

La especificación lo prohíbe y el diseño no necesita backend administrado para el prototipo local.
