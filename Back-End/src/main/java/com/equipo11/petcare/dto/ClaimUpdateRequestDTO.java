package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.claim.enums.ClaimState;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record ClaimUpdateRequestDTO(
        @NotNull
        Long claimId,
        @NotBlank
        ClaimState newState,
        String determination
) {
}
