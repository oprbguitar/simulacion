# Horizonte — simulador de vida y vivienda

Horizonte es un prototipo local, anónimo y en español de Perú para explorar decisiones de vivienda, ahorro y construcción progresiva. La experiencia se comporta como una ruta jugable: eliges dónde estás, pruebas un camino y ves cambiar la escena, el dinero y el timeline.

> Los resultados son simulaciones educativas con supuestos editables. No son predicciones, asesoría financiera, legal, médica ni estructural.

## Qué funciona en este corte

- pantalla única con la pregunta `¿Dónde vives actualmente?`;
- selector visual de cuatro caminos: familia, alquiler, terreno y sin propiedad;
- detalle de la ruta y del último paso dentro de la misma superficie, sin navegación profunda;
- acciones deterministas de ahorro, terreno, alquiler y construcción inicial;
- HUD de ahorro, ingreso, reserva, patrimonio y origen de datos;
- escena SVG 2.5D de casa/terreno con capas seleccionables y barra de capas sin superposición;
- timeline mensual con hitos clicables y detalle del periodo;
- tres reglas explicables de `¿Has pensado en esto?`;
- modo `La vida pasa` con desempleo de 3 meses y gasto médico inesperado;
- undo/redo para cambiar de camino;
- `/_studio` local para editar supuestos, insight, timeline y ordenar etapas;
- import/export JSON validado;
- pruebas unitarias y smoke E2E.

Las imágenes de los selectores viven en `public/assets/`. Son ilustraciones locales sin texto incrustado: el contenido visible sigue siendo HTML accesible y el Studio conserva la posibilidad de editar/importar el contrato sin depender de un servicio externo.

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
  State --> Scene[SVG 2.5D]
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

El studio es solo local y no es una barrera de seguridad. Permite editar configuración validada, previsualizar, deshacer, resetear e importar/exportar. Antes de publicar debe desactivarse o protegerse con una autorización real.

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
