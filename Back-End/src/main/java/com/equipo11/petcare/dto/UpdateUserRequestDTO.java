package com.equipo11.petcare.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record UpdateUserRequestDTO(
        String phoneNumber,

        @NotBlank(message = "El nombre no puede estar vacío")
        String firstName,

        @NotBlank(message = "El apellido no puede estar vacío")
        String lastName,

        @NotNull(message = "La fecha de nacimiento es obligatoria")
        @JsonFormat(pattern = "yyyy-MM-dd")
        LocalDate birthdate,

        @NotNull(message = "La dirección es obligatoria")
        @Valid
        AddressDTO address
) {
}
