package com.equipo11.petcare.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.convert.ConversionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.ValidationException;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.booking.BookingStatus;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.repository.JpaBookingRepository;
import com.equipo11.petcare.service.BookingService;
import com.equipo11.petcare.service.PetServiceImpl;
import com.equipo11.petcare.service.SitterService;
import com.equipo11.petcare.validator.BookingValidator;

@Service
@Transactional
public class BookingServieImpl implements BookingService {
  private final JpaBookingRepository bookingRepository;
  private final SitterService sitterSevice;
  private final PetServiceImpl petService;
  private final ConversionService conversionService;
  BookingValidator bookingValidator;

  @Autowired
  public BookingServieImpl(JpaBookingRepository bookingRepository,
      SitterService sitterService,
      PetServiceImpl petService,
      ConversionService conversionService,
      BookingValidator bookingValidator) {
    this.bookingRepository = bookingRepository;
    this.sitterSevice = sitterService;
    this.petService = petService;
    this.conversionService = conversionService;
    this.bookingValidator = bookingValidator;
  }

  @Override
  public boolean checkAvailability(Long sistterId, LocalDateTime start, LocalDateTime end) {
    // Verificar horario diponible
    boolean hasAvailableSchedule = sitterSevice.hasAvailableSchedule(sistterId, start, end);

    // Valida que no se repita una reserva o se superponga
    boolean hasOverlapping = bookingRepository.existsOverlappingBooking(sistterId, start, end);

    return hasAvailableSchedule && !hasOverlapping;
  }

  @Override
  public BigDecimal calculatePrice(Long serviceId, LocalDateTime start, Long sistterId) {

    // Recomendable tener un precio base, si no dar precio customizado
    return sitterSevice.getServicePrice(serviceId, sistterId);
  }

  @Override
  public Booking addBooking(BookingCreateRequest request) {

    // validaciones
    bookingValidator.validateBookingRequest(request);

    // Verificar disponibilidad del cuidador y conflictos de reserva
    boolean available = checkAvailability(request.sitterId(), request.startDateTime(), request.endDateTime());
    if (!available) {
      throw new ValidationException("El cuidador no está disponible o existe superposición de reservas");
    }

    // Usar mapper
    Booking transformed = conversionService.convert(request, Booking.class);
    Booking result = bookingRepository.save(Objects.requireNonNull(transformed));
    // guardar entidad mapeada
    return conversionService.convert(result, Booking.class);
  }

  @Override
  public Booking updateStatus(UUID bookingId, BookingStatus newStatus, User currentUser) {
    Booking booking = bookingRepository.findById(bookingId)
        .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    // validaciones
    bookingValidator.validateStatusTransition(booking, newStatus, currentUser);
    booking.setStatus(newStatus);

    return bookingRepository.save(booking);
  }
}
