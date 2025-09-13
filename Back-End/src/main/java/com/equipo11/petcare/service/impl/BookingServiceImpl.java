package com.equipo11.petcare.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.core.convert.ConversionService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.dto.BookingDetailResponse;
import com.equipo11.petcare.dto.BookingResponse;
import com.equipo11.petcare.enums.ApiError;
import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.mapper.BookingCreateRequestMapper;
import com.equipo11.petcare.mapper.BookingResponseMapper;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.booking.BookingStatus;
import com.equipo11.petcare.model.user.Owner;
import com.equipo11.petcare.model.user.Sitter;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.repository.JpaBookingRepository;
import com.equipo11.petcare.repository.AvailabilityRespository;
import com.equipo11.petcare.service.BookingService;
import com.equipo11.petcare.service.PetServiceImpl;
import com.equipo11.petcare.service.SitterService;
import com.equipo11.petcare.validator.BookingValidator;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
  private final JpaBookingRepository bookingRepository;
  private final SitterService sitterService;
  private final PetServiceImpl petService;
  private final ConversionService conversionService;
  private final BookingCreateRequestMapper bookingCreateRequestMapper;
  private final BookingValidator bookingValidator;
  private final BookingResponseMapper bookingResponseMapper;
  private final AvailabilityRespository sitterAvailabilityRespository;

  @Override
  public void checkAvailability(BookingCreateRequest request) {
    if (request == null || request.sitterId() == null || request.petId() == null) {
      throw new PetcareException(ApiError.INVALID_REQUEST);
    }
    // Verificar horario disponible del cuidador
    boolean hasAvailableSchedule = sitterService.hasAvailableSchedule(
        request.sitterId(),
        request.startDateTime(),
        request.endDateTime());

    if (!hasAvailableSchedule) {
      throw new PetcareException(ApiError.CARETAKER_UNAVAILABLE);
    }

    // Verificar que el cuidador no tenga reservas solapadas
    boolean hasOverlappingSitter = bookingRepository.existsOverlappingBooking(
        request.sitterId(),
        request.startDateTime(),
        request.endDateTime());

    if (hasOverlappingSitter) {
      throw new PetcareException(ApiError.CARETAKER_UNAVAILABLE);
    }

    // Verificar que la mascota no tenga reservas solapadas
    boolean hasOverlappingPet = bookingRepository.existsOverlappingBookingForPet(
        request.petId(),
        request.startDateTime(),
        request.endDateTime());

    if (hasOverlappingPet) {
      throw new PetcareException(ApiError.PET_OVERLAPPING_BOOKING);
    }
  }

  @Override
  public BigDecimal calculatePrice(
      Long serviceId,
      Long sistterId) {
    // Recomendable tener un precio base, si no dar precio customizado
    return sitterService.getServicePrice(serviceId, sistterId);
  }

  @Override
  public BookingResponse addBooking(
      BookingCreateRequest request,
      User currentUser) {

    // validaciones
    bookingValidator.validateBookingRequest(request, currentUser);
    checkAvailability(request);
    Booking booking = bookingCreateRequestMapper.toEntity(request, currentUser);
    Booking saveBooking = bookingRepository.save(booking);

    return bookingResponseMapper.convert(saveBooking);
  }

  @Override
  public BookingResponse updateStatus(
      Long bookingId,
      BookingStatus newStatus,
      User currentUser) {
    Booking booking = bookingRepository
        .findById(bookingId)
        .orElseThrow(() -> new PetcareException(ApiError.RESOURCE_NOT_FOUND));

    // validaciones
    bookingValidator.validateStatusTransition(
        booking,
        newStatus,
        currentUser);
    booking.setStatus(newStatus);

    // Guardar y convertir a DTO
    Booking bookingUpdate = bookingRepository.save(booking);
    return conversionService.convert(bookingUpdate, BookingResponse.class);
  }

  // Mostrar servicios a usuarios logueados
  @Override
  public List<BookingDetailResponse> getCurrentUserBookings(User userCurrent) {
    List<Booking> bookings;
    if (userCurrent instanceof Owner) {
      bookings = bookingRepository
          .findByOwnerIdOrderByCreatedAtDesc(userCurrent.getId());
    } else if (userCurrent instanceof Sitter) {
      bookings = bookingRepository.findBySitterIdOrderByCreatedAtDesc(userCurrent.getId());
    } else {
      throw new AccessDeniedException("Usuario no autorizado");
    }
    return bookingResponseMapper.toDetailResponseList(bookings);
  }

  public Page<BookingDetailResponse> getCurrentUserBookingsPaged(
      User currentUser,
      BookingStatus status,
      LocalDateTime startDate,
      LocalDateTime endDate,
      Pageable pageable) {

    Page<Booking> bookings;

    if (currentUser instanceof Owner) {
      bookings = bookingRepository.findByOwnerIdAndFilters(
          currentUser.getId(),
          status,
          startDate,
          endDate,
          pageable);
    } else if (currentUser instanceof Sitter) {
      bookings = bookingRepository.findBySitterIdAndFilters(
          currentUser.getId(),
          status,
          startDate,
          endDate,
          pageable);
    } else {
      throw new AccessDeniedException("Usuario no autorizado");
    }

    return bookings.map(bookingResponseMapper::toDetailResponse);
  }
}
