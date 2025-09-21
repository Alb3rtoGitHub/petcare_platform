package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.BookingRequestDTO;
import com.equipo11.petcare.dto.BookingResponseDTO;
import com.equipo11.petcare.model.booking.BookingStatus;
import com.equipo11.petcare.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<BookingResponseDTO> createBooking(@RequestBody @Valid BookingRequestDTO request) {
        var response = bookingService.createBooking(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBooking(@PathVariable Long id) {
        var response = bookingService.getBooking(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Page<BookingResponseDTO>> getAllBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "startDateTime") String sortBy
    ) {
        return ResponseEntity.ok(bookingService.getAllBookings(page, size, sortBy));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<BookingResponseDTO>> getBookingsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "startDateTime") String sortBy) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userId, page, size, sortBy));
    }

    @PatchMapping("/{id}/{status}")
    public ResponseEntity<BookingResponseDTO> updateBooking(@PathVariable Long id, @PathVariable @Valid BookingStatus status) {
        var response = bookingService.updateBooking(id, status);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.noContent().build();
    }
}
