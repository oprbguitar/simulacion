# Horizonte — simulador de vida y vivienda

Horizonte es un prototipo local, anónimo y en español de Perú para explorar decisiones de vivienda, ahorro y construcción progresiva. Toda la experiencia principal cabe en una sola pantalla: eliges dónde estás, pruebas un camino y ves cambiar la escena, el dinero y el tiempo sin desplazamiento vertical.

> Los resultados son simulaciones educativas con supuestos editables. No son predicciones, asesoría financiera, legal, médica ni estructural.

## Qué funciona en este corte

- pantalla operativa one-page, adaptada a la altura del dispositivo y sin scroll de documento;
- selector visual de cuatro caminos: familia, alquiler, terreno y sin propiedad;
- escena ilustrada de una casa peruana en corte, con terreno, cimientos y hogar futuro;
- acciones deterministas de ahorro, terreno, alquiler y construcción inicial;
- cabecera compacta con periodo, ahorro, reserva y patrimonio calculados;
- etiquetas de escena seleccionables y libres de superposición;
- timeline compacto con hitos clicables;
- panel de resiliencia derivado de la reserva y señales del escenario;
- imprevistos de desempleo de 3 meses y gasto médico inesperado;
- undo/redo para cambiar de camino;
- `/_studio` one-page para probar escenarios, editar 15 supuestos y leer gráficos de flujo, patrimonio y rango;
- persistencia local validada: los valores editados en Studio alimentan al simulador principal;
- import/export JSON validado;
- pruebas unitarias y smoke E2E.

Las imágenes de la escena y los selectores viven en `public/assets/`. Son ilustraciones locales sin texto incrustado: las etiquetas y controles siguen siendo HTML accesible y el Studio conserva la posibilidad de editar/importar el contrato sin depender de un servicio externo.

## Inicio local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. Para el editor local visita `http://localhost:5173/_studio`.

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

## Arquitectura

```mermaid
flowchart LR
  User[Persona] --> UI[React + Vite]
  UI --> Engine[Motor puro TypeScript]
  Engine --> State[Estado serializable]
  State --> Scene[Escena ilustrada + capas HTML]
  State --> Timeline[Timeline]
  State --> Insight[Reglas explicables]
  Studio[/_studio] --> Config[ContentConfig validada]
  Config --> UI
```

El motor no depende de React, red o base de datos. La frontera de adapters queda documentada para una futura API Worker/D1/R2, sin usar Supabase.

## Procedencia de datos

La Fase 0/1 no conecta fuentes externas. Los valores visibles son `SEEDED_REFERENCE` o `MOCK` y se muestran con su origen. Las fuentes candidatas de Perú —RNE/MVCS, INEI, SBS, SUNAT, Osinergmin, BCRP, MINSA, MINEDU y MTPE— están catalogadas en [`docs/08-DATA-SOURCES.md`](docs/08-DATA-SOURCES.md), pero no se presentan como conectadas.

## Diseño y referencias

- Dirección visual: [`DESIGN.md`](DESIGN.md).
- Auditoría: [`docs/00-REPOSITORY-AUDIT.md`](docs/00-REPOSITORY-AUDIT.md).
- Conceptos generados: [`docs/design/concepts/`](docs/design/concepts/).
- Investigación de referencias: [`docs/02-REFERENCE-REPOSITORIES.md`](docs/02-REFERENCE-REPOSITORIES.md).

## Studio

El Studio es solo local y no es una barrera de seguridad. Permite seleccionar situación y decisión, editar supuestos agrupados en Finanzas/Vivienda/Obra/Fuente, previsualizar, analizar tres gráficos, deshacer, resetear e importar/exportar. Los cambios válidos se guardan en `localStorage` y el simulador principal los carga al abrirse. Antes de publicar, la ruta debe desactivarse o protegerse con una autorización real.

## Estructura

```text
src/domain/       contratos, seeded config, motor y reglas
src/components/   HUD, escena, choices, timeline, insight y stress
src/studio/       editor local de contenido
data/seed/        contrato documentado para seeds futuros
docs/             arquitectura, diseño, fuentes, reglas, seguridad y QA
tests/            unitarias y e2e
```

## Estado y roadmap

El núcleo jugable de Fase 0 y el inicio funcional de Fase 1 están implementados. Faltan fuentes reales, metrados profesionales, R3F/GLB, adapters de almacenamiento y módulos familia/educación/trabajo. Consulta [`docs/14-ROADMAP.md`](docs/14-ROADMAP.md) y [`docs/15-KNOWN-LIMITATIONS.md`](docs/15-KNOWN-LIMITATIONS.md).

## Licencia

El código de este prototipo se publica sin dependencia de código copiado de los repositorios de referencia. Las licencias y decisiones de no reutilización están registradas en [`docs/02-REFERENCE-REPOSITORIES.md`](docs/02-REFERENCE-REPOSITORIES.md). Añadir una licencia de distribución del proyecto es una tarea posterior explícita.
