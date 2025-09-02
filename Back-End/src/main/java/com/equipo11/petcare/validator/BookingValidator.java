package com.equipo11.petcare.validator;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.booking.BookingStatus;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.model.user.enums.ERole;
import com.equipo11.petcare.service.PetServiceImpl;
import jakarta.validation.ValidationException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * Validador de reglas de dominio para Booking.
 * Mantiene el código limpio y separa responsabilidades del servicio.
 */
@Component
public class BookingValidator {

  private final PetServiceImpl petService;

  public BookingValidator(PetServiceImpl petService) {
    this.petService = petService;
  }

  // --- Validaciones de creación ---
  public void validateBookingRequest(BookingCreateRequest request) {
    validateBookingDates(request.startDateTime(), request.endDateTime());
    validatePetOwnership(request.petId(), request.ownerId());
    validateSitterAvailability(request.sitterId(), request.startDateTime(), request.endDateTime());
  }

  public void validateBookingDates(LocalDateTime startDateTime, LocalDateTime endDateTime) {
    if (startDateTime == null || endDateTime == null) {
      throw new ValidationException("Las fechas de inicio y fin son obligatorias");
    }
    if (startDateTime.isAfter(endDateTime)) {
      throw new ValidationException("La fecha de inicio no puede ser posterior a la fecha de fin");
    }
  }

  public void validatePetOwnership(Long petId, Long ownerId) {
    if (petId == null || ownerId == null) {
      throw new ValidationException("Los identificadores de mascota y propietario son obligatorios");
    }
    if (!petService.belongsToOwner(petId, ownerId)) {
      throw new ValidationException("La mascota no pertenece al propietario indicado");
    }
  }

  public void validateSitterAvailability(Long sitterId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
    if (sitterId == null) {
      throw new ValidationException("El identificador del cuidador es obligatorio");
    }
    // La validación de disponibilidad se delegará al servicio durante la creación
    // Aquí solo verificamos que las fechas sean válidas y presentes (ya validado arriba)
  }

  // --- Validaciones de cambio de estado ---
  public void validateStatusTransition(Booking booking, BookingStatus newStatus, User currentUser) {
    validateStatusChange(booking.getStatus(), newStatus);
    validateUserPermissions(booking, newStatus, currentUser);
    validateStatusSequence(booking.getStatus(), newStatus);
  }

  public void validateStatusChange(BookingStatus currentStatus, BookingStatus newStatus) {
    if (currentStatus == newStatus) {
      throw new ValidationException(
          String.format("La reserva ya se encuentra en estado '%s'", currentStatus.getLabel()));
    }
  }

  public void validateUserPermissions(Booking booking, BookingStatus newStatus, User currentUser) {
    if (isAdmin(currentUser)) {
      return; // Admin puede hacer cualquier transición
    }
    if (isOwner(currentUser)) {
      validateOwnerStatusTransition(booking, newStatus, currentUser);
      return;
    }
    if (isSitter(currentUser)) {
      validateSitterStatusTransition(booking, newStatus, currentUser);
      return;
    }
    throw new AccessDeniedException("No tienes permisos para modificar el estado de la reserva");
  }

  public boolean isAdmin(User user) {
    return hasRole(user, ERole.ROLE_ADMIN);
  }

  public boolean isOwner(User user) {
    return hasRole(user, ERole.ROLE_OWNER);
  }

  public boolean isSitter(User user) {
    return hasRole(user, ERole.ROLE_SITTER);
  }

  public boolean hasRole(User user, ERole role) {
    return user.getRoles().stream().anyMatch(r -> r.getName() == role);
  }

  public void validateOwnerStatusTransition(Booking booking, BookingStatus newStatus, User currentUser) {
    if (!booking.getOwner().getId().equals(currentUser.getId())) {
      throw new AccessDeniedException("Error de permisos: No eres el dueño de esta reserva");
    }
    if (newStatus != BookingStatus.CANCELLED) {
      throw new ValidationException(
          "Como dueño de la reserva, solo puedes cancelarla. No puedes cambiar a otros estados.");
    }
    if (booking.getStatus() != BookingStatus.PENDING && booking.getStatus() != BookingStatus.CONFIRMED) {
      throw new ValidationException(
          "La reserva solo puede cancelarse cuando está en estado 'Pendiente' o 'Confirmada'.");
    }
  }

  public void validateSitterStatusTransition(Booking booking, BookingStatus newStatus, User currentUser) {
    if (!booking.getSitter().getId().equals(currentUser.getId())) {
      throw new AccessDeniedException(
          "No tienes permiso para modificar esta reserva. Solo el cuidador asignado puede realizar cambios.");
    }
    boolean isValidSitterStatus = switch (newStatus) {
      case CONFIRMED, IN_PROGRESS, COMPLETED -> true;
      case PENDING, CANCELLED -> false;
    };
    if (!isValidSitterStatus) {
      String validStates = String.format("%s, %s o %s",
          BookingStatus.CONFIRMED.getLabel(),
          BookingStatus.IN_PROGRESS.getLabel(),
          BookingStatus.COMPLETED.getLabel());
      throw new ValidationException(String.format("Como cuidador, solo puedes cambiar el estado a: %s", validStates));
    }
  }

  public void validateStatusSequence(BookingStatus currentStatus, BookingStatus newStatus) {
    boolean isValidTransition = switch (currentStatus) {
      case PENDING -> newStatus == BookingStatus.CONFIRMED || newStatus == BookingStatus.CANCELLED;
      case CONFIRMED -> newStatus == BookingStatus.IN_PROGRESS || newStatus == BookingStatus.CANCELLED;
      case IN_PROGRESS -> newStatus == BookingStatus.COMPLETED;
      case COMPLETED, CANCELLED -> false;
    };
    if (!isValidTransition) {
      throw new ValidationException(String.format(
          "No se puede cambiar el estado de '%s' a '%s'. Esta transición no está permitida.",
          currentStatus.getLabel(), newStatus.getLabel()));
    }
  }
}
