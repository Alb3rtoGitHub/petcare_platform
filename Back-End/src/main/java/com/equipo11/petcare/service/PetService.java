package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.PetAddRequestDTO;
import com.equipo11.petcare.dto.PetDeleteRequestDTO;
import com.equipo11.petcare.dto.PetResponseDTO;
import com.equipo11.petcare.dto.PetUpdateRequestDTO;
import com.equipo11.petcare.model.pet.Pet;

public interface PetService {
  PetResponseDTO addpet(PetAddRequestDTO request);

  PetResponseDTO updatePet(PetUpdateRequestDTO request);

  void deletePet(PetDeleteRequestDTO request);

  boolean belongsToOwner(Long petId, Long OwnerId);

  // Validation helpers
  void validatePetExists(Long petId);

  Pet validatePetBelongsToOwner(Long petId, Long ownerId);
}
