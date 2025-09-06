package com.equipo11.petcare.controller;

import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.dto.BookingResponse;
import com.equipo11.petcare.dto.BookingStatusRequest;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.service.BookingService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/petcare/bookings")
public class BookingController {

  private final BookingService bookingService;

  public BookingController(BookingService bookingService) {
    this.bookingService = bookingService;
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('ADMIN', 'OWNER')") // Solo admin y owners pueden crear reservas
  public ResponseEntity<BookingResponse> addBooking(@Valid @RequestBody BookingCreateRequest booking,
      @AuthenticationPrincipal User currentUser) {
    var bookinCreate = bookingService.addBooking(booking, currentUser);
    return ResponseEntity.status(HttpStatus.CREATED).body(bookinCreate);
  }

  @PatchMapping("/{bookingId}/status")
  @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'SITTER')") // Todos pueden actualizar estado
  public ResponseEntity<BookingResponse> updateBookingStatus(
      @PathVariable Long bookingId,
      @Valid @RequestBody BookingStatusRequest statusRequest,
      @AuthenticationPrincipal User currentUser) {

    var updateBooking = bookingService.updateStatus(bookingId, statusRequest.getBookingStatus(), currentUser);
    return ResponseEntity.status(HttpStatus.OK).body(updateBooking);
  }
}
