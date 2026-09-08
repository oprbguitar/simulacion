# Studio local (`/_studio`)

El studio inicial es una ruta local separada que comparte tipos y tokens con el portal. No hay usuarios ni contraseña en Fase 0/1; por eso no se puede considerar una superficie segura para producción.

## Capacidades implementadas

- superficie maestro-detalle de una sola pantalla, sin scroll del documento;
- cuatro puntos de partida y cuatro decisiones para construir un preview determinista;
- 15 supuestos editables agrupados en `Finanzas`, `Vivienda` y `Obra`;
- fuente común editable con origen `SEEDED_REFERENCE`, `MOCK` o `REAL` ingresado;
- preview ilustrado inmediato;
- gráficos directos de flujo mensual, liquidez/activo y rango económico/probable/conservador;
- orden de etapas editable;
- persistencia validada en `localStorage` mediante `horizonte.content.v1`;
- consumo automático de esos supuestos por el simulador principal;
- undo/redo, reset, importar y exportar JSON con validación;
- navegación móvil entre `Escenario`, `Resultados` y `Datos` para evitar scroll vertical.

## Límite de seguridad

El studio debe desactivarse o protegerse con autorización segura antes de publicar. Ocultarlo no es seguridad. No debe introducir secretos en el JSON exportado.

## Próxima evolución

Agregar draft/published, historial de cambios, fecha/ubicación/unidad/confianza por dato individual, persistencia D1/R2 mediante adapters y protección externa. Mantener el schema versionado para que un import antiguo pueda rechazarse de forma clara.
