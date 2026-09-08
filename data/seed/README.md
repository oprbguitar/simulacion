# Seed local de contenido

La configuración inicial vive en `src/domain/content.ts` para que el prototipo pueda compilar sin red ni base de datos. Esta carpeta queda reservada para extraer posteriormente un JSON versionado con el mismo contrato `ContentConfig`.

Reglas para el seed:

- cada monto o texto debe conservar `origin`, `sourceName`, `sourceUrl` y `capturedAt` cuando exista una fuente;
- los valores `SEEDED_REFERENCE` y `MOCK` deben seguir visibles en el producto;
- cualquier JSON importado pasa por `validateContentConfig` antes de llegar al motor;
- no colocar aquí datos personales ni secretos.
