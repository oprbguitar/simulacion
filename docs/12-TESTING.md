# Estrategia de pruebas

## Capas

- Unitarias: fórmulas de reserva, flujo, patrimonio, acciones, stress y reglas.
- Integración ligera: contrato de contenido e import/export del studio.
- E2E: selección de vivienda, acción, cambio visual, timeline, stress, undo y ajuste sin scroll en desktop/mobile.
- Manual: foco, labels de escena, reduced motion, consola y overflow horizontal/vertical a 360, 768, 1280 y 1600 px.

## Comandos

```bash
npm run lint
npm run typecheck
npm run test
npm run test:coverage
npm run build
npm run test:e2e
npm run docs:check
```

La cobertura del motor tiene umbrales mínimos de 80 % en líneas, funciones y statements, y 75 % en branches. El último corte verificado alcanza 99.27 % statements, 96.87 % branches, 100 % funciones y 100 % líneas.
