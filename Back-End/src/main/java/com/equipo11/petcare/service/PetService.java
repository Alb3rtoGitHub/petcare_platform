package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.PetAddRequestDTO;
import com.equipo11.petcare.dto.PetResponseDTO;
import com.equipo11.petcare.dto.PetUpdateRequestDTO;

import java.util.List;

public interface PetService {
    PetResponseDTO createPets(Long ownerId,
                              List<PetAddRequestDTO> pets);

    PetResponseDTO getPet(Long petId);

    List<PetResponseDTO> getAllPets(Long ownerId);

    PetResponseDTO updatePet(Long petId,
                             PetUpdateRequestDTO request);

    void deletePet(Long id);
}
