package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.PetAddRequestDTO;
import com.equipo11.petcare.dto.PetDeleteRequestDTO;
import com.equipo11.petcare.dto.PetResponseDTO;
import com.equipo11.petcare.dto.PetUpdateRequestDTO;
import com.equipo11.petcare.model.pet.Pet;
import com.equipo11.petcare.repository.PetRepository;
import com.equipo11.petcare.service.PetService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PetServiceImpl implements PetService {
  private final PetRepository petRepository;

  @Override
  public PetResponseDTO addpet(PetAddRequestDTO request) {
    return null;
  }

  @Override
  public PetResponseDTO updatePet(PetUpdateRequestDTO request) {
    return null;
  }

  @Override
  public void deletePet(PetDeleteRequestDTO request) {

  }

  @Override
  public boolean belongsToOwner(Long petId, Long OwnerId) {
    return petRepository.findById(petId)
        .map(Pet::getOwner)
        .map(owner -> owner.getId().equals(OwnerId))
        .orElse(false);
  }

  @Override
  public void validatePetExists(Long petId) {
    if (petId == null || !petRepository.existsById(petId)) {
      throw new ValidationException("La mascota no existe");
    }
  }

  @Override
  public Pet validatePetBelongsToOwner(Long petId, Long ownerId) {
    Pet pet = petRepository.findById(petId)
        .orElseThrow(() -> new ValidationException("La mascota no existe"));
    if (pet.getOwner() == null || !pet.getOwner().getId().equals(ownerId)) {
      throw new ValidationException("La mascota no pertenece al propietario indicado");
    }
    return pet;
  }
}
