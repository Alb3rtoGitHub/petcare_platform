package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.serviceentity.enums.ServiceName;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record AvailabilityRequestDTO(
        @NotNull(message = "Service Type is required")
        ServiceName serviceName,

        @NotNull(message = "Start Time is required")
        @Future(message = "Start Time must be in the future")
        LocalDateTime startTime,

        @NotNull(message = "End Time is required")
        @Future(message = "End Time must be in the future")
        LocalDateTime endTime
) {}
