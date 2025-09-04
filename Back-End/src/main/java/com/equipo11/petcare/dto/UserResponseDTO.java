package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.service.AddressService;

import java.time.LocalDate;

public record UserResponseDTO(
        String email,
        String phoneNumber,
        String firstName,
        String lastName,
        LocalDate birthdate,
        AddressDTO address
) {
    public UserResponseDTO(User user) {
        this(user.getEmail(),
                user.getPhoneNumber(),
                user.getFirstName(),
                user.getLastName(),
                user.getBirthDate(),
                AddressDTO.builder()
                        .countryCode(user.getAddress().getCity().getRegion().getCountry().getCountryCode())
                        .region(user.getAddress().getCity().getRegion().getName())
                        .city(user.getAddress().getStreetName())
                        .streetName(user.getAddress().getStreetName())
                        .streetNumber(user.getAddress().getStreetNumber())
                        .unit(user.getAddress().getUnit())
                        .build());
    }
}
