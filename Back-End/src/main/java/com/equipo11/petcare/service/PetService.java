package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.PetAddRequestDTO;
import com.equipo11.petcare.dto.PetDeleteRequestDTO;
import com.equipo11.petcare.dto.PetResponseDTO;
import com.equipo11.petcare.dto.PetUpdateRequestDTO;

import java.util.List;

public interface PetService {
    PetResponseDTO createPets(Long ownerId,
                              List<PetAddRequestDTO> pets,
                              String authHeader);

    PetResponseDTO getPet(Long petId);

    List<PetResponseDTO> getAllPets(Long ownerId,
                                    String authHeader);

    PetResponseDTO updatePet(PetUpdateRequestDTO request);

    void deletePet(PetDeleteRequestDTO request);
}
