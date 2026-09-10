# Fuentes y procedencia

## Regla

Ningún número llega a pantalla sin dos cosas: un **origen** declarado y al menos
una **fuente** con enlace y fecha de verificación. El registro único vive en
[`src/domain/life/fuentes.ts`](../src/domain/life/fuentes.ts); ningún módulo del
catálogo escribe direcciones sueltas.

## Los cinco orígenes

| Origen | Qué significa | Cuánto peso puede tener |
| --- | --- | --- |
| `OFICIAL` | Publicado por una entidad del Estado: ley, resolución, tarifario, TUPA. | El máximo. Es la referencia. |
| `REGULADO` | Fijado o supervisado por un regulador sectorial (Osinergmin, SUNASS, SBS). | Alto, pero el pliego vigente manda sobre cualquier promedio. |
| `TECNICO` | Constante de ingeniería: metrado, dosificación, rendimiento. | Estable. No se mueve con la inflación. |
| `MERCADO` | Precio observado en comercios o portales. | Cambia varias veces al año. Verificar antes de usar. |
| `ESTIMADO` | Supuesto del simulador para poder cerrar el cálculo. | El más débil. Siempre marcado como tal. |

## Verificación

Las 42 direcciones del registro se comprobaron con una petición real el
**2026-09-09**. La que no respondió 200 no entró, y varias candidatas quedaron
fuera por eso (los enlaces profundos de `sat.gob.pe`, entre otros; en su lugar se
usa la ficha institucional en gob.pe, que sí responde).

Para revalidar: pedir cada URL de `LISTA_FUENTES` y comprobar el código de
respuesta. Al corregir una, actualizar la constante `VERIFICADO` del archivo.

## Registro

| Entidad | Documento o servicio | Origen | Verificado |
| --- | --- | --- | --- |
| CAPECO | [Cámara Peruana de la Construcción](https://www.capeco.org/) | MERCADO | 2026-09-09 |
| COFOPRI | [Organismo de Formalización de la Propiedad Informal](https://www.gob.pe/cofopri) | OFICIAL | 2026-09-09 |
| Colegio de Arquitectos del Perú | [Cuadro de Valores Unitarios Oficiales de Edificación — Costa](https://cap.org.pe/valores-unitarios-oficiales-de-edificaciones/valores-unitarios-costa/) | OFICIAL | 2026-09-09 |
| EsSalud | [Seguro Social de Salud](https://www.gob.pe/essalud) | OFICIAL | 2026-09-09 |
| Fondo MIVIVIENDA | [Programas de crédito y bonos de vivienda](https://fondomivivienda.pe/) | OFICIAL | 2026-09-09 |
| INDECOPI | [Defensa del consumidor y competencia](https://www.gob.pe/indecopi) | OFICIAL | 2026-09-09 |
| INEI | [Índices de precios — materiales de construcción](https://www.inei.gob.pe/estadisticas/indice-tematico/precios/) | OFICIAL | 2026-09-09 |
| Junta de Decanos de Colegios de Notarios | [Colegios de Notarios del Perú](https://www.notarios.org.pe/) | OFICIAL | 2026-09-09 |
| MEF | [Normas y documentos legales — D.S. 301-2025-EF fija la UIT 2026 en S/ 5,500](https://www.gob.pe/institucion/mef/normas-legales) | OFICIAL | 2026-09-09 |
| MIMP | [Ministerio de la Mujer y Poblaciones Vulnerables](https://www.gob.pe/mimp) | OFICIAL | 2026-09-09 |
| MINEDU | [Identicole — buscador de colegios y pensiones declaradas](https://identicole.minedu.gob.pe/) | OFICIAL | 2026-09-09 |
| MINEDU | [Informes y publicaciones](https://www.gob.pe/institucion/minedu/informes-publicaciones) | OFICIAL | 2026-09-09 |
| MINSA | [Esquema Nacional de Inmunizaciones](https://www.gob.pe/22037-esquema-nacional-de-inmunizaciones) | OFICIAL | 2026-09-09 |
| MINSA | [Control de Crecimiento y Desarrollo (CRED) hasta los 11 años](https://www.gob.pe/32588-control-de-crecimiento-y-desarrollo-cred-para-menores-de-11-anos) | OFICIAL | 2026-09-09 |
| MINSA | [Recibir Control de Crecimiento y Desarrollo (CRED)](https://www.gob.pe/32589-recibir-control-de-crecimiento-y-desarrollo-cred) | OFICIAL | 2026-09-09 |
| MINSA | [Normas técnicas e informes](https://www.gob.pe/institucion/minsa/informes-publicaciones) | OFICIAL | 2026-09-09 |
| MTPE | [Ministerio de Trabajo y Promoción del Empleo](https://www.gob.pe/mtpe) | OFICIAL | 2026-09-09 |
| MVCS | [Reglamento Nacional de Edificaciones (RNE)](https://www.gob.pe/institucion/vivienda/informes-publicaciones/2309793-reglamento-nacional-de-edificaciones-rne) | OFICIAL | 2026-09-09 |
| MVCS / El Peruano | [R.M. 277-2025-VIVIENDA — Valores Unitarios Oficiales de Edificación 2026](https://busquedas.elperuano.pe/dispositivo/NL/2453433-1) | OFICIAL | 2026-09-09 |
| ONP | [Oficina de Normalización Previsional](https://www.gob.pe/onp) | OFICIAL | 2026-09-09 |
| Osinergmin | [Pliegos tarifarios de electricidad para usuario final](https://www.osinergmin.gob.pe/seccion/institucional/regulacion-tarifaria/pliegos-tarifarios/electricidad/pliegos-tarifarios-usuario-final) | REGULADO | 2026-09-09 |
| PCM | [Licencia de edificación para proyectos de modalidad A](https://www.gob.pe/20996-obtener-licencia-de-edificacion-para-proyectos-de-la-modalidad-a) | OFICIAL | 2026-09-09 |
| PCM / Municipalidades | [Obtener licencia de edificación de modalidad A (vivienda unifamiliar)](https://www.gob.pe/59133-obtener-licencia-de-edificacion-de-modalidad-a-para-la-construccion-ampliacion-y-remodelacion-de-una-vivienda-unifamiliar) | OFICIAL | 2026-09-09 |
| PRONABEC | [Becas y crédito educativo](https://www.gob.pe/pronabec) | OFICIAL | 2026-09-09 |
| SAT de Lima | [Servicio de Administración Tributaria de Lima](https://www.gob.pe/satlima) | OFICIAL | 2026-09-09 |
| SBS | [Tasas de interés promedio del sistema financiero](https://www.sbs.gob.pe/estadisticas/tasa-de-interes/tasas-de-interes-promedio) | REGULADO | 2026-09-09 |
| SBS | [Tasa de interés promedio — créditos hipotecarios](https://www.sbs.gob.pe/app/pp/EstadisticasSAEEPortal/Paginas/TIPHipotecario.aspx) | REGULADO | 2026-09-09 |
| SEDAPAL | [Servicio de Agua Potable y Alcantarillado de Lima](https://www.sedapal.com.pe/) | REGULADO | 2026-09-09 |
| SIS | [Seguro Integral de Salud](https://www.gob.pe/sis) | OFICIAL | 2026-09-09 |
| SUNARP | [Servicio de Publicidad Registral en Línea (SPRL)](https://sprl.sunarp.gob.pe/) | OFICIAL | 2026-09-09 |
| SUNARP | [Plataforma de servicios en línea](https://www.sunarp.gob.pe/serviciosenlinea/portal/index.html) | OFICIAL | 2026-09-09 |
| SUNARP | [Calculadora de derechos registrales](https://sidciudadano.sunarp.gob.pe/PreLiquidacionWeb/Inicio) | OFICIAL | 2026-09-09 |
| SUNASS | [Regulador de agua y saneamiento](https://www.gob.pe/sunass) | REGULADO | 2026-09-09 |
| SUNASS | [Informes y publicaciones (estudios tarifarios por EPS)](https://www.gob.pe/institucion/sunass/informes-publicaciones) | REGULADO | 2026-09-09 |
| SUNAT | [Regímenes tributarios para MYPE](https://emprender.sunat.gob.pe/ruc/regimenes-tributarios-mype/regimenes-tributarios) | OFICIAL | 2026-09-09 |
| SUNAT | [Regímenes tributarios (orientación)](https://www.gob.pe/280-superintendencia-nacional-de-aduanas-y-de-administracion-tributaria-regimenes-tributarios) | OFICIAL | 2026-09-09 |
| SUNAT | [Régimen MYPE Tributario (RMT)](https://www.gob.pe/6990-regimen-mype-tributario-rmt) | OFICIAL | 2026-09-09 |
| SUNAT | [Régimen Especial de Renta (RER)](https://www.gob.pe/6989-declarar-y-pagar-el-impuesto-a-la-renta-de-cuarta-categoria) | OFICIAL | 2026-09-09 |
| SUNAT | [Portal Personas](https://personas.sunat.gob.pe/) | OFICIAL | 2026-09-09 |
| SUNAT | [Renta anual de personas naturales](https://renta.sunat.gob.pe/personas) | OFICIAL | 2026-09-09 |
| SUNEDU | [Superintendencia Nacional de Educación Superior Universitaria](https://www.gob.pe/sunedu) | OFICIAL | 2026-09-09 |
| SUSALUD | [Superintendencia Nacional de Salud](https://www.gob.pe/susalud) | OFICIAL | 2026-09-09 |

## Datos que caducan y dónde están

| Dato | Valor vigente | Archivo | Cuándo cambia |
| --- | --- | --- | --- |
| UIT | S/ 5,500 (D.S. 301-2025-EF) | `catalogo/vivienda.ts` | Cada año, por decreto supremo |
| RMV | S/ 1,130 (D.S. 006-2024-TR) | `catalogo/trabajo.ts` | Por decreto supremo |
| Tramos del impuesto a la renta | 8 / 14 / 17 / 20 / 30 % | `catalogo/trabajo.ts` | Por norma tributaria |
| Tasa de Alcabala | 3 % sobre el exceso de 10 UIT | `catalogo/vivienda.ts` | TUO de la Ley de Tributación Municipal |
| TEA hipotecaria de referencia | La fija el usuario; la SBS publica la serie | `motor.ts` (`PERFIL_INICIAL`) | Continuamente |
| Precios de materiales | Referencias de Lima 2026 | `catalogo/construccion.ts` | Varias veces al año |
| Valores Unitarios Oficiales | Ejercicio 2026 (R.M. 277-2025-VIVIENDA) | Enlazados, no copiados | Cada octubre, para el ejercicio siguiente |
| Topes MIVIVIENDA y Techo Propio | No se copian: se enlaza al programa | `catalogo/vivienda.ts` | Por resolución del Fondo MIVIVIENDA |

## Lo que deliberadamente no se copia

Montos que caducan rápido y cuya versión desactualizada haría daño: topes de valor
de vivienda de los programas habitacionales, montos del Bono del Buen Pagador y del
Bono Familiar Habitacional, tarifas exactas de los pliegos de electricidad y de las
EPS, y derechos de trámite municipales. En todos esos casos el expediente enlaza a
la entidad en vez de arriesgar una cifra vieja presentada como vigente.
