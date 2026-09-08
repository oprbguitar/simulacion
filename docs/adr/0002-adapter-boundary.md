# ADR 0002: frontera de adapters

## Contexto

La especificación contempla D1, R2 y fuentes oficiales, pero el MVP no requiere red ni persistencia.

## Decisión

Mantener contenido y simulación en contratos serializables, y postergar implementaciones de repositorio/adapters hasta que exista una fuente o workflow real.

## Consecuencias

La UI no queda acoplada a una base concreta. La publicación futura requiere agregar seguridad, snapshots y control de freshness, no reescribir el motor.
