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
    REVIEW_ALREADY_EXIST(HttpStatus.CONFLICT, "la reserva ya cuenta con una reseña");


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