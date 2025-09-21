package com.equipo11.petcare.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateUserRequestDTO(
        String phoneNumber,

        @NotBlank(message = "El nombre no puede estar vacío")
        String firstName,

        @NotBlank(message = "El apellido no puede estar vacío")
        String lastName,

        @NotNull(message = "La dirección es obligatoria")
        @Valid
        AddressDTO address,

        String profilePicture
) {
}
