package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.availability.enums.ServiceName;
import com.equipo11.petcare.model.user.Sitter;

import java.util.Set;

public record ServiceEntityResponseDTO(
        Long id,
        ServiceName serviceName,
        String description,
        Double price,
        Long duration,
        Boolean active,
        Set<Sitter> sitters
) {}
