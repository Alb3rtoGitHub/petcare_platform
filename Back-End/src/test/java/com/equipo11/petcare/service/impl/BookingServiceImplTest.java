package com.equipo11.petcare.service.impl;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.convert.ConversionService;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.dto.BookingResponse;
import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.booking.BookingStatus;
import com.equipo11.petcare.model.user.Role;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.model.user.enums.ERole;
import com.equipo11.petcare.repository.JpaBookingRepository;
import com.equipo11.petcare.service.PetServiceImpl;
import com.equipo11.petcare.service.SitterService;
import com.equipo11.petcare.validator.BookingValidator;

@ExtendWith(MockitoExtension.class)
class BookingServiceImplTest {

  @Mock
  private JpaBookingRepository bookingRepository;

  @Mock
  private SitterService sitterService;

  @Mock
  private PetServiceImpl petService;

  @Mock
  private ConversionService conversionService;

  @Mock
  private BookingValidator bookingValidator;

  @InjectMocks
  private BookingServiceImpl bookingService;

  private User mockOwner;
  private BookingCreateRequest mockRequest;
  private Booking mockBooking;
  private BookingResponse mockResponse;

  @BeforeEach
  void setUp() {
    // Configurar datos de prueba
    mockOwner = new User();
    mockOwner.setId(1L);
    mockOwner.setEmail("owner@test.com");
    Role ownerRole = new Role();
    ownerRole.setName(ERole.ROLE_OWNER);
    mockOwner.setRoles(new HashSet<>() {
      {
        add(ownerRole);
      }
    });

    LocalDateTime start = LocalDateTime.now().plusDays(1);
    LocalDateTime end = start.plusHours(2);

    mockRequest = new BookingCreateRequest(
        1L, // ownerId
        2L, // sitterId
        3L, // petId
        List.of(UUID.randomUUID()), // serviceId debe ser List<UUID>
        start, // startDateTime
        end, // endDateTime
        "Notas de prueba" // specialInstructions
    );

    mockBooking = new Booking();
    mockBooking.setId(UUID.randomUUID());
    mockBooking.setStatus(BookingStatus.PENDING);

    mockResponse = new BookingResponse(
        mockBooking.getId(), // id
        1L, // ownerId
        2L, // sitterId
        3L, // petId
        List.of(UUID.randomUUID()), // serviceIds debe ser List<UUID>
        start, // startDateTime
        end, // endDateTime
        BigDecimal.valueOf(100), // totalPrice
        BookingStatus.PENDING, // status
        "Notas de prueba", // specialInstructions
        LocalDateTime.now() // createdAt
    );
  }

  @Test
  void addBooking_Success() {
    // Arrange
    when(sitterService.hasAvailableSchedule(anyLong(), any(), any())).thenReturn(true);
    when(bookingRepository.existsOverlappingBooking(anyLong(), any(), any())).thenReturn(false);
    when(conversionService.convert(mockRequest, Booking.class)).thenReturn(mockBooking);
    when(bookingRepository.save(any(Booking.class))).thenReturn(mockBooking);
    when(conversionService.convert(mockBooking, BookingResponse.class)).thenReturn(mockResponse);

    // Act
    BookingResponse result = bookingService.addBooking(mockRequest, mockOwner);

    // Assert
    assertNotNull(result);
    assertEquals(mockResponse.id(), result.id());
    assertEquals(BookingStatus.PENDING, result.status());

    // Verify
    verify(bookingValidator).validateBookingRequest(mockRequest, mockOwner);
    verify(bookingRepository).save(any(Booking.class));
  }

  @Test
  void addBooking_UnavailableSitter_ThrowsException() {
    // Arrange
    when(sitterService.hasAvailableSchedule(anyLong(), any(), any())).thenReturn(false);

    // Act & Assert
    assertThrows(PetcareException.class, () -> bookingService.addBooking(mockRequest, mockOwner));
  }

  @Test
  void updateStatus_Success() {
    // Arrange
    when(bookingRepository.findById(any(UUID.class))).thenReturn(Optional.of(mockBooking));
    when(bookingRepository.save(any(Booking.class))).thenReturn(mockBooking);
    when(conversionService.convert(mockBooking, BookingResponse.class)).thenReturn(mockResponse);

    // Act
    BookingResponse result = bookingService.updateStatus(
        mockBooking.getId(),
        BookingStatus.CONFIRMED,
        mockOwner);

    // Assert
    assertNotNull(result);
    verify(bookingValidator).validateStatusTransition(mockBooking, BookingStatus.CONFIRMED, mockOwner);
    verify(bookingRepository).save(mockBooking);
  }

  @Test
  void updateStatus_BookingNotFound_ThrowsException() {
    // Arrange
    when(bookingRepository.findById(any(UUID.class))).thenReturn(Optional.empty());

    // Act & Assert
    assertThrows(PetcareException.class, () -> bookingService.updateStatus(
        UUID.randomUUID(),
        BookingStatus.CONFIRMED,
        mockOwner));
  }

  @Test
  void checkAvailability_Success() {
    // Arrange
    Long sitterId = 1L;
    LocalDateTime start = LocalDateTime.now().plusDays(1);
    LocalDateTime end = start.plusHours(2);

    when(sitterService.hasAvailableSchedule(sitterId, start, end)).thenReturn(true);
    when(bookingRepository.existsOverlappingBooking(sitterId, start, end)).thenReturn(false);

    // Act
    boolean result = bookingService.checkAvailability(sitterId, start, end);

    // Assert
    assertTrue(result);
    verify(sitterService).hasAvailableSchedule(sitterId, start, end);
    verify(bookingRepository).existsOverlappingBooking(sitterId, start, end);
  }

  @Test
  void calculatePrice_Success() {
    // Arrange
    Long serviceId = 1L;
    Long sitterId = 1L;
    LocalDateTime start = LocalDateTime.now().plusDays(1);
    BigDecimal expectedPrice = BigDecimal.valueOf(100);

    when(sitterService.getServicePrice(serviceId, sitterId)).thenReturn(expectedPrice);

    // Act
    BigDecimal result = bookingService.calculatePrice(serviceId, start, sitterId);

    // Assert
    assertEquals(expectedPrice, result);
    verify(sitterService).getServicePrice(serviceId, sitterId);
  }
}
