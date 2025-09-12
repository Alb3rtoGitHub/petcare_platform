package com.equipo11.petcare.enums;

import org.springframework.http.HttpStatus;

public enum ApiError {
    RESOURCE_NOT_FOUND(HttpStatus.NOT_FOUND, "El recurso solicitado no fue encontrado"),
    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "La solicitud contiene datos inválidos"),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "No autorizado para realizar esta operación"),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Error interno del servidor"),
    DUPLICATE_RESOURCE(HttpStatus.CONFLICT, "El recurso ya existe"),
    VALIDATION_ERROR(HttpStatus.BAD_REQUEST, "Error de validación en los datos"),
    CARETAKER_UNAVAILABLE(HttpStatus.CONFLICT, "El cuidador no está disponible en el horario seleccionado"),
    PET_WITH_EXISTING_BOOKING(HttpStatus.CONFLICT, "La mascota ya tiene una reserva en el horario seleccionado"),
    REVIEW_SAVE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "Error al guardar la reseña"),
    BOOKING_NOT_FOUND(HttpStatus.NOT_FOUND, "La reserva buscada no existe"),
    BOOKING_NOT_COMPLETED(HttpStatus.UNPROCESSABLE_ENTITY, "la reserva no esta completada, no puede calificar"),
    REVIEW_ALREADY_EXIST(HttpStatus.CONFLICT, "la reserva ya cuenta con una reseña"),
    COUNTRY_NOT_FOUND(HttpStatus.NOT_FOUND, "País no encontrado"),
    REGION_NOT_FOUND(HttpStatus.NOT_FOUND, "Región/Provincia no encontrada/o"),
    CITY_NOT_FOUND(HttpStatus.NOT_FOUND, "Ciudad no encontrada"),
    EMAIL_ALREADY_IN_USE(HttpStatus.CONFLICT, "Se intentó registrar un email que ya existe"),
    ROLE_NOT_ALLOWED(HttpStatus.FORBIDDEN, "No tiene permiso para crear un usuario con el rol"),
    ROLE_NOT_FOUND(HttpStatus.NOT_FOUND, "El rol solicitado no existe"), 
    INVALID_ROLE(HttpStatus.BAD_REQUEST, "El rol solicitado no existe"),
    TOKEN_NOT_FOUND(HttpStatus.NOT_FOUND, "El token de verificacion no encontrado"),
    TOKEN_EXPIRED(HttpStatus.UNAUTHORIZED, "El token enviado está expirado"),
    EMAIL_DELIVERY_FAILED(HttpStatus.SERVICE_UNAVAILABLE, "No se pudo enviar el email de verificación"),
    PET_LIST_EMPTY(HttpStatus.BAD_REQUEST, "No se enviaron mascotas para guardar"),
    PET_NOT_FOUND(HttpStatus.NOT_FOUND, "Mascota no encontrada"),
    USER_HAS_NO_PETS(HttpStatus.NOT_FOUND, "No hay mascotas para el usuario"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "Usuario no encontrado"),
    PET_NOT_OWNED_BY_USER(HttpStatus.FORBIDDEN, "La mascota no pertenece a ese usuario"),
    CLAIM_NOT_FOUND(HttpStatus.NOT_FOUND, "Reclamo no encontrado"),
    CLAIM_OWNER_MISMATCH(HttpStatus.UNAUTHORIZED, "No puedes crear un reclamo para servicio no vinculado");


    private final HttpStatus httpStatus;
    private final String message;

    ApiError(HttpStatus httpStatus, String message) {
        this.httpStatus = httpStatus;
        this.message = message;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }

    public String getMessage() {
        return message;
    }
}