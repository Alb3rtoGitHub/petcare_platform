package com.equipo11.petcare.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import com.equipo11.petcare.model.booking.BookingStatus;

public record BookingResponse(
    Long id,
    Long ownerId,
    Long sitterId,
    Long petId,
    List<Long> serviceIds,
    LocalDateTime startDateTime,
    LocalDateTime endDateTime,
    BigDecimal totalPrice,
    BookingStatus status,
    String specialInstructions,
    LocalDateTime createdAt) {
}
