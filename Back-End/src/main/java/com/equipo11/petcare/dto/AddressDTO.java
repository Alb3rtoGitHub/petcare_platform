package com.equipo11.petcare.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Builder;

@Builder
public record AddressDTO (
        @NotBlank(message = "El nombre de la calle no puede estar vacío")
        String streetName,

        @NotBlank(message = "El número de la calle no puede estar vacío")
        String streetNumber,

        String unit,

        @NotBlank(message = "La ciudad no puede estar vacía")
        String city,

        @NotBlank(message = "La región no puede estar vacía")
        String region,

        @NotBlank(message = "El país no puede estar vacío")
        @Pattern(
                regexp = "^[A-Z]{2}$",
                message = "El país debe usarse en formato ISO-3166 alpha-2 (ej. AR, US, FR)"
        )
        String countryCode
){
}
