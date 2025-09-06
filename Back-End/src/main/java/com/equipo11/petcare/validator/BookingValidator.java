package com.equipo11.petcare.validator;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.booking.BookingStatus;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.model.user.enums.ERole;
import com.equipo11.petcare.service.PetService;
import com.equipo11.petcare.service.ServiceEntityService;
import com.equipo11.petcare.service.SitterService;
import jakarta.validation.ValidationException;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class BookingValidator {
  private final PetService petService;
  private final SitterService sitterService;
  private final ServiceEntityService serviceService;

  /**
   * Valida una solicitud de creación de reserva completa.
   * 
   * @param request DTO con los datos de la reserva a crear
   * @throws ValidationException si alguna de las validaciones falla
   */
  public void validateBookingRequest(BookingCreateRequest request, User currentUser) {

    validateBasicRequirements(request);
    validateBookingDates(request.startDateTime(), request.endDateTime());
    validateOwnershipAndPermissions(request, currentUser);
    validateSitterAndServices(request);

    // validateServiceExits(request.serviceId());
  }

  // validaciones básicas
  private void validateBasicRequirements(BookingCreateRequest request) {
    if (request == null) {
      throw new ValidationException("La solicitud no puede ser nula");
    }
    if (request.petId() == null || request.ownerId() == null || request.sitterId() == null) {
      throw new ValidationException("Los IDs de mascota, propietario y cuidador son obligatorios");
    }
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
    LocalDateTime now = LocalDateTime.now();
    if (startDateTime.isBefore(now)) {
      throw new ValidationException("La fecha de inicio no puede ser anterior a la fecha actual");
    }
    if (startDateTime.isAfter(endDateTime)) {
      throw new ValidationException("La fecha de inicio no puede ser posterior a la fecha de fin");
    }
  }

  private void validateOwnershipAndPermissions(BookingCreateRequest request, User currentUser) {
    // Para administradores
    if (isAdmin(currentUser)) {
      petService.validatePetExists(request.petId());
      return;
    }

    // Para propietarios
    if (isOwner(currentUser)) {
      petService.validatePetBelongsToOwner(request.petId(), request.ownerId());
      validateOwnerIsCurrentUser(request.ownerId(), currentUser.getId());
      return;
    }

    throw new AccessDeniedException("No tienes permisos para crear reservas");

  }

  // validaciones de cuidador y servicios
  private void validateSitterAndServices(BookingCreateRequest request) {
    sitterService.validateSitter(request.sitterId());
    serviceService.validateServices(request.serviceIds());
  }

  private void validateOwnerIsCurrentUser(Long ownerId, Long currentUserId) {
    if (!ownerId.equals(currentUserId)) {
      throw new AccessDeniedException("El propietario no coincide con el usuario autenticado");
    }
  }

  // Validaciones de cambio de estado
  public void validateStatusTransition(Booking booking, BookingStatus newStatus, User currentUser) {
    validateBasicStatusTransition(booking.getStatus(), newStatus);
    validateUserPermissionsForStatus(booking, newStatus, currentUser);
  }

  private void validateBasicStatusTransition(BookingStatus current, BookingStatus newStatus) {
    if (current == newStatus) {
      throw new ValidationException("La reserva ya está en estado: " + current.getLabel());
    }

    if (!isValidTransition(current, newStatus)) {
      throw new ValidationException(
          String.format("No se puede cambiar de '%s' a '%s'",
              current.getLabel(), newStatus.getLabel()));
    }
  }

  private boolean isValidTransition(BookingStatus current, BookingStatus newStatus) {
    return switch (current) {
      case PENDING -> newStatus == BookingStatus.CONFIRMED || newStatus == BookingStatus.CANCELLED;
      case CONFIRMED -> newStatus == BookingStatus.IN_PROGRESS || newStatus == BookingStatus.CANCELLED;
      case IN_PROGRESS -> newStatus == BookingStatus.COMPLETED;
      case COMPLETED, CANCELLED -> false;
    };
  }

  private void validateUserPermissionsForStatus(Booking booking, BookingStatus newStatus, User currentUser) {
    if (isAdmin(currentUser))
      return;

    if (isOwner(currentUser)) {
      validateOwnerStatusChange(booking, newStatus, currentUser);
      return;
    }

    if (isSitter(currentUser)) {
      validateSitterStatusChange(booking, newStatus, currentUser);
      return;
    }

    throw new AccessDeniedException("No tienes permisos para modificar reservas");
  }

  // Validaciones específicas por rol
  private void validateOwnerStatusChange(Booking booking, BookingStatus newStatus, User currentUser) {
    if (!booking.getOwner().getId().equals(currentUser.getId())) {
      throw new AccessDeniedException("No eres el dueño de esta reserva");
    }

    if (newStatus != BookingStatus.CANCELLED) {
      throw new ValidationException("Los propietarios solo pueden cancelar reservas");
    }

    if (!canOwnerCancel(booking.getStatus())) {
      throw new ValidationException("Solo puedes cancelar reservas pendientes o confirmadas");
    }
  }

  private void validateSitterStatusChange(Booking booking, BookingStatus newStatus, User currentUser) {
    if (!booking.getSitter().getId().equals(currentUser.getId())) {
      throw new AccessDeniedException("No eres el cuidador asignado a esta reserva");
    }

    if (!isValidSitterStatus(newStatus)) {
      throw new ValidationException(
          "Los cuidadores solo pueden confirmar, iniciar o completar reservas");
    }
  }

  // Helpers
  private boolean canOwnerCancel(BookingStatus status) {
    return status == BookingStatus.PENDING || status == BookingStatus.CONFIRMED;
  }

  private boolean isValidSitterStatus(BookingStatus status) {
    return status == BookingStatus.CONFIRMED
        || status == BookingStatus.IN_PROGRESS
        || status == BookingStatus.COMPLETED;
  }

  private boolean hasRole(User user, ERole role) {
    return user.getRoles().stream()
        .anyMatch(r -> r.getName() == role);
  }

  private boolean isAdmin(User user) {
    return hasRole(user, ERole.ROLE_ADMIN);
  }

  private boolean isOwner(User user) {
    return hasRole(user, ERole.ROLE_OWNER);
  }

  private boolean isSitter(User user) {
    return hasRole(user, ERole.ROLE_SITTER);
  }
}
