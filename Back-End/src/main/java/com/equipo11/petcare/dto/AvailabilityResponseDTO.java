package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.serviceentity.ServiceEntity;

import java.time.LocalDateTime;

public record AvailabilityResponseDTO(
        Long id,
        Long sitterId,
        String serviceName,
        LocalDateTime startTime,
        LocalDateTime endTime,
        boolean active
) {}