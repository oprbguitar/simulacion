# Horizonte — La Ruta

Horizonte recorre el ciclo completo de una vida en el Perú: adquirir dónde vivir, construir por etapas, tener hijos, vacunarlos, educarlos, trabajar, pagar impuestos y aguantar lo que no estaba en el plan. Todo proyectado a 30 años, local y anónimo, en español de Perú.

Hay **dos maneras de entrar a los mismos datos**:

- **[La Ruta](docs/18-LA-RUTA.md)** (`/`) — el recorrido jugable, pensado para alguien de 14 a 16 años. Ocho bandas a sangre, una decisión grande por banda, ilustraciones, un tablero de vacunas de 29 casillas, naipes de imprevisto que se voltean y un mapa de 30 años que se camina. El detalle denso vive en cajones que se abren cuando lo pides.
- **[El expediente](docs/17-EXPEDIENTE-DE-VIDA.md)** (`/_expediente`) — el documento completo, con índice fijo, tablas, trámites, requisitos y las 42 fuentes.

Mismo motor, mismo catálogo, dos lecturas.

**La regla del proyecto: ninguna cifra aparece sin decir de dónde salió.** Cada número declara su origen (OFICIAL, REGULADO, MERCADO, TECNICO o ESTIMADO) y enlaza a la entidad donde se verifica, con la fecha en que se comprobó ese enlace. Las 42 direcciones del registro se probaron con una petición real; la que no respondió no entró.

> Simulación educativa. No es una cotización, no dimensiona elementos estructurales y no reemplaza a un profesional colegiado ni a la consulta directa en la entidad correspondiente.

## Las bandas de La Ruta

| # | Banda | Qué se juega |
| --- | --- | --- |
| 01 | Tu punto de partida | Tres arranques reconocibles y la región |
| 02 | ¿Dónde vas a vivir? | Cinco cartas ilustradas: terreno, casa, departamento, alquiler, familia |
| 03 | Construir de a pocos | La palanca de años que reparte el costo, las diez etapas de obra y las cantidades de material |
| 04 | ¿Y si tienes hijos? | El tablero de 29 vacunas del MINSA, gratis en el Estado, con su precio privado al costado |
| 05 | La casa cobra todos los meses | Luz, agua, internet y arbitrios |
| 06 | ¿De qué vives? | Cinco fichas de régimen con tres barras: red, libertad y techo |
| 07 | Y entonces la vida se mete | Ocho naipes de imprevisto que se voltean sobre tu ruta |
| 08 | Tu ruta, año por año | El mapa de 30 casillas con hitos y una ficha que camina |

## Las ocho secciones del expediente

| # | Sección | Qué contiene |
| --- | --- | --- |
| 00 | Tu punto de partida | Edad, región, ingreso, régimen, ahorro, gasto esencial, horizonte, hijos |
| 01 | Adquirir la propiedad | Cinco rutas de acceso, trámites en orden con sus requisitos, Alcabala calculado, capacidad de endeudamiento e interés total del crédito |
| 02 | Construir | Costo por m², cantidades de material para tu área, dosificaciones de concreto y las diez fases de obra con su metrado, su trámite y su norma |
| 03 | Traer un hijo al mundo | Preconcepción, gestación, parto, el Esquema Nacional de Inmunizaciones completo, calendario CRED, crianza y los cuatro niveles educativos |
| 04 | Habitar la casa | Consumos de referencia, boletas de luz y agua, arbitrios y mantenimiento |
| 05 | De dónde sale el ingreso | Planilla, honorarios, NRUS, RER y RMT: qué descuenta, qué protege y qué expone cada uno |
| 06 | Lo que el plan no contempla | Ocho imprevistos activables, cada uno con su vía institucional de respuesta |
| 07 | Los próximos años | Barra por año; al hacer clic, el desglose completo y los hitos de ese año |
| 08 | De dónde sale cada dato | Las 42 fuentes, ordenadas por entidad |

Documentación completa en [`docs/17-EXPEDIENTE-DE-VIDA.md`](docs/17-EXPEDIENTE-DE-VIDA.md); el registro de fuentes y los datos que caducan, en [`docs/08-DATA-SOURCES.md`](docs/08-DATA-SOURCES.md).

### Qué se hace distinto

- **El metrado y el precio van separados.** Cuánto cemento entra en un m² es una constante de ingeniería; cuánto cuesta hoy una bolsa es un precio que cambia varias veces al año. Publicar solo el producto de ambos esconde cuál de los dos está viejo.
- **Rangos, no promedios disfrazados de certeza.** Todo monto de mercado se guarda y se muestra como mínimo–típico–máximo.
- **Diagnósticos con identificador y palanca.** Cada alerta dice su regla (`AHORRO_NEGATIVO`, `CUOTA_SOBRE_TERCIO`…) y qué mover para cambiar el resultado. No hay puntaje oculto.
- **Los imprevistos no se sortean.** Se activan y el motor los coloca en un año fijo, para poder comparar el mismo escenario con y sin el golpe.

## Rutas

| Ruta | Superficie |
| --- | --- |
| `/` | La Ruta — el recorrido jugable |
| `/_expediente` | El documento completo con las 42 fuentes |
| `/_legacy` | Simulador de una pantalla anterior, conservado |
| `/_studio` | Editor de los supuestos del simulador anterior |

## Qué funciona en el simulador anterior (`/_legacy`)

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

Abre `http://localhost:5173` para La Ruta, `/_expediente` para el documento completo, `/_legacy` para el simulador de una pantalla y `/_studio` para el editor de supuestos.

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
