# Ejemplo para crear una reserva (POST /api/v1/bookings)

Este endpoint crea una reserva nueva. El email NO va en el JSON. El controlador obtiene el email del usuario autenticado a través del token JWT (@AuthenticationPrincipal), no del cuerpo de la petición.

- URL: /api/v1/bookings
- Método: POST
- Content-Type: application/json
- Autenticación: Bearer Token (JWT) en el header Authorization
- Roles permitidos: ADMIN, OWNER

## Cuerpo JSON de ejemplo

```
{
  "ownerId": 2,
  "sitterId": 1,
  "petId": 1,
  "serviceIds": [3],
  "startDateTime": "2025-09-11T10:00:00",
  "endDateTime": "2025-09-12T12:00:00",
  "specialInstructions": "No darle pollo"
}
```

Importante:
- No agregues campo `email` en el JSON. El backend toma el email del usuario autenticado (token JWT) y lo usa para cargar al usuario actual.
- Si el usuario autenticado tiene rol OWNER, su ID debe coincidir con `ownerId` y la mascota (`petId`) debe pertenecer a ese owner.
- Si tiene rol ADMIN, puede crear la reserva para cualquier owner y mascota válida.

## Validaciones clave (BookingValidator)
- `petId`, `ownerId`, `sitterId` obligatorios.
- `serviceIds` debe contener IDs de servicios existentes.
- `startDateTime` y `endDateTime` deben ser futuras y `startDateTime` < `endDateTime`.
- El sitter (`sitterId`) debe existir y estar habilitado según reglas del servicio.
- Permisos:
  - ADMIN: sin restricciones de pertenencia.
  - OWNER: la mascota debe pertenecer al owner y `ownerId` debe coincidir con el usuario autenticado.

## Ejemplo cURL

Reemplaza `TU_TOKEN_JWT` por un token válido y ajusta los IDs a registros existentes en tu BD.

```
curl -X POST "http://localhost:8080/api/v1/bookings" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "ownerId": 2,
    "sitterId": 1,
    "petId": 1,
    "serviceIds": [3],
    "startDateTime": "2025-09-11T10:00:00",
    "endDateTime": "2025-09-12T12:00:00",
    "specialInstructions": "No darle pollo"
  }'
```

## Postman / Insomnia
- Body: raw JSON con el contenido anterior.
- Headers:
  - `Content-Type: application/json`
  - `Authorization: Bearer TU_TOKEN_JWT`

## Notas
- El parámetro `@AuthenticationPrincipal String email` del controlador corresponde al email del usuario autenticado que el framework inyecta desde el contexto de seguridad. No es un campo del JSON.
- Si recibes 403 o 401, verifica que el token sea válido, que el rol sea el adecuado y que `ownerId` coincida con el usuario (cuando rol es OWNER).
