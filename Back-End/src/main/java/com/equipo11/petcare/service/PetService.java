package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.PetAddRequestDTO;
import com.equipo11.petcare.dto.PetResponseDTO;
import com.equipo11.petcare.dto.PetUpdateRequestDTO;
import com.equipo11.petcare.model.pet.Pet;

import java.util.List;

public interface PetService {
  PetResponseDTO createPets(Long ownerId,
      List<PetAddRequestDTO> pets);

  PetResponseDTO getPet(Long petId);

  List<PetResponseDTO> getAllPets(Long ownerId);

  PetResponseDTO updatePet(Long petId,
      PetUpdateRequestDTO request);

  void deletePet(Long id);

  boolean belongsToOwner(Long petId, Long OwnerId);

  // Validation helpers
  void validatePetExists(Long petId);

  Pet validatePetBelongsToOwner(Long petId, Long ownerId);
}
