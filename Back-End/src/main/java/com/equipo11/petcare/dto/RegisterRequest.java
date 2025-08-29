package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.user.enums.ERole;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record RegisterRequest(
        @NotBlank(message = "El correo no puede estar vació")
        @Email(message = "Formató no válido, ej:tucorreo@example.com")
        String email,

        @NotBlank
        @Size(min = 8)
        @Pattern(
                regexp = "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[^A-Za-z0-9]).+$",
                message = "La contraseña debe contener mayúscula, minúscula, número y carácter especial"
        )
        String password,

        @Positive(message = "El número de teléfono debe ser positivo")
        @Pattern(
                regexp = "\\+?\\d{6,15}",
                message = "El teléfono debe tener entre 6 y 15 dígitos, opcional '+' inicial"
        )
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
        AddressDTO address,

        @NotNull
        ERole role
) {
}
