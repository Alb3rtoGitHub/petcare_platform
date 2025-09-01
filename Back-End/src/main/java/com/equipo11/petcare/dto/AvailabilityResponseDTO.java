package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.availability.enums.ServiceName;

import java.time.LocalDateTime;

public record AvailabilityResponseDTO(
        Long id,
        Long sitterId,
        ServiceName serviceName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        double price,
        boolean active
) {}