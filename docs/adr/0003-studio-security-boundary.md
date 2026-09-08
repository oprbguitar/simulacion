# ADR 0003: límite de seguridad del studio

## Contexto

El prototipo requiere edición local sin usuario/contraseña.

## Decisión

Implementar `/_studio` como editor local de configuración, con import/export validado y una advertencia explícita de que no es una barrera de seguridad.

## Consecuencias

La experiencia de edición se puede probar sin backend. Antes de producción se debe desactivar o proteger con autorización real y separar draft de published.
