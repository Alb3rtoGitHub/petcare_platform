package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.claim.enums.ClaimState;
import com.equipo11.petcare.model.user.Owner;
import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record ClaimResponseDTO(
        Long id,
        Long ownerId,
        Long bookingId,
        String description,
        ClaimState state,
        String determination,
        LocalDateTime createdAt,
        LocalDateTime updateAt
    ) {
}
