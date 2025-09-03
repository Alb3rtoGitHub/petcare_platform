package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.dto.BookingResponse;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.booking.BookingStatus;
import com.equipo11.petcare.model.user.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public interface BookingService {

  public boolean checkAvailability(Long sistterId, LocalDateTime start, LocalDateTime end);

  public BigDecimal calculatePrice(Long serviceId, LocalDateTime start, Long sistterId);

  // New API with security context
  public BookingResponse addBooking(BookingCreateRequest request, User currentUser);

  public BookingResponse updateStatus(UUID bookingId, BookingStatus newStatus, User currentUser);

  // Legacy API kept for backward compatibility in unit tests
  //public com.equipo11.petcare.model.booking.Booking addBooking(BookingCreateRequest request);
}
