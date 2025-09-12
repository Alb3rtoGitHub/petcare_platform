package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.user.Role;
import com.equipo11.petcare.model.user.enums.ERole;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Builder
public record SitterFullResponseDTO(
        Long id,
        String email,
        String firstName,
        String lastName,
        LocalDate birthDate,
        AddressDTO address,
        String phoneNumber,
        String documentType,
        String documentNumber,
        String experience,
        boolean enabled,
        String bio,
        Double hourlyRate,
        Double rating,
        Double averageRating,
        String profilePicture,
        String idCard,
        String backgroundCheckDocument,
        Boolean backgroundCheck,
        LocalDateTime registrationDate,
        Set<ServiceEntityResponseDTO> servicesEntities,
        Set<AvailabilityResponseDTO> availabilities,
        Set<ReviewDTO> reviews,
        Set<ERole> roles
) {
    public SitterFullResponseDTO {
        if (rating == null) {
            rating = 0.0;
        }
        if (averageRating == null) {
            averageRating = 0.0;
        }
        if (backgroundCheck == null) {
            backgroundCheck = false;
        }
        servicesEntities = servicesEntities != null ? servicesEntities : Set.of();
        availabilities = availabilities != null ? availabilities : Set.of();
        reviews = reviews != null ? reviews : Set.of();
        roles = roles != null ? roles : Set.of();
    }
}
