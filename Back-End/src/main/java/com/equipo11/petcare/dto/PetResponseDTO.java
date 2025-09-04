package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.ESize;
import com.equipo11.petcare.model.ESpecies;
import lombok.Builder;

@Builder
public record PetResponseDTO(
        String name,
        Integer age,
        ESpecies species,
        ESize sizeCategory,
        String careNote
) {
}
