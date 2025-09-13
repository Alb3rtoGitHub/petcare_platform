package com.equipo11.petcare.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.equipo11.petcare.model.booking.BookingStatus;

public record BookingDetailResponse(
    Long id,
    Long ownerId,
    String ownerName,
    String ownerEmail,
    Long sitterId,
    String sitterName,
    String sitterEmail,
    Long petId,
    String petName,
    String petType,
    List<ServiceDetailResponse> services,
    LocalDateTime startDateTime,
    LocalDateTime endDateTime,
    BigDecimal totalPrice,
    BookingStatus status,
    String statusLabel,
    String specialInstructions,
    LocalDateTime createdAt) {

}
