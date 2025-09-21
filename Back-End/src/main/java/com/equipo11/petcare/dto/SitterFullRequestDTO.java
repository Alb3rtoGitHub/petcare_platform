package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.availability.Availability;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import lombok.Builder;

import java.util.Set;

@Builder
public record SitterFullRequestDTO(

        UpdateUserRequestDTO updateUserRequestDTO,

        @NotBlank(message = "Document type is required")
        String documentType,

        @NotBlank(message = "Document number is required")
        String documentNumber,

        String experience,

        String bio,

        @NotBlank(message = "ID card is required")
        String idCard,

        String backgroundCheckDocument,

        @Valid
        Set<Availability> availabilities
    ) {}
