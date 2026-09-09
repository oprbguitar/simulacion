# Reglas de simulación

## Estado del mundo

El MVP usa el horizonte 2026–2040, moneda soles y periodo mensual. Es una simulación ilustrativa: no predice ingresos, decisiones ni eventos de una persona.

## Fórmulas

```text
flujoMensual = ingreso - gastoEsencial - costoVivienda - deuda - costoProyecto - eventos
reservaMeses = liquidez / gastoEsencial
patrimonio = activos - obligaciones
costoPartida = metrado × precioUnitario
```

La reserva se limita a cero cuando la liquidez derivada es negativa. Las cifras se redondean para lectura; el motor mantiene números finitos.

## Acciones seeded

- `save-more`: aumenta ahorro proyectado y desplaza el siguiente hito 6 meses.
- `buy-land`: usa una cuota inicial seeded, registra terreno y agenda cimentación.
- `build-first-floor`: registra obra progresiva, reduce liquidez y agenda fases.
- `rent-home`: registra costo recurrente sin convertirlo en patrimonio.
- `keep-family-home`: preserva apoyo habitacional estimado y aumenta ahorro.
- `advance-time` (**Continuar**): avanza 6 meses aplicando el flujo mensual vigente, sin cambiar de camino ni de etapa.
- `protect-reserve` (**Guardar reserva**): pausa el gasto de proyecto, avanza 6 meses acumulando solo flujo positivo y marca `reserveProtected`.

## Vaciado del techo

`setRoofOption` aplica el `costFactor` de la modalidad elegida sobre el pago inicial de construcción y traslada la diferencia entre liquidez y costo de proyecto. Modalidades: preparado en obra (0,92), mixer (1,00), mixer + bomba (1,12) y servicio integral (1,20), con su duración indicativa. El motor **no** dimensiona volúmenes, encofrados ni elementos estructurales: solo estima consecuencias económicas y logísticas de la modalidad de contratación.

## Insights auditables

1. `LOW_RESERVE_AFTER_PURCHASE`: reserva < 3 meses y uso de ahorro > 80 %.
2. `FUTURE_STRUCTURAL_CAPACITY`: se planifica ampliar, pero no hay confirmación estructural.
3. `EDUCATION_DEBT_OVERLAP`: un hito familiar/educativo coincide con deuda alta.

Cada regla conserva ID, trigger, mensaje, detalle, sugerencias y origen de supuesto.

## Stress-test

`La vida pasa` aplica únicamente eventos elegidos por el usuario. El prototipo incluye 3 meses sin empleo y gasto médico inesperado. Son escenarios de resiliencia, no predicciones. Los eventos reducen liquidez y/o retrasan hitos de forma determinista. El interruptor vive junto a la línea de tiempo y abre el panel de imprevistos; su estado activo se deriva de que existan eventos aplicados, no de un flag de UI, para que `deshacer` lo revierta correctamente.

## Presentación de rangos

Ningún costo se muestra como cifra exacta. `costRange` expone económico (`costRangeLowFactor`), probable (base) y conservador (`costRangeHighFactor`), y la UI acompaña cada cifra externa con su insignia de origen `REAL / SEEDED_REFERENCE / MOCK` y la nota de la fuente.
