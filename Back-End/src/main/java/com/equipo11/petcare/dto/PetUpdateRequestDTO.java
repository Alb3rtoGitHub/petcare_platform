package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.pet.enums.ESize;
import com.equipo11.petcare.model.pet.enums.ESpecies;

public record PetUpdateRequestDTO(
        Long id,
        String name,
        Integer age,
        ESpecies species,
        ESize sizeCategory,
        String careNote,
        Long ownerId
) {
}
