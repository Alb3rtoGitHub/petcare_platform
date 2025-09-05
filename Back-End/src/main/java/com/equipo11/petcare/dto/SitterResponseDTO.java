package com.equipo11.petcare.dto;

import lombok.Builder;

@Builder
public record SitterResponseDTO(
        Long id,
        String firstName,
        String lastName,
        Double rating,
        Long cityId
) {
}
