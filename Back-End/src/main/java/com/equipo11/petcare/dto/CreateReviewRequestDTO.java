package com.equipo11.petcare.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record CreateReviewRequestDTO(
        @NotNull(message = "Debe asociar una reserva a la reseña")
        Long bookingId,

        @NotNull(message = "La reseña debe tener una calificación")
        @Min(value = 1, message = "rating mínimo 1")
        @Max(value = 5, message = "rating máximo 5")
        Integer rating,

        @NotBlank(message = "La reserva debe tener un comentario")
        String comment

) {
}
