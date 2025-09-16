package com.equipo11.petcare.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

public record AuthRequestDTO(
        @NotBlank(message = "El correo no puede estar vació")
        @Email(message = "Formató no válido, ej:tucorreo@example.com")
        String email,

        @NotBlank(message = "El password no puede estar vacío")
        String password) {

    public AuthRequestDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }
}
