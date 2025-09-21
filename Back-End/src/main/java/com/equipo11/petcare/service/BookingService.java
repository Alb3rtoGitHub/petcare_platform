package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.BookingRequestDTO;
import com.equipo11.petcare.dto.BookingResponseDTO;
import com.equipo11.petcare.model.booking.BookingStatus;
import org.springframework.data.domain.Page;

public interface BookingService {
    BookingResponseDTO createBooking(BookingRequestDTO bookingRequestDTO);
    BookingResponseDTO updateBooking(Long id, BookingStatus status);
    void deleteBooking(Long id);
    BookingResponseDTO getBooking(Long id);
    Page<BookingResponseDTO> getAllBookings(int page, int size, String sortBy);
    Page<BookingResponseDTO> getBookingsByUser(Long userId, int page, int size, String sortBy);
}
