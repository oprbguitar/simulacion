# Despliegue

## Fase actual

Prototipo local con Vite. No se ha publicado ni se han creado recursos externos. Esto preserva la frontera de autorización: la solicitud adjunta pide un runnable prototype, no un despliegue público.

## Preparación futura

1. `npm run build` debe pasar.
2. Revisar `/_studio` y desactivarlo o ponerlo detrás de Cloudflare Access.
3. Elegir hosting estático o Worker según necesidad de API.
4. Mantener secretos en el proveedor, nunca en el repositorio.
5. Verificar la URL pública real, assets, headers, rutas y fallback antes de anunciarla.

Sites se consideró, pero no se activó la publicación en esta fase por requerir una acción externa explícita.
