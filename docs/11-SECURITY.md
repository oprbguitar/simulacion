# Seguridad y privacidad

- El MVP no pide DNI, historia clínica, ubicación exacta ni cuenta.
- Los escenarios se guardan localmente en memoria; el studio usa localStorage únicamente para draft de dispositivo.
- El import JSON valida tipos, rangos finitos y versión antes de aplicar cambios.
- No se evalúa ni puntúa a una persona; las reglas solo explican el estado simulado.
- No hay API, cookies de sesión, credenciales ni secretos en el bundle inicial.
- `/_studio` es solo prototipo local y debe desactivarse o protegerse externamente antes de una publicación.
- Futuras APIs deberán validar entradas en la frontera, limitar cambios de administración, aplicar rate limiting y separar analítica de perfil.
