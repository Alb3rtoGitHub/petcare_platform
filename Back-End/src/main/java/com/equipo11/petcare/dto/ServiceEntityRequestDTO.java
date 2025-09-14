package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.serviceentity.enums.ServiceName;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record ServiceEntityRequestDTO(
        Long id,

        @NotNull(message = "El nombre del servicio es obligatorio")
        ServiceName serviceName,

        String description,

        @Positive(message = "El precio debe ser mayor a 0")
        Double price,

        @Positive(message = "La duración debe ser mayor a 0")
        Long duration,

        Boolean active
) {}
