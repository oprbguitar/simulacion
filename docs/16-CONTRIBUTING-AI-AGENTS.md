# Contribución de agentes

1. Leer `AGENTS.md`, este mapa y la especificación de `referencias/` antes de cambiar la superficie.
2. Mantener el motor puro y evitar fórmulas en componentes.
3. No inventar precios actuales, requisitos legales, dimensiones estructurales ni diagnósticos.
4. Etiquetar cada cifra como `REAL`, `SEEDED_REFERENCE` o `MOCK`.
5. Actualizar documentación cuando cambien UI, reglas, fuentes, arquitectura, seguridad o despliegue.
6. Ejecutar lint, typecheck, tests, build y smoke E2E proporcionalmente.
7. Revisar desktop y móvil con el navegador; no declarar éxito desde el bundle solamente.
8. Preservar cambios no relacionados del usuario y revisar `git diff` antes de cualquier commit.
