package com.equipo11.petcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClaimCreateRequestDTO(
        @NotNull
        Long bookingId,
        @NotBlank
        String description
) {
}
