# Despliegue

## Estado

El sitio se publica como estático en Vercel desde el repositorio `oprbguitar/simulacion`. El dominio de destino es `simulacion.amauta.online`.

## Qué se publica

`npm run build` produce `dist/` (~1 MB): `index.html`, un CSS, un JS y las ilustraciones WebP de `public/assets`. No hay backend, no hay base de datos y no hay secretos: el motor de simulación es TypeScript puro que corre en el navegador.

## Configuración

`vercel.json` fija el build (`npm run build` → `dist`), reescribe `/_studio` a `index.html` para que la ruta funcione al entrar directamente, y marca `/assets/*` como inmutable durante un año.

## Imágenes

Las ilustraciones fuente en PNG pesaban 12,5 MB y no deben publicarse. `scripts/optimize-assets.mjs` las convierte a WebP (395 kB en total, 97 % menos) leyendo de `assets-src/` —ignorada por git— y escribiendo en `public/assets/`. Los PNG originales siguen recuperables del historial hasta el commit `c47db07`. Para regenerarlas:

```bash
node scripts/optimize-assets.mjs
```

`public/og-horizonte.jpg` (1200×630) es la tarjeta social en JPEG, porque varios lectores de enlaces no resuelven WebP.

## Dominio

Vercel entrega primero una URL `*.vercel.app`. Para servir `simulacion.amauta.online` hay que asignar el dominio al proyecto en el panel (Project → Settings → Domains) y crear en el DNS del registrador:

| Nombre | Tipo | Valor |
| --- | --- | --- |
| `simulacion` | `CNAME` | `cname.vercel-dns.com` |

Al ser un subdominio basta un `CNAME`; el registro `A` de `76.76.21.21` sólo hace falta si algún día se sirve también el ápice `amauta.online`. Vercel emite el certificado TLS al validar el registro y el sitio queda en `https://simulacion.amauta.online`. Si el DNS está en Cloudflare, el registro debe quedar en **DNS only** (nube gris), no proxiado: con el proxy activo Vercel no puede validar el dominio ni emitir el certificado.

## Sobre `/_studio`

El Studio queda accesible en producción. No es una barrera de seguridad y no hace falta que lo sea: no hay servidor, no hay datos de otras personas y todo lo que edita se guarda en el `localStorage` de quien lo abre. Si en el futuro aparece una API con datos reales, la ruta debe protegerse antes de conectarla.

## Antes de anunciar una URL

1. `npm run build`, `npm test` y `npm run test:e2e` en verde.
2. `node ../AI-Design-Harness/bin/design-lint.mjs .` en APROBADO.
3. Comprobar en la URL real: assets, `/_studio`, tarjeta social y responsive a 360 px.
