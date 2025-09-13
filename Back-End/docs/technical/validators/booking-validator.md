# BookingValidator — Documentación Técnica Completa

Este documento describe en detalle el validador de reservas BookingValidator. Incluye su propósito, dependencias, flujo de validación, reglas de negocio, errores que puede lanzar, y ejemplos de uso. No se omite ninguna regla contenida en la implementación actual.

Ubicación del código: src/main/java/com/equipo11/petcare/validator/BookingValidator.java


## Propósito
BookingValidator centraliza todas las reglas de negocio y validaciones necesarias para:
- Crear una reserva (validación de solicitud BookingCreateRequest).
- Cambiar el estado de una reserva existente (transiciones válidas y permisos por rol).

Su objetivo es garantizar coherencia, seguridad y una única fuente de verdad para las reglas de dominio de Booking.


## Dependencias
El validador es un @Component administrado por Spring y usa inyección por constructor (@RequiredArgsConstructor). Depende de:
- PetService (petService)
  - validatePetExists(Long petId)
  - validatePetBelongsToOwner(Long petId, Long ownerId)
- SitterService (sitterService)
  - validateSitter(Long sitterId) — valida existencia (y, según la implementación del servicio, estado/habilitación) del cuidador.
- ServiceEntityService (serviceService)
  - validateServices(List<Long> serviceIds) — valida que todos los servicios existan (y, según reglas del servicio, disponibilidad).

Estas validaciones delegadas permiten que BookingValidator no duplique lógica propia de cada agregado (mascota, cuidador, servicio), manteniendo el principio de responsabilidad única.


## Excepciones utilizadas
- jakarta.validation.ValidationException
  - Se lanza ante violaciones de reglas de negocio o datos de entrada inválidos (fechas, transiciones, campos faltantes, etc.).
- org.springframework.security.access.AccessDeniedException
  - Se lanza cuando el usuario autenticado no tiene permisos para realizar la operación o es nulo (no autenticado).


## Roles y modelo de seguridad
El validador utiliza ERole con los valores:
- ROLE_ADMIN
- ROLE_OWNER
- ROLE_SITTER

Las comprobaciones de rol se realizan con hasRole(User, ERole) recorriendo user.getRoles(). Si el usuario es nulo, se lanza AccessDeniedException con el mensaje: "El Usuario no esta autenticado" (en hasRole) o "El usuario no está autenticado" (en validateBookingRequest) según el punto donde se valide.

Helpers de rol:
- isAdmin(user) — ROLE_ADMIN
- isOwner(user) — ROLE_OWNER
- isSitter(user) — ROLE_SITTER


## API del validador y comportamiento detallado

### 1) validateBookingRequest(BookingCreateRequest request, User currentUser)
Valida íntegramente una solicitud de creación de reserva. Flujo interno:
1. Verifica usuario autenticado (currentUser != null). Si es nulo: AccessDeniedException("El usuario no está autenticado").
2. validateBasicRequirements(request)
   - request != null. Si es nulo: ValidationException("La solicitud no puede ser nula").
   - petId, ownerId y sitterId no nulos. Si falla: ValidationException("Los IDs de mascota, propietario y cuidador son obligatorios").
3. validateBookingDates(request.startDateTime(), request.endDateTime())
   - startDateTime y endDateTime no nulos. Si alguno es nulo: ValidationException("Las fechas de inicio y fin son obligatorias").
   - startDateTime debe ser futura (startDateTime.isBefore(now) está prohibido). Si viola: ValidationException("La fecha de inicio no puede ser anterior a la fecha actual").
   - startDateTime debe ser anterior a endDateTime. Si startDateTime.isAfter(endDateTime): ValidationException("La fecha de inicio no puede ser posterior a la fecha de fin").
4. validateOwnershipAndPermissions(request, currentUser)
   - Si isAdmin(currentUser): petService.validatePetExists(request.petId()); retorno (sin más restricciones de pertenencia/propiedad).
   - Si isOwner(currentUser):
     - petService.validatePetBelongsToOwner(request.petId(), request.ownerId());
     - validateOwnerIsCurrentUser(request.ownerId(), currentUser.getId());
       - Si ownerId != currentUser.id: AccessDeniedException("El propietario no coincide con el usuario autenticado").
     - retorno.
   - Si no es ADMIN ni OWNER: AccessDeniedException("No tienes permisos para crear reservas").
5. validateSitterAndServices(request)
   - sitterService.validateSitter(request.sitterId());
   - serviceService.validateServices(request.serviceIds());

Resultado: si no se lanza excepción, la solicitud es válida para ser procesada por BookingService.

Notas:
- Aunque BookingCreateRequest utiliza anotaciones @NotNull y @Future, el validador refuerza y complementa estas reglas con mensajes de error de negocio consistentes y cheques adicionales (permisos, pertenencia, existencia en BD).


### 2) validateBookingDates(LocalDateTime startDateTime, LocalDateTime endDateTime)
Método público reutilizable que valida coherencia temporal:
- Ambas fechas no nulas.
- startDateTime debe ser futura respecto a LocalDateTime.now().
- startDateTime debe ser anterior estrictamente a endDateTime.

Mensajes exactos:
- "Las fechas de inicio y fin son obligatorias"
- "La fecha de inicio no puede ser anterior a la fecha actual"
- "La fecha de inicio no puede ser posterior a la fecha de fin"


### 3) validateStatusTransition(Booking booking, BookingStatus newStatus, User currentUser)
Valida un cambio de estado para una reserva existente. Flujo interno:
1. validateBasicStatusTransition(booking.getStatus(), newStatus)
   - Prohíbe cambios a mismo estado: ValidationException("La reserva ya está en estado: " + current.getLabel()).
   - Valida transición permitida con isValidTransition(current, newStatus); si no es válida:
     - ValidationException(String.format("No se puede cambiar de '%s' a '%s'", current.getLabel(), newStatus.getLabel())).
2. validateUserPermissionsForStatus(booking, newStatus, currentUser)
   - ADMIN: siempre permitido (retorna).
   - OWNER: validateOwnerStatusChange(booking, newStatus, currentUser)
     - booking.owner.id debe ser el del usuario autenticado; si no: AccessDeniedException("No eres el dueño de esta reserva").
     - Solo puede cancelar (newStatus == CANCELLED); si otro: ValidationException("Los propietarios solo pueden cancelar reservas").
     - Solo cancela si estado actual es PENDING o CONFIRMED; si no: ValidationException("Solo puedes cancelar reservas pendientes o confirmadas").
   - SITTER: validateSitterStatusChange(booking, newStatus, currentUser)
     - booking.sitter.id debe coincidir; si no: AccessDeniedException("No eres el cuidador asignado a esta reserva").
     - Estados permitidos para cuidador: CONFIRMED, IN_PROGRESS, COMPLETED. Si otro: ValidationException("Los cuidadores solo pueden confirmar, iniciar o completar reservas").
   - Otro rol/no autenticado: AccessDeniedException("No tienes permisos para modificar reservas").

Transiciones permitidas exactas (isValidTransition):
- PENDING -> CONFIRMED | CANCELLED
- CONFIRMED -> IN_PROGRESS | CANCELLED
- IN_PROGRESS -> COMPLETED
- COMPLETED -> (ninguna)
- CANCELLED -> (ninguna)


## Métodos privados relevantes
- validateBasicRequirements(BookingCreateRequest)
- validateOwnershipAndPermissions(BookingCreateRequest, User)
- validateSitterAndServices(BookingCreateRequest)
- validateOwnerIsCurrentUser(Long ownerId, Long currentUserId)
- validateBasicStatusTransition(BookingStatus current, BookingStatus newStatus)
- validateUserPermissionsForStatus(Booking, BookingStatus, User)
- validateOwnerStatusChange(Booking, BookingStatus, User)
- validateSitterStatusChange(Booking, BookingStatus, User)
- canOwnerCancel(BookingStatus)
- isValidSitterStatus(BookingStatus)
- hasRole(User, ERole)
- isAdmin(User)
- isOwner(User)
- isSitter(User)


## Integración con el flujo de la aplicación
- Creación (POST /api/v1/bookings)
  - BookingController.addBooking recibe BookingCreateRequest y el email del usuario autenticado via @AuthenticationPrincipal.
  - BookingService.addBooking debe invocar BookingValidator.validateBookingRequest(request, currentUser) antes de persistir.
  - Si la validación pasa, se procede a mapear y guardar la reserva.

- Cambio de estado (PATCH /api/v1/bookings/{id}/status)
  - BookingController.updateBookingStatus recibe BookingStatusRequest y el usuario autenticado.
  - BookingService.updateStatus debe invocar BookingValidator.validateStatusTransition(booking, newStatus, currentUser) antes de aplicar el cambio.


## Mensajes de error exactos
Para facilitar pruebas y aserciones, estos son los mensajes exactos lanzados por el validador:
- "El usuario no está autenticado" (validateBookingRequest)
- "La solicitud no puede ser nula"
- "Los IDs de mascota, propietario y cuidador son obligatorios"
- "Las fechas de inicio y fin son obligatorias"
- "La fecha de inicio no puede ser anterior a la fecha actual"
- "La fecha de inicio no puede ser posterior a la fecha de fin"
- "No tienes permisos para crear reservas"
- "El propietario no coincide con el usuario autenticado"
- "No tienes permisos para modificar reservas"
- "La reserva ya está en estado: {label}"
- "No se puede cambiar de '{labelActual}' a '{labelNuevo}'"
- "No eres el dueño de esta reserva"
- "Los propietarios solo pueden cancelar reservas"
- "Solo puedes cancelar reservas pendientes o confirmadas"
- "No eres el cuidador asignado a esta reserva"
- "Los cuidadores solo pueden confirmar, iniciar o completar reservas"
- En hasRole(user, role): "El Usuario no esta autenticado" (nota: diferencia ortográfica respecto al mensaje principal).


## Casos borde y consideraciones
- Hora exacta actual: si startDateTime es igual al now calculado internamente o anterior, se considera inválido por la regla "debe ser futura". Recomendado agregar margen (p. ej., +1 minuto) en pruebas.
- Diferencia de zona horaria: validateBookingDates usa LocalDateTime.now() del servidor. Si clientes están en otras zonas, asegurarse de enviar timestamps en la zona esperada (o normalizar a UTC en capas superiores).
- serviceIds vacía o nula: BookingCreateRequest declara @NotNull para serviceIds; además, serviceService.validateServices(...) es responsable de validar contenido no vacío y existencia. Si se desea validar no vacío explícitamente aquí, debería añadirse en futuras iteraciones.
- Coherencia ownerId/mascota: Para OWNER, además de pertenencia de la mascota, se exige que ownerId == currentUser.id. Esto evita que un OWNER cree reservas a nombre de otro.
- ADMIN: puede crear reservas para cualquier mascota existente (solo se valida existencia de la mascota), sin restricción de pertenencia.
- SITTER no puede crear reservas en nombre de otros; si intenta, recibirá AccessDeniedException en validateOwnershipAndPermissions.
- Cambios de estado repetidos: si se intenta cambiar al mismo estado, se rechaza explícitamente.
- Estados terminales: COMPLETED y CANCELLED son terminales; no admiten más transiciones.


## Ejemplos de uso

### Ejemplo: validación de creación (OWNER)
- currentUser: ROLE_OWNER con id=2
- request: ownerId=2, petId=1 (pertenece al owner 2), sitterId=1, serviceIds=[3], startDateTime=futuro, endDateTime=futuro posterior.
- Resultado: válido, asumiendo que sitter y servicios existen.

### Ejemplo: validación de creación (ADMIN)
- currentUser: ROLE_ADMIN (id cualquiera)
- request: ownerId=5, petId=10 (existe), sitterId=1, serviceIds=[3], fechas válidas.
- Resultado: válido; no se verifica pertenencia de la mascota al owner, solo existencia de la mascota.

### Ejemplo: cancelación por OWNER
- booking.status = CONFIRMED
- currentUser: ROLE_OWNER con id igual al owner del booking
- newStatus: CANCELLED
- Resultado: permitido.

### Ejemplo: transición inválida
- booking.status = IN_PROGRESS
- newStatus = CANCELLED
- Resultado: ValidationException("No se puede cambiar de 'En progreso' a 'Cancelada'") — asumiendo getLabel() retorna etiquetas en español correspondientes.


## Recomendaciones de pruebas
- Unit tests para cada mensaje de error y transición válida/ inválida.
- Tests parametrizados para isValidTransition.
- Tests por rol (ADMIN, OWNER, SITTER) cubriendo caminos felices y de error.
- Tests de fecha usando Clock inyectable o utilidades para controlar "ahora" y evitar flakiness.


## Posibles mejoras futuras (no implementadas actualmente)
- Unificar mensajes de autenticación (acentos/ortografía) entre hasRole y validateBookingRequest.
- Validar que serviceIds no esté vacío directamente en el validador, además de existir.
- Añadir reglas de disponibilidad del sitter/servicios en la ventana temporal (overbooking), en coordinación con BookingService/Repositorio.
- Externalizar mensajes a un catálogo i18n para internacionalización.


## Resumen
BookingValidator aplica reglas de negocio clave para la creación y gestión de estados de las reservas, controlando coherencia temporal, pertenencia de mascotas, existencia de recursos relacionados y permisos basados en roles. Sus excepciones y mensajes claros facilitan tanto el diagnóstico de errores como la construcción de pruebas automatizadas.