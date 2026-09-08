# Investigación de repositorios de referencia

La investigación se limitó a los repositorios oficiales enlazados en la especificación. Se estudió README, estructura visible, arquitectura descrita y licencia. No se copió código.

| Repositorio | Concepto útil | Uso en este proyecto | ¿Reusar código? | Licencia revisada | Decisión |
| --- | --- | --- | --- | --- | --- |
| [pascalorg/editor](https://github.com/pascalorg/editor) | separación `core`/`viewer`/`editor`, schemas y registro de nodos | mantener motor y escena 2.5D desacoplados; futura R3F por capas | no en Fase 0 | MIT | adoptar la frontera conceptual; evitar el peso de un editor BIM |
| [zenghui-li/yuxi](https://github.com/zenghui-li/yuxi) | separación entre configuración, orquestación, conocimiento y permisos | inspirar `/_studio` como superficie separada y config-driven | no | MIT | tomar separación de responsabilidades; no añadir RAG/graph |
| [antvis/Infographic](https://github.com/antvis/Infographic) | sintaxis declarativa, templates y SVG editable | futura capa de explicación para presupuesto/timeline | no | MIT | reservar para explicaciones on-demand; no usar en el primer render |
| [tt-a1i/archify](https://github.com/tt-a1i/archify) | IR tipado, validación y mapas de sistema reproducibles | guiar los diagramas Mermaid y contratos documentales | no | MIT | documentar arquitectura; no introducir CLI adicional en el MVP |
| [cassandra/home-information](https://github.com/cassandra/home-information) | organización espacial y contextual por ubicación | reforzar la escena como contexto de vivienda, no una lista de módulos | no | dual: MIT no comercial / licencia comercial | no copiar; licencia dual impide reutilización comercial sin revisión |
| [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design) | jerarquía editorial, labels accesibles y diagramas sin cajas genéricas | usar líneas, rieles y etiquetas directas en timeline/arquitectura | no | MIT | adoptar principios visuales, no assets |
| [magicuidesign/magicui](https://github.com/magicuidesign/magicui) | componentes copiables y motion puntual | referencia para estados de foco/selección; motion se implementa localmente | no | MIT | evitar catálogo de efectos y dependencia innecesaria |
| [ibelick/motion-primitives](https://github.com/ibelick/motion-primitives) | transiciones de entrada, presencia y layout | inspirar transiciones mínimas de cambio de estado | no | MIT | no añadir dependencia; CSS transitions cubre Fase 0 |

## Principios que sí pasan al MVP

- La escena tiene una representación de estado separada de la UI.
- Los datos y reglas son tipados, serializables y auditables.
- Los diagramas y timelines privilegian lectura directa, líneas de relación y accesibilidad.
- El movimiento solo comunica cambio, selección o avance.

## Principios que se excluyen

- No se importa un editor 3D completo.
- No se añade una plataforma multi-tenant, RAG, grafo de conocimiento o backend pesado.
- No se llena la pantalla con efectos de Magic UI, glassmorphism o tarjetas repetitivas.
