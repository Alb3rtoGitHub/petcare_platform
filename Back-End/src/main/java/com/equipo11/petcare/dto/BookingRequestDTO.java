package com.equipo11.petcare.dto;

import java.time.LocalDateTime;

public record BookingRequestDTO(
        Long ownerId,
        Long sitterId,
        Long petId,
        Long serviceEntityId,
        LocalDateTime startDateTime,
        LocalDateTime endDateTime,
        Double totalPrice,
        String specialInstructions
) {
}
