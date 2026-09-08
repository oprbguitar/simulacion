# ADR 0001: SVG 2.5D antes de R3F

## Contexto

El MVP necesita una escena de vivienda que cambie de forma comprensible y funcione sin WebGL.

## Decisión

Implementar una escena SVG data-bound, con texto equivalente, y dejar R3F/Three.js para una fase posterior lazy-loaded.

## Consecuencias

La primera versión pesa menos, es testeable en DOM y mantiene accesibilidad. A cambio, no ofrece cámara libre ni geometría 3D; el contrato de capas queda preparado para migración.
