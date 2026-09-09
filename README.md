# Horizonte — simulador de vida y vivienda

Horizonte es un prototipo local, anónimo y en español de Perú para explorar decisiones de vivienda, ahorro y construcción progresiva. Toda la experiencia principal cabe en una sola pantalla: eliges dónde estás, pruebas un camino y ves cambiar la escena, el dinero y el tiempo sin desplazamiento vertical.

> Los resultados son simulaciones educativas con supuestos editables. No son predicciones, asesoría financiera, legal, médica ni estructural.

## Qué funciona en este corte

- pantalla operativa one-page en escritorio, con la letra como restricción dura: nada baja de 12 px;
- selector visual de cuatro caminos: familia, alquiler, terreno y sin propiedad;
- escena ilustrada de una casa peruana en corte, con un foco que se mueve al terreno, los cimientos o el hogar futuro según la decisión;
- acciones deterministas de ahorro, terreno, alquiler y construcción inicial, más `Continuar` y `Guardar reserva`;
- cabecera compacta con periodo, ahorro, ingreso, reserva y patrimonio calculados;
- mecánica **«¿Has pensado en esto?»** con mensaje corto y detalle bajo demanda (`ver por qué aparece esta sugerencia`);
- comparador de caminos (familia / alquiler / comprar + construir) sobre los mismos supuestos, sin declarar ganador;
- costo del paso expresado como rango económico / probable / conservador, no como cifra exacta;
- decisión de **vaciado del techo**: preparado en obra, mixer, mixer + bomba o servicio integral, con su efecto económico;
- **Modo «La vida pasa»**: imprevistos de desempleo y gasto médico, etiquetados como simulaciones y no predicciones;
- línea de tiempo navegable con hitos clicables y detalle en panel deslizante;
- insignias de origen `REAL / SEEDED_REFERENCE / MOCK` en cada cifra externa;
- undo/redo para cambiar de camino;
- `/_studio` one-page para probar escenarios, editar 15 supuestos y leer gráficos de flujo, patrimonio y rango;
- persistencia local validada: los valores editados en Studio alimentan al simulador principal;
- import/export JSON validado;
- pruebas unitarias y suite E2E en escritorio y móvil;
- **capa de movimiento completa**: contadores con resorte, variación de cada indicador respecto del paso anterior, foco de escena que viaja, parallax de puntero sobre la ilustración, subrayado compartido entre situaciones, hilo de la línea de tiempo que crece, haz sobre el control recomendado y panel deslizante con entrada y salida por resorte. Todo se apaga con `prefers-reduced-motion`.

### Restricción de legibilidad

La versión anterior cabía en una pantalla a costa de reducir el texto hasta 9,6 px y recortarlo. Ahora el presupuesto de altura se resuelve en este orden: recortar microcopy secundaria → desplazar dentro de un panel → permitir scroll corto de documento en móvil. **Nunca** reducir el cuerpo tipográfico. Hay una prueba E2E (`ningún texto de la superficie baja de 12 px`) y otra que verifica que las bandas no se superpongan.

Las imágenes de la escena y los selectores viven en `public/assets/` en formato WebP (395 kB en total; los PNG originales pesaban 12,5 MB y se regeneran con `node scripts/optimize-assets.mjs`). Son ilustraciones locales sin texto incrustado: las etiquetas y controles siguen siendo HTML accesible y el Studio conserva la posibilidad de editar/importar el contrato sin depender de un servicio externo.

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

El Studio es solo local y no es una barrera de seguridad. Permite seleccionar situación y decisión, editar supuestos agrupados en Finanzas/Vivienda/Obra/Fuente, previsualizar, analizar tres gráficos, deshacer, resetear e importar/exportar. Los cambios válidos se guardan en `localStorage` y el simulador principal los carga al abrirse. La ruta queda accesible en producción: no hay servidor ni datos de terceros que proteger, y todo lo editado vive en el navegador de quien lo abre. Si algún día se conecta una API con datos reales, debe protegerse antes.

## Estructura

```text
src/domain/       contratos, seeded config, motor y reglas
src/components/   HUD, escena, choices, timeline, insight y stress
src/motion/       tokens, primitivas y hooks de animación
src/studio/       editor local de contenido
data/seed/        contrato documentado para seeds futuros
docs/             arquitectura, diseño, fuentes, reglas, seguridad y QA
tests/            unitarias y e2e
```

## Estado y roadmap

El núcleo jugable de Fase 0 y el inicio funcional de Fase 1 están implementados. Faltan fuentes reales, metrados profesionales, R3F/GLB, adapters de almacenamiento y módulos familia/educación/trabajo. Consulta [`docs/14-ROADMAP.md`](docs/14-ROADMAP.md) y [`docs/15-KNOWN-LIMITATIONS.md`](docs/15-KNOWN-LIMITATIONS.md).

## Publicación

El sitio se despliega como estático en Vercel y se sirve en `simulacion.amauta.online`. Los pasos, la configuración de `vercel.json` y los registros DNS están en [`docs/13-DEPLOYMENT.md`](docs/13-DEPLOYMENT.md).

## Licencia

El código de este prototipo se publica sin dependencia de código copiado de los repositorios de referencia. Las licencias y decisiones de no reutilización están registradas en [`docs/02-REFERENCE-REPOSITORIES.md`](docs/02-REFERENCE-REPOSITORIES.md). Añadir una licencia de distribución del proyecto es una tarea posterior explícita.
