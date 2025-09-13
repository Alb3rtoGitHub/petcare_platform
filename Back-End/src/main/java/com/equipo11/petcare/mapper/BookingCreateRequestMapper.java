package com.equipo11.petcare.mapper;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;
import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.model.user.Owner;
import com.equipo11.petcare.model.booking.BookingStatus;
import com.equipo11.petcare.service.PetService;
import com.equipo11.petcare.service.SitterService;
import com.equipo11.petcare.service.ServiceEntityService;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class BookingCreateRequestMapper {
  private final PetService petService;
  private final SitterService sitterService;
  private final ServiceEntityService serviceService;

  public Booking toEntity(BookingCreateRequest request, User currentUser) {
    if (request == null) {
      return null;
    }

    // Verificar que el usuario sea un Owner
    if (!(currentUser instanceof Owner)) {
      throw new AccessDeniedException("El usuario debe ser un propietario para crear una reserva");
    }

    Booking booking = new Booking();
    booking.setOwner((Owner) currentUser);
    booking.setPet(petService.validatePetBelongsToOwner(request.petId(), currentUser.getId()));
    booking.setSitter(sitterService.findById(request.sitterId()));

    if (request.serviceIds() != null) {
      serviceService.validateServices(request.serviceIds());
      booking.setServiceEntities(serviceService.validateServices(request.serviceIds()));
    }

    booking.setStartDateTime(request.startDateTime());
    booking.setEndDateTime(request.endDateTime());
    booking.setStatus(BookingStatus.PENDING);
    booking.setSpecialInstructions(request.specialInstructions());

    return booking;
  }
}
