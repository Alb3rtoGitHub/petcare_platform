package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.booking.BookingStatus;
import lombok.Builder;

import java.time.LocalDateTime;
@Builder
public record BookingResponseDTO(
        Long id,
        String ownerName,
        Long sitterId,
        String petName,
        String serviceName,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        Double totalPrice,
        String specialInstructions,
        LocalDateTime createdAt,
        BookingStatus status
) {}
