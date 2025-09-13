package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.BookingDetailResponse;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.dto.BookingResponse;
import com.equipo11.petcare.dto.BookingStatusRequest;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.repository.UserRepository;
import com.equipo11.petcare.service.BookingService;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

  private final BookingService bookingService;
  private final UserRepository userRepository;

  public BookingController(BookingService bookingService, UserRepository userRepository) {
    this.bookingService = bookingService;
    this.userRepository = userRepository;
  }

  @GetMapping
  @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OWNER')") // Solo admin y
  public ResponseEntity<List<BookingDetailResponse>> getAllBookings(@AuthenticationPrincipal String email){
      User currentUser = userRepository.findByEmail(email)
              .orElseThrow(() -> new AccessDeniedException("Usuario no autenticado"));
      List<BookingDetailResponse> bookings = bookingService.getCurrentUserBookings(currentUser);
     return ResponseEntity.status(HttpStatus.OK).body(bookings);
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OWNER')") // Solo admin y
  // owners pueden crear reservas
  public ResponseEntity<BookingResponse> addBooking(@Valid @RequestBody BookingCreateRequest request,
      @AuthenticationPrincipal String email) {
    User currentUser = userRepository.findByEmail(email)
        .orElseThrow(() -> new AccessDeniedException("Usuario no autenticado"));

    System.out.println("userr currentUser " + currentUser.getEmail());

    BookingResponse bookin = bookingService.addBooking(request, currentUser);
    return ResponseEntity.status(HttpStatus.CREATED).body(bookin);
  }

  @PatchMapping("/{bookingId}/status")
  @PreAuthorize("hasAnyRole('ADMIN', 'OWNER', 'SITTER')") // Todos pueden actualizar estado
  public ResponseEntity<BookingResponse> updateBookingStatus(
      @PathVariable Long bookingId,
      @Valid @RequestBody BookingStatusRequest statusRequest,
      @AuthenticationPrincipal String email) {

    User currentUser = userRepository.findByEmail(email)
        .orElseThrow(() -> new AccessDeniedException("Usuario no autenticado"));

    var updateBooking = bookingService.updateStatus(bookingId, statusRequest.getBookingStatus(), currentUser);
    return ResponseEntity.status(HttpStatus.OK).body(updateBooking);
  }
}
