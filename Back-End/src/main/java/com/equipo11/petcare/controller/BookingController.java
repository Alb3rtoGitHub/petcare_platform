package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.BookingDetailResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.dto.BookingResponse;
import com.equipo11.petcare.dto.BookingStatusRequest;
import com.equipo11.petcare.model.booking.BookingStatus;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.repository.UserRepository;
import com.equipo11.petcare.service.BookingService;

import jakarta.validation.Valid;

import java.time.LocalDateTime;
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

  @GetMapping("admin")
   @PreAuthorize("hasRole('ROLE_ADMIN')") // Solo admin y
  public ResponseEntity<List<BookingDetailResponse>> getAllBookingsAdmin(@AuthenticationPrincipal String email) {

    User currentUser = getCurrentUser(email);
    List<BookingDetailResponse> bookings = bookingService.getAllBookings();
    return ResponseEntity.status(HttpStatus.OK).body(bookings);
  }

  @GetMapping
  @PreAuthorize("hasAnyRole('ROLE_OWNER','ROLE_SITTER')")
  public ResponseEntity<Page<BookingDetailResponse>> getBookingsUser(
      @RequestParam(required = false) BookingStatus status,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
      @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
      @PageableDefault(size = 1, sort = "createdAt") Pageable pageable,
      @AuthenticationPrincipal String email) {

    User currentUser = getCurrentUser(email);

    return ResponseEntity.ok(bookingService.getCurrentUserBookingsPaged(
            currentUser,
            status,
            startDate,
            endDate,
            pageable));
  }

  @PostMapping
  @PreAuthorize("hasAnyRole('ROLE_ADMIN', 'ROLE_OWNER')") // Solo admin y
  // owners pueden crear reservas
  public ResponseEntity<BookingResponse> addBooking(@Valid @RequestBody BookingCreateRequest request,
      @AuthenticationPrincipal String email) {
    User currentUser = getCurrentUser(email);

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

  private User getCurrentUser(String email) {
      return userRepository.findByEmail(email).orElseThrow(() -> new AccessDeniedException("Usuario no autenticado"));
  }

  @DeleteMapping("/{bookingId}")
  public ResponseEntity<?> deleteBooking(@PathVariable Long bookingId, @AuthenticationPrincipal String email) {
      User currentUser = getCurrentUser(email);
      bookingService.deletedBooking(bookingId,currentUser);
     return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
  }
}
