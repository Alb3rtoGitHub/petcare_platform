package com.equipo11.petcare.service;

import java.math.BigDecimal;
import java.util.List;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.dto.BookingDetailResponse;
import com.equipo11.petcare.dto.BookingResponse;
import com.equipo11.petcare.model.booking.BookingStatus;
import com.equipo11.petcare.model.user.User;

public interface BookingService {

  void checkAvailability(BookingCreateRequest request);

  public BigDecimal calculatePrice(Long serviceId, Long sistterId);

  public BookingResponse addBooking(BookingCreateRequest request, User currentUser);

  public BookingResponse updateStatus(Long bookingId, BookingStatus newStatus, User currentUser);

  public List<BookingDetailResponse> getCurrentUserBookings(User userCurrent);
}
