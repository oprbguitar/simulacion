# Auditoría del repositorio

**Fecha:** 2026-09-07  
**Alcance:** estado inicial de `C:\Users\oprbg\Documents\Claude\SImulacion` antes de la implementación.

## Archivos descubiertos

| Ruta | Clasificación | Estado |
| --- | --- | --- |
| `referencias/ESPECIFICACION_PORTAL_SIMULADOR_VIDA_PERU_CODEX_CLAUDE.md` | especificación funcional y técnica | requisito primario del prototipo |
| `referencias/img/ChatGPT Image 7 sept 2026, 22_10_27 (1-4).png` | referencias visuales de inicio/vivienda/familia/proyección | inspeccionadas; no se usan como UI raster |
| `referencias/img/ChatGPT Image 7 sept 2026, 22_10_40 (1-6).png` | referencias visuales de producto y módulos | inspeccionadas; no se usan como UI raster |
| `referencias/img/ChatGPT Image 7 sept 2026, 22_10_45 (1-6).png` | referencias visuales de construcción, pagos, salud, educación, ingresos y consejos | inspeccionadas; no se usan como UI raster |
| `CODEX_MASTER_INSTRUCTION_SIMULACION_PORTAL.md` | instrucción adjunta fuera del repositorio | leída como instrucción de ejecución, no como archivo del repo |

## Especificaciones relevantes

- La especificación exige una experiencia de simulación en una sola superficie, en español de Perú, sin cuenta ni datos sensibles en el MVP.
- La Fase 0 prueba la experiencia visual y el inicio del gameplay; la Fase 1 añade vivienda y construcción determinista.
- Las referencias externas de precios y normativa quedan preparadas, pero no se conectan durante este primer corte.

## Referencias de imagen

Las imágenes comparten una ilustración territorial peruana cálida, escenas de vivienda, hitos familiares y llamadas de atención. También repiten navegación por etapas, paneles y muchas tarjetas. Para evitar una UI tipo dashboard se conservaron el paisaje, los hitos y la idea de progreso, pero se redujeron a un escenario central, un rail de decisiones y un timeline.

Se generaron tres conceptos completos adicionales y se guardaron en `docs/design/concepts/`. Se seleccionó `concept-c-horizonte.png`.

## Datos y assets

- No había código, `package.json`, datasets, modelos 3D, SVG de producto ni archivos de configuración.
- Las cifras del MVP son supuestos serializables de demostración, etiquetados `SEEDED_REFERENCE` o `MOCK`; no son precios vigentes.
- La escena 2.5D es SVG code-native y tiene equivalente textual. No se copió ninguna ilustración de terceros.

## Faltantes iniciales

- Aplicación, motor de simulación, contratos de contenido y pruebas.
- Persistencia de publicación, adaptador D1/R2, ingestión de fuentes reales y autenticación de estudio.
- 3D R3F/GLB, model-viewer y optimización WebGL; se deja una interfaz de fallback para una fase posterior.

## Riesgos

1. Las cantidades de obra no deben confundirse con metrados profesionales; el MVP solo simula consecuencias económicas relativas.
2. Las fuentes regulatorias y de mercado pueden cambiar; cualquier valor externo futuro deberá conservar origen, unidad, fecha y confianza.
3. `/_studio` será solo local en esta fase; no se debe publicar sin protección externa o desactivación.
4. El equilibrio entre narrativa y densidad debe revisarse en navegador a 360, 768, 1280 y 1600 px.

## Orden recomendado

1. Contratos, contenido seeded y motor puro.
2. Shell React/Vite y SVG 2.5D accesible.
3. Timeline, decisiones, undo/branching e insights deterministas.
4. `/_studio` local con import/export validado.
5. Pruebas unitarias, integración ligera y Playwright.
6. Revisión visual y documentación de límites.
7. En fases posteriores: fuentes oficiales, adaptadores, 3D lazy-loaded y almacenamiento.
