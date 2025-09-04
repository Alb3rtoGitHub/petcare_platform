package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.ESize;
import com.equipo11.petcare.model.ESpecies;
import com.equipo11.petcare.model.user.Owner;

public record PetAddRequestDTO(
        String name,
        Integer age,
        ESpecies species,
        ESize sizeCategory,
        String careNote,
        Owner owner
) {
}
