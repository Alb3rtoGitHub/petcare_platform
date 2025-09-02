package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/petcare/bookings")
public class BookingController {

  private final BookingService bookingService;

  public BookingController(BookingService bookingService) {
    this.bookingService = bookingService;
  }

  @PostMapping
  public ResponseEntity<Booking> addBooking(@Valid @RequestBody BookingCreateRequest booking) {
    var bookinCreate = bookingService.addBooking(booking);
    return ResponseEntity.status(HttpStatus.CREATED).body(bookinCreate);
  }
}
