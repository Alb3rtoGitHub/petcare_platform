package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.PetAddRequestDTO;
import com.equipo11.petcare.dto.PetDeleteRequestDTO;
import com.equipo11.petcare.dto.PetResponseDTO;
import com.equipo11.petcare.dto.PetUpdateRequestDTO;

public interface PetService {
    PetResponseDTO addpet(PetAddRequestDTO request);

    PetResponseDTO updatePet(PetUpdateRequestDTO request);

    void deletePet(PetDeleteRequestDTO request);
}
