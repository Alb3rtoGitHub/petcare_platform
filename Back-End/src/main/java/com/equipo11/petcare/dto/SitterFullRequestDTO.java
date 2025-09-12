package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.address.Address;
import com.equipo11.petcare.model.availability.Availability;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Builder;

import java.time.LocalDate;
import java.util.Set;

@Builder
public record SitterFullRequestDTO(
        @NotBlank
        @Email(message = "Email should be valid")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 6, message = "Password must be at least 6 characters")
        String password,

        @NotBlank(message = "First name is required")
        String firstName,

        @NotBlank(message = "Last name is required")
        String lastName,

        @NotNull(message = "Birth date is required")
        LocalDate birthDate,

        @NotNull(message = "Address is required")
        Address address,

        @NotBlank(message = "Phone number is required")
        String phoneNumber,

        @NotBlank(message = "Document type is required")
        String documentType,

        @NotBlank(message = "Document number is required")
        String documentNumber,

        String experience,

        String bio,

        @PositiveOrZero(message = "Hourly rate must be positive or zero")
        Double hourlyRate,

        String profilePicture,

        @NotBlank(message = "ID card is required")
        String idCard,

        String backgroundCheckDocument,

        @AssertFalse(message = "Background check must be false on registration")
        Boolean backgroundCheck,

        @NotEmpty(message = "At least one service is required")
        Set<Long> serviceIds,

        @Valid
        Set<Availability> availabilities
    ) {

    public SitterFullRequestDTO {
        if (backgroundCheck == null) {
            backgroundCheck = false;
        }
    }
}
