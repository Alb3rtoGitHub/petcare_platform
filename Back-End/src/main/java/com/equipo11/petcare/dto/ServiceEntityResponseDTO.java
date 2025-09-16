package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.serviceentity.enums.ServiceName;

public record ServiceEntityResponseDTO(
        Long id,
        ServiceName serviceName,
        String description,
        Double price,
        Long duration,
        Boolean active
) {}
