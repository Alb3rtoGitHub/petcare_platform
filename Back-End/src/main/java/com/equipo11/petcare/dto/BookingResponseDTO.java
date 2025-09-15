package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.booking.BookingStatus;
import lombok.Builder;

import java.time.LocalDateTime;
@Builder
public record BookingResponseDTO(
        Long id,
        Long ownerId,
        Long sitterId,
        Long petId,
        Long serviceEntityId,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        Double totalPrice,
        String specialInstructions,
        LocalDateTime createdAt,
        BookingStatus status
) {}
