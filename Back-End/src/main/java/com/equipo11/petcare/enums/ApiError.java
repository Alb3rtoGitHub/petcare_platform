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
  FORBIDDEN_BOOKING_CREATION(HttpStatus.FORBIDDEN,
      "No tienes permisos para crear reservas. Solo los propietarios pueden crear reservas"),
    PET_OVERLAPPING_BOOKING(HttpStatus.CONFLICT, "La mascota ya tiene una reserva programada para este horario");

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
