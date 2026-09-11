# La Ruta — la superficie jugable

Documentación de la superficie principal (`/`): qué es, para quién, cómo está
hecha y qué decisiones de diseño la sostienen.

## 1. El problema que resuelve

El expediente (`/_expediente`) tenía la información correcta y la presentación
equivocada para su público. Era un documento: nueve secciones numeradas, tablas
densas, tipografía como estructura. Excelente para consultar, imposible de
recorrer para alguien de 14 a 16 años.

La Ruta usa **exactamente el mismo motor y el mismo catálogo** y cambia la forma
de entrar: en vez de leer, juegas. Ninguna cifra se perdió — se movió a un cajón
que se abre cuando la quieres.

## 2. Las reglas del tablero

1. **Una decisión grande por banda.** Cada capítulo de la vida pregunta una sola
   cosa y la responde con cartas del tamaño de la mano, no con un formulario.
2. **La consecuencia se ve al instante.** El marcador de arriba reacciona con
   contadores de resorte y una ficha de variación; debajo de las cartas aparece
   una frase que dice qué acabas de provocar.
3. **Tres cifras por banda, no treinta.** Lo demás está en el cajón.
4. **El detalle nunca se pierde.** Cada banda tiene un botón que abre el cajón
   con la sección completa del expediente: tablas, trámites, requisitos y las 42
   fuentes verificadas con su enlace.
5. **Se puede deshacer.** Probar una ruta y volver atrás es parte del juego.

## 3. Las bandas

| # | Banda | Qué se decide | Qué se juega |
| --- | --- | --- | --- |
| — | Portada | — | La escena en corte con parallax de puntero y la promesa: 30 años por delante |
| 01 | Tu punto de partida | Quién eres | Tres arranques reconocibles con ilustración, más la región |
| 02 | ¿Dónde vas a vivir? | Ruta de acceso a la vivienda | Cinco cartas con las ilustraciones del proyecto |
| 03 | Construir de a pocos | Tamaño, acabado y **años de obra** | Una palanca que reparte el costo y una tira de diez etapas desplegables |
| 04 | ¿Y si tienes hijos? | Cuántos y qué colegio | **El tablero de vacunas**: 29 casillas por tramo de edad, cada una explica de qué protege y qué costaría fuera del Estado |
| 05 | La casa cobra todos los meses | — | Tres cifras y el salto a las tarifas reguladas |
| 06 | ¿De qué vives? | Régimen de ingreso | Cinco fichas tipo personaje con tres barras: red, libertad y techo |
| 07 | Y entonces la vida se mete | Qué imprevistos activar | Ocho naipes que se voltean y golpean la proyección |
| 08 | Tu ruta, año por año | — | El mapa: una casilla por año, hitos con glifo y una ficha que camina |
| — | Cierre | — | El patrimonio final, volver a empezar y la puerta al expediente |

## 4. Las tres barras de los regímenes

En la banda de trabajo, cada régimen muestra «red que te sostiene», «libertad
para moverte» y «hasta dónde puede crecer» en una escala de 1 a 5. **No es una
métrica calculada**: es una lectura editorial de lo que el catálogo ya dice en
palabras, puesta en una escala para poder comparar de un vistazo. Está declarado
en pantalla y en el código (`src/ruta/bandas/Trabajo.tsx`). El descuento mensual
que aparece al pie de cada ficha sí sale del cálculo real.

## 5. Estructura

```
src/ruta/
  Ruta.tsx        Contenedor: estado del perfil, historial para deshacer, bandas
  Hud.tsx         Marcador pegajoso con contadores animados
  piezas.tsx      Banda, Carta, Ficha, Bulto, Cajón, Consecuencia
  formato.ts      Moneda
  bandas/         Partida, Terreno, Obra, Familia, Trabajo, Cartas, Mapa
src/ruta.css      Sistema visual de la superficie
```

El dominio (`src/domain/life/`) no se tocó: La Ruta y el expediente son dos
lecturas de los mismos datos.

## 6. Los cajones

`Cajon` monta secciones del expediente tal cual (`SeccionVivienda`,
`SeccionConstruccion`, `SeccionFamilia`, `SeccionServicios`, `SeccionTrabajo`,
`SeccionImprevistos`, `SeccionProyeccion`, `SeccionFuentes`).

Para que funcionen fuera de su superficie, `expediente.css` se partió: los tokens
y la tipografía viven en un selector compartido por `.ex-shell` y
`.rt-cajon-cuerpo`; la rejilla de dos columnas y el `100dvh` se quedaron solo en
`.ex-shell`. Dentro del cajón se oculta la cabecera de sección porque el cajón ya
aporta su propio título.

## 7. Ilustraciones

Se reutilizan las siete piezas de acuarela que ya estaban en `public/assets/`
(395 kB en WebP). Parte vienen con alfa y parte sobre fondo blanco, así que las
figuras de cabecera de banda llevan un panel blanco con sombra: la mezcla se lee
como una decisión —una estampa pegada sobre el color— y no como un recorte mal
hecho.

- `horizonte-life-scene-v1` — fondo de la portada, con parallax de puntero
- `path-family`, `path-land`, `path-none`, `path-renting` — cartas de vivienda y arranques
- `action-build` — cabecera de la banda de obra
- `action-save` — cabecera de la banda de trabajo

## 8. Movimiento

Todo con `motion` (ya instalado, ~8 kB) y las primitivas que ya existían en
`src/motion/`: `AnimatedNumber` para el marcador, `DeltaChip` para la variación,
`usePointerParallax` para la portada. No se añadió ninguna dependencia nueva:
para un tablero hacen falta resortes, animación por scroll y `layoutId`, y eso ya
estaba cubierto.

Las bandas y las piezas entran con `whileInView` y `viewport={{ once: true,
margin: '200px' }}` — el margen las dispara algo antes de asomar para que un
bloque más alto que la pantalla no deje contenido invisible. Todo se apaga con
`prefers-reduced-motion`.

## 9. Rutas

| Ruta | Superficie |
| --- | --- |
| `/` | La Ruta — el recorrido jugable |
| `/_expediente` | El documento completo con las 42 fuentes |
| `/_legacy` | El simulador de una pantalla anterior |
| `/_studio` | Editor de los supuestos del simulador anterior |

## 10. Pruebas

`tests/e2e/ruta.spec.ts` — 11 pruebas en escritorio y móvil: portada, las ocho
bandas, elegir arranque y ver cambiar el marcador, la palanca de años, el tablero
de vacunas completo (29 casillas) con su detalle, voltear un naipe, caminar el
mapa, abrir y cerrar el cajón con Escape verificando que trae los enlaces
oficiales, deshacer, ausencia de desborde horizontal y el piso de 12 px.

## 11. Dirección visual

Asignada por el harness en modo `experience` y registrada en
`DESIGN-HISTORY.json`:

- Arquetipo **bandas a sangre contrastadas**. Nada de hero + tres tarjetas.
- Tipografía **Work Sans** (títulos) / **Manrope** (cuerpo) / JetBrains Mono.
- Paleta **acero + verde eléctrico**: tinta `#161A1D`, superficie `#F2F4F5`,
  acento `#2F9E44`, apoyo `#1971C2`.
- Geometría recta, 0–2 px. Motion continuo, 220 ms.
- **Los colores de banda son señalización de capítulo, no adorno**: noche,
  océano, selva, tierra y ocre te dicen en qué parte de la vida estás. El acento
  verde queda reservado para acción y estado.
- Piso tipográfico de 12 px, verificado por prueba automatizada.
- Responsive en 360 / 768 / 1280 / 1600. Por debajo de 820 px el marcador suelta
  el «horizonte» y por debajo de 560 px también «cuesta construir»: en pantalla
  chica se quedan las dos cifras que deciden algo.

## v0.9 — Recorrido horizontal, nombre, modos y descarga

- **Pantallas**: `src/ruta/pasos.ts` define las diez pantallas. `Ruta.tsx` muestra una a la vez con `AnimatePresence` (deslizamiento lateral, respetando `prefers-reduced-motion` vía `MotionConfig`). Flechas laterales fijas, botones al pie y teclas ← → (ignoradas mientras se escribe o hay un cajón abierto).
- **Línea de tiempo**: vive en `Hud.tsx`. Un paso queda sombreado si se decidió algo en él, si ya se pasó por él o si se aplicó un modo.
- **Modos** (`src/ruta/modos.ts`): Relajado y Equilibrado son presets; Pro busca por fuerza bruta sobre el motor la combinación con más patrimonio final sin alertas críticas. Respetan el punto de partida y los hijos.
- **Sesión** (`src/ruta/sesion.ts`): nombre y perfil en `localStorage` (`horizonte:ruta:v1`). El expediente en pantalla los lee al abrir.
- **Descarga** (`src/expediente/descarga.tsx` + `Documento.tsx`): `renderToStaticMarkup` del documento completo con el CSS del expediente incrustado; se carga bajo demanda para no pesar en la primera visita.
- **Plegables**: `PlegadoContext` (en `src/expediente/contexto.ts`) lo activa el `Cajon`; `Seccion` agrupa sus hijos por cada `<h3>` en `<details>`. Fuera del cajón todo se muestra corrido.
