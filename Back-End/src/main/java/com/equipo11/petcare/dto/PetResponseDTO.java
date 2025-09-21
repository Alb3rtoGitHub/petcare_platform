package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.pet.enums.ESize;
import com.equipo11.petcare.model.pet.enums.ESpecies;
import lombok.Builder;

@Builder
public record PetResponseDTO(
        Long id,
        String name,
        Integer age,
        ESpecies species,
        ESize sizeCategory,
        String careNote,
        String petPhotography
) {
}
