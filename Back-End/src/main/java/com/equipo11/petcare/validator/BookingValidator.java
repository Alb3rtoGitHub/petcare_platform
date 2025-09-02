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
 * Se encarga de validar todas las reglas de negocio relacionadas con las
 * reservas,
 * incluyendo creación y transiciones de estado.
 */
@Component
public class BookingValidator {

  private final PetServiceImpl petService;

  public BookingValidator(PetServiceImpl petService) {
    this.petService = petService;
  }

  /**
   * Valida una solicitud de creación de reserva completa.
   * 
   * @param request DTO con los datos de la reserva a crear
   * @throws ValidationException si alguna de las validaciones falla
   */
  public void validateBookingRequest(BookingCreateRequest request) {
    validateBookingDates(request.startDateTime(), request.endDateTime());
    validatePetOwnership(request.petId(), request.ownerId());
    validateSitterAvailability(request.sitterId(), request.startDateTime(), request.endDateTime());
  }

  /**
   * Valida que las fechas de la reserva sean coherentes.
   * 
   * @param startDateTime fecha y hora de inicio
   * @param endDateTime   fecha y hora de fin
   * @throws ValidationException si las fechas son nulas o si la fecha de inicio
   *                             es posterior a la de fin
   */
  public void validateBookingDates(LocalDateTime startDateTime, LocalDateTime endDateTime) {
    if (startDateTime == null || endDateTime == null) {
      throw new ValidationException("Las fechas de inicio y fin son obligatorias");
    }
    if (startDateTime.isAfter(endDateTime)) {
      throw new ValidationException("La fecha de inicio no puede ser posterior a la fecha de fin");
    }
  }

  /**
   * Verifica que la mascota pertenezca al propietario indicado.
   * 
   * @param petId   ID de la mascota
   * @param ownerId ID del propietario
   * @throws ValidationException si los IDs son nulos o si la mascota no pertenece
   *                             al propietario
   */
  public void validatePetOwnership(Long petId, Long ownerId) {
    if (petId == null || ownerId == null) {
      throw new ValidationException("Los identificadores de mascota y propietario son obligatorios");
    }
    if (!petService.belongsToOwner(petId, ownerId)) {
      throw new ValidationException("La mascota no pertenece al propietario indicado");
    }
  }

  /**
   * Valida la disponibilidad del cuidador para las fechas solicitadas.
   * 
   * @param sitterId      ID del cuidador
   * @param startDateTime fecha y hora de inicio
   * @param endDateTime   fecha y hora de fin
   * @throws ValidationException si el ID del cuidador es nulo
   */
  public void validateSitterAvailability(Long sitterId, LocalDateTime startDateTime, LocalDateTime endDateTime) {
    if (sitterId == null) {
      throw new ValidationException("El identificador del cuidador es obligatorio");
    }
    // La validación de disponibilidad se delegará al servicio durante la creación
    // Aquí solo verificamos que las fechas sean válidas y presentes (ya validado
    // arriba)
  }

  /**
   * Valida una transición de estado completa para una reserva.
   * 
   * @param booking     reserva a modificar
   * @param newStatus   nuevo estado deseado
   * @param currentUser usuario que intenta realizar el cambio
   * @throws ValidationException   si la transición no es válida
   * @throws AccessDeniedException si el usuario no tiene permisos
   */
  public void validateStatusTransition(Booking booking, BookingStatus newStatus, User currentUser) {
    validateStatusChange(booking.getStatus(), newStatus);
    validateUserPermissions(booking, newStatus, currentUser);
    validateStatusSequence(booking.getStatus(), newStatus);
  }

  /**
   * Verifica que el estado nuevo sea diferente al actual.
   * 
   * @param currentStatus estado actual de la reserva
   * @param newStatus     nuevo estado deseado
   * @throws ValidationException si los estados son iguales
   */
  public void validateStatusChange(BookingStatus currentStatus, BookingStatus newStatus) {
    if (currentStatus == newStatus) {
      throw new ValidationException(
          String.format("La reserva ya se encuentra en estado '%s'", currentStatus.getLabel()));
    }
  }

  /**
   * Valida los permisos del usuario para cambiar el estado de una reserva.
   * 
   * @param booking     reserva a modificar
   * @param newStatus   nuevo estado deseado
   * @param currentUser usuario que intenta realizar el cambio
   * @throws AccessDeniedException si el usuario no tiene permisos suficientes
   */
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

  /**
   * Verifica si el usuario tiene rol de administrador.
   * 
   * @param user usuario a verificar
   * @return true si el usuario es administrador
   */
  public boolean isAdmin(User user) {
    return hasRole(user, ERole.ROLE_ADMIN);
  }

  /**
   * Verifica si el usuario tiene rol de propietario.
   * 
   * @param user usuario a verificar
   * @return true si el usuario es propietario
   */
  public boolean isOwner(User user) {
    return hasRole(user, ERole.ROLE_OWNER);
  }

  /**
   * Verifica si el usuario tiene rol de cuidador.
   * 
   * @param user usuario a verificar
   * @return true si el usuario es cuidador
   */
  public boolean isSitter(User user) {
    return hasRole(user, ERole.ROLE_SITTER);
  }

  /**
   * Verifica si el usuario tiene un rol específico.
   * 
   * @param user usuario a verificar
   * @param role rol a buscar
   * @return true si el usuario tiene el rol especificado
   */
  public boolean hasRole(User user, ERole role) {
    return user.getRoles().stream().anyMatch(r -> r.getName() == role);
  }

  /**
   * Valida las transiciones de estado permitidas para un propietario.
   * 
   * @param booking     reserva a modificar
   * @param newStatus   nuevo estado deseado
   * @param currentUser usuario propietario que intenta realizar el cambio
   * @throws ValidationException   si la transición no está permitida
   * @throws AccessDeniedException si el usuario no es el propietario de la
   *                               reserva
   */
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

  /**
   * Valida las transiciones de estado permitidas para un cuidador.
   * 
   * @param booking     reserva a modificar
   * @param newStatus   nuevo estado deseado
   * @param currentUser usuario cuidador que intenta realizar el cambio
   * @throws ValidationException   si la transición no está permitida
   * @throws AccessDeniedException si el usuario no es el cuidador asignado a la
   *                               reserva
   */
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

  /**
   * Valida que la secuencia de estados sea correcta según las reglas de negocio.
   * 
   * @param currentStatus estado actual de la reserva
   * @param newStatus     nuevo estado deseado
   * @throws ValidationException si la transición de estados no está permitida
   */
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
