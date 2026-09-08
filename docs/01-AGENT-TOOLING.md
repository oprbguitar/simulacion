# Herramientas y skills utilizadas

| Skill / capacidad | Por qué se usó | Fase | Artefacto o salida | Estado |
| --- | --- | --- | --- | --- |
| `pierre-design-director` | fijar modo, dirección visual, tokens, responsive y anti-patrones antes de UI | 0 | selector visual, `DESIGN.md`, `docs/04-DESIGN-SYSTEM.md` | requerida |
| `frontend-app-builder` | diseñar una superficie de gameplay completa y construirla con React + Vite | 0-1 | tres conceptos, shell web y QA visual | requerida |
| `imagegen` | generar conceptos completos de pantalla, incluido estado móvil | 0 | `docs/design/concepts/*.png` | requerida para concepting |
| `build-web-data-visualization` | clasificar timeline, comparación, datos simulados, etiquetas y fallback móvil | 0-1 | contrato de timeline y reglas de honestidad de datos | requerida |
| `sites:sites-building` | revisar el camino de construcción de Sites y sus límites | 0 | decisión de mantener el prototipo local | informativa |
| `sites:sites-hosting` | no ejecutada: publicar no fue solicitado y requeriría una acción externa adicional | — | sin despliegue | no aplicada |
| `e2e-testing` | estructura de smoke tests Playwright y rutas críticas | 1 | `tests/e2e/smoke.spec.ts`, `playwright.config.ts` | requerida |
| `verification-loop` | build, tipos, lint, tests y revisión de diff | 1 | reporte final de verificación | requerida |

## Capacidades deliberadamente no usadas

- No se añadió una app MCP de OpenAI: el prototipo no requiere herramienta conversacional ni integración con ChatGPT.
- No se incorporó Supabase; la especificación exige mantener abierta la frontera D1/SQL sin acoplarla al frontend.
- No se conectaron scrapers, APIs, cuentas, credenciales, fuentes con autenticación ni servicios de publicación.

No se guardan API keys, tokens ni credenciales en este documento.
