# Expediente de vida (Perú)

Documentación de la superficie principal de Horizonte: qué se construyó, con qué,
cómo se usa y bajo qué reglas se decidió cada cosa.

## 1. Qué se hizo y por qué

La versión anterior era un simulador de una sola pantalla con cifras inventadas
(`SEEDED_REFERENCE`) y sin enlaces: mostraba «S/ 35,000 de construcción» sin decir
de dónde salía ese número ni qué compraba. Un monto así no alcanza para nada y el
simulador no daba forma de comprobarlo.

El expediente reemplaza esa lógica por otra:

1. **Ningún número sin origen.** Cada cifra declara si es `OFICIAL`, `REGULADO`,
   `MERCADO`, `TECNICO` o `ESTIMADO`, y lleva el enlace a la entidad donde se
   verifica, con la fecha en que se comprobó que ese enlace responde.
2. **Separar metrado de precio.** Cuánto cemento entra en un m² es una constante
   de ingeniería. Cuánto cuesta hoy una bolsa es un precio de mercado que cambia
   varias veces al año. Publicar solo el producto de ambos esconde cuál de los dos
   está desactualizado.
3. **El ciclo completo, no solo la vivienda.** Adquirir el predio, construir por
   etapas, tener hijos, vacunarlos, educarlos, trabajar, pagar impuestos y
   aguantar imprevistos son el mismo flujo de caja.
4. **Rangos, no promedios disfrazados.** Todo monto de mercado se guarda como
   mínimo–típico–máximo y se muestra como rango.

## 2. Estructura

```
src/domain/life/
  tipos.ts            Contrato de datos: Origen, Fuente, Monto, Tramite, FaseObra…
  fuentes.ts          Registro único de fuentes verificadas (una URL, un lugar)
  motor.ts            Proyección determinista a 10 / 20 / 30 años + diagnósticos
  catalogo/
    vivienda.ts       Rutas de acceso, trámites, alcabala, crédito hipotecario
    construccion.ts   10 fases, metrados, dosificaciones, precios de materiales
    servicios.ts      Consumos de referencia y tarifas reguladas
    familia.ts        Preconcepción → gestación → parto → vacunas → CRED → crianza
    educacion.ts      Inicial, primaria, secundaria, superior; público vs privado
    trabajo.ts        Planilla, honorarios, NRUS, RER, RMT; renta y aportes
    imprevistos.ts    Ocho eventos con su vía institucional de respuesta

src/expediente/
  Expediente.tsx      Shell: índice fijo + documento
  Controles.tsx       Formulario del perfil (sección 00)
  formato.ts          Formato de moneda
  piezas.tsx          Componentes compartidos (Cifra, Fuentes, TablaCostos…)
  secciones/          Una por módulo del expediente
src/expediente.css    Sistema visual completo de la superficie
```

Las tres rutas de la aplicación:

| Ruta | Qué es |
| --- | --- |
| `/` | Expediente de vida (superficie principal) |
| `/_legacy` | Simulador de una pantalla anterior, conservado |
| `/_studio` | Editor de los supuestos del simulador anterior |

## 3. Tecnologías

React 19 + TypeScript 6 + Vite 8, `motion` para las transiciones del simulador
heredado, Vitest para unidad y Playwright para extremo a extremo. Sin dependencias
de gráficos: el gráfico de 30 años son barras CSS con `<button>` accesibles.
Todo corre en el navegador: no hay servidor ni envío de datos.

## 4. Cómo se usa

1. **Sección 00 — Tu punto de partida.** Edad, región, ingreso, cómo se genera
   ese ingreso, ahorro, gasto esencial, horizonte. Todo lo demás se recalcula.
2. **01 Adquirir la propiedad.** Se elige la ruta (terreno, casa, departamento,
   alquiler, familia). Muestra los trámites en orden con lo que piden en cada uno,
   el alcabala calculado, la capacidad de endeudamiento y el interés total del
   crédito.
3. **02 Construir.** Costo por m², cantidades de material para el área que se
   puso, dosificaciones de concreto y las diez fases desplegables con su metrado,
   su trámite y su norma.
4. **03 Traer un hijo al mundo.** Las seis etapas, el esquema de vacunación
   completo del MINSA (gratuito en el Estado, con referencia privada al costado),
   el calendario CRED, la crianza y los cuatro niveles educativos.
5. **04 Habitar la casa.** Consumos de referencia y boletas estimadas.
6. **05 De dónde sale el ingreso.** Los cinco modos, con lo que descuentan, lo
   que protegen y lo que exponen; los tramos del impuesto a la renta.
7. **06 Lo que el plan no contempla.** Ocho imprevistos activables. Al activarlos
   la proyección cambia y el índice lateral lo refleja.
8. **07 Los próximos años.** Barra por año; al hacer clic se abre el desglose y
   los hitos de ese año.
9. **08 De dónde sale cada dato.** Todas las fuentes, ordenadas por entidad.

## 5. Reglas del motor

- **Determinista.** El mismo perfil produce siempre el mismo resultado. Los
  imprevistos no se sortean: se activan y se colocan en un año fijo, para poder
  comparar el mismo escenario con y sin el golpe.
- **Anual.** El paso es el año. El crédito sí se amortiza mes a mes dentro del año
  para que el interés sea correcto.
- **El desembolso de compra entra una sola vez**, por el flujo del año elegido.
- **Los servicios del hogar empiezan cuando hay dónde habitar**, no antes: comprar
  un terreno no resuelve dónde dormir, y hasta que la casa sea habitable el hogar
  sigue pagando alojamiento.
- **La casa se considera habitable al terminar las instalaciones.** Los acabados
  se pueden seguir haciendo viviendo adentro; esa es la palanca real de la
  construcción progresiva.
- **Diagnósticos explícitos.** Cada alerta lleva su identificador (`AHORRO_NEGATIVO`,
  `CUOTA_SOBRE_TERCIO`, `CAPACIDAD_ESTRUCTURAL_FUTURA`…) y una palanca concreta.
  No hay puntaje oculto.

## 6. Límites declarados

- **No dimensiona elementos estructurales.** Los metrados sirven para presupuestar,
  no para construir. El dimensionamiento lo define un proyecto estructural firmado
  por un profesional colegiado y habilitado.
- **Los precios de material son referencias de Lima 2026** y se mueven varias veces
  al año. Cada fila lleva su enlace para verificar el precio del día.
- **Las probabilidades de los imprevistos son referencias gruesas**, no cálculos
  sobre un caso concreto. Lo verificable de esa sección es la vía institucional.
- **La UIT (S/ 5,500) y la RMV (S/ 1,130) cambian por norma.** Están en
  `catalogo/vivienda.ts` y `catalogo/trabajo.ts` como constantes de un solo lugar.
- **Los topes de MIVIVIENDA y Techo Propio se actualizan por resolución** y no se
  fijan aquí: el expediente enlaza al programa en vez de copiar un monto que
  caduca.

## 7. Mantenimiento

- **Una URL rota se corrige en `fuentes.ts` y en ningún otro lugar.** Ningún módulo
  escribe direcciones sueltas. Al corregirla, se actualiza `VERIFICADO`.
- Para revisar que las fuentes siguen vivas basta con pedir cada URL del registro
  y comprobar que responde 200. Las que no respondieron nunca entraron.
- Al cambiar de año fiscal: UIT, RMV, tramos de renta y los Valores Unitarios
  Oficiales de Edificación.
- Los precios de materiales se actualizan con el índice del INEI antes que
  recotizando uno por uno.

## 8. Pruebas

- `npm test` — 40 pruebas de unidad sobre el motor y el catálogo: cuota francesa,
  alcabala, tramos de renta, metrados, participación de fases, determinismo,
  amortización, alertas, integridad del esquema de vacunación y del registro de
  fuentes.
- `npm run test:e2e` — 10 pruebas del expediente (más las del simulador heredado)
  en escritorio y móvil: secciones presentes, sin desborde horizontal, ningún texto
  por debajo de 12 px, despliegue de fases, recálculo de materiales, esquema de
  vacunación completo, imprevistos, gráfico de años, índice de fuentes y menú móvil.

## 9. Dirección visual

Asignada por el harness (`design-pick`) y registrada en `DESIGN-HISTORY.json`:

- Arquetipo **índice fijo + documento**: TOC persistente, secciones numeradas, la
  tipografía es la estructura.
- Tipografía **Archivo / Public Sans / JetBrains Mono**. El monoespaciado es para
  cifras, códigos y etiquetas de metadato; nunca para texto corrido.
- Paleta **carbon + lima**: tinta `#191B18`, superficie `#F6F7F3`, acento
  `#74B816`, apoyo `#4263EB`. El acento marca cifra, estado y acción; nunca es
  fondo decorativo.
- Geometría suave, radios de 4–6 px. Motion seco, 140 ms, solo estado y foco.
- Piso tipográfico de 12 px, verificado por prueba automatizada.
- Responsive en 360 / 768 / 1280 / 1600. Por debajo de 900 px el índice se
  convierte en un menú desplegable.
