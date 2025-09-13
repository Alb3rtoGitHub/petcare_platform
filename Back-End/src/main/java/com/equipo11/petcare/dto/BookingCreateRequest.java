package com.equipo11.petcare.dto;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

public record BookingCreateRequest(

    @NotNull Long sitterId,

    @NotNull Long petId,

    @NotNull List<Long> serviceIds,

    @NotNull @Future LocalDateTime startDateTime,

    @NotNull @Future LocalDateTime endDateTime,

    String specialInstructions) {
}
