# Fuentes y procedencia

## Estado de Fase 0/1

No hay fuentes externas conectadas. Todas las cifras visibles son supuestos de simulación con origen `SEEDED_REFERENCE` o `MOCK`, y la UI lo indica. No se presentan como precios de hoy.

## Catálogo inicial para fases posteriores

| Fuente | Uso previsto | Tipo | Estado |
| --- | --- | --- | --- |
| [MVCS / RNE](https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamentonacional-de-edificaciones-rne) | normativa y contexto legal | A oficial | pendiente |
| [SENCICO / RNE](https://www.gob.pe/institucion/sencico/informes-publicaciones/%20887225-normas-del-reglamento-nacional-de-edificaciones-rne) | actualizaciones normativas | A oficial | pendiente |
| [INEI](https://www.inei.gob.pe/buscador/1/?tbusqueda=precios+de+construccion) | índices de precios | A oficial | pendiente |
| [SBS](https://www.sbs.gob.pe/usuarios/informate-y-compara/compara-productos-financieros/compara-costos-de-creditos) | educación y tasas de crédito | A oficial | pendiente |
| [SUNARP](https://www.sunarp.gob.pe/Calculadora/index.asp) | referencias registrales | A oficial | pendiente |
| [SUNAT](https://personas.sunat.gob.pe/alquilo-mi-casa-o-auto/rentas-primera-categoria) | alquiler desde vista propietaria | A oficial | pendiente |
| [Osinergmin](https://www.osinergmin.gob.pe/seccion/institucional/Paginas/VisorPliegosTarifarios.aspx) | electricidad | A oficial | pendiente |
| [Urbania Index Lima](https://urbania.pe/blog/urbania-index-lima/) | referencia inmobiliaria | C mercado observado | pendiente |
| [BCRP](https://www.bcrp.gob.pe/estadisticas/indicador-de-precios-de-venta-de-departamentos.html) | precios de departamentos | A/estadística pública | pendiente |
| [MINSA](https://www.gob.pe/institucion/minsa/normas-legales/8265031-561-2026-minsa) | calendario oficial de inmunización | A oficial | pendiente |
| [MINEDU datos abiertos](https://www.datosabiertos.gob.pe/group/ministerio-de-educaci%C3%B3n-minedu) | educación | A oficial | pendiente |
| [SUNEDU programas](https://www.datosabiertos.gob.pe/dataset/sunedu-programas-acad%C3%A9micos) | educación superior | A oficial | pendiente |
| [MTPE Mi Carrera](https://micarrera.trabajo.gob.pe/) | empleo/estudios | A oficial | pendiente |

## Contrato de observación

Cada valor futuro debe conservar: `sourceType`, `sourceName`, `sourceUrl`, `capturedAt`, `validFrom`, `geography`, `unit`, `valueOrRange`, `extractionMethod` y `confidence`. Las categorías no se mezclan silenciosamente.
