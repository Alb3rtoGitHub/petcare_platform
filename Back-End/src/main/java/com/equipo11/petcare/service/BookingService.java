package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.booking.BookingStatus;
import com.equipo11.petcare.model.user.User;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public interface BookingService {

  public boolean checkAvailability(Long sistterId, LocalDateTime start, LocalDateTime end);

  public BigDecimal calculatePrice(Long serviceId, LocalDateTime start, Long sistterId);

  public Booking addBooking(BookingCreateRequest request);

  public Booking updateStatus(UUID bookingId, BookingStatus newStatus, User currentUser);
}
