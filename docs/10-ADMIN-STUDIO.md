# Studio local (`/_studio`)

El studio inicial es una ruta local separada que comparte tipos y tokens con el portal. No hay usuarios ni contraseña en Fase 0/1; por eso no se puede considerar una superficie segura para producción.

## Capacidades implementadas

- editar ahorro e ingreso seeded;
- editar mensaje de insight;
- editar labels de timeline;
- reordenar stages con botones arriba/abajo;
- cambiar origen `SEEDED_REFERENCE`/`MOCK`;
- preview inmediato;
- undo/redo;
- reset a defaults;
- importar/exportar JSON con validación.

## Límite de seguridad

El studio debe desactivarse o protegerse con autorización segura antes de publicar. Ocultarlo no es seguridad. No debe introducir secretos en el JSON exportado.

## Próxima evolución

Agregar draft/published, control de cambios, persistencia D1/R2 mediante adapters y protección externa. Mantener el schema versionado para que un import antiguo pueda rechazarse de forma clara.
