package com.equipo11.petcare.dto;

import jakarta.validation.constraints.*;
import lombok.Builder;

@Builder
public record SitterPatchRequestDTO(
        @NotNull(message = "Sitter ID is required")
        Long sitterId,

        @NotBlank(message = "Document type is required")
        String documentType,

        @NotBlank(message = "Document number is required")
        String documentNumber,

        String experience,

        String bio,

        String idCard,

        String backgroundCheckDocument
) {}

