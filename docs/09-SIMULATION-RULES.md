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

## Insights auditables

1. `LOW_RESERVE_AFTER_PURCHASE`: reserva < 3 meses y uso de ahorro > 80 %.
2. `FUTURE_STRUCTURAL_CAPACITY`: se planifica ampliar, pero no hay confirmación estructural.
3. `EDUCATION_DEBT_OVERLAP`: un hito familiar/educativo coincide con deuda alta.

Cada regla conserva ID, trigger, mensaje, detalle, sugerencias y origen de supuesto.

## Stress-test

`La vida pasa` aplica únicamente eventos elegidos por el usuario. El prototipo incluye 3 meses sin empleo y gasto médico inesperado. Son escenarios de resiliencia, no predicciones. Los eventos reducen liquidez y/o retrasan hitos de forma determinista.
