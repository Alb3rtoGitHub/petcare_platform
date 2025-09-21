package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.PetAddRequestDTO;
import com.equipo11.petcare.dto.PetResponseDTO;
import com.equipo11.petcare.dto.PetUpdateRequestDTO;
import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.exception.enums.ApiError;
import com.equipo11.petcare.model.pet.Pet;
import com.equipo11.petcare.model.user.Owner;
import com.equipo11.petcare.repository.PetRepository;
import com.equipo11.petcare.security.SecurityService;
import com.equipo11.petcare.service.PetService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetServiceImpl implements PetService {

    private final SecurityService securityService;
    private final PetRepository petRepository;

    public PetServiceImpl(SecurityService securityService,
                          PetRepository petRepository) {
        this.securityService = securityService;
        this.petRepository = petRepository;
    }

    @Override
    @Transactional
    public PetResponseDTO createPets(Long ownerId,
                                     List<PetAddRequestDTO> pets) {
        if (pets.isEmpty()) {
            throw new PetcareException(ApiError.PET_LIST_EMPTY);
        }
        var owner = (Owner) securityService.verifyUserOrToken(ownerId);
        List<Pet> petsList = pets.stream().map(pet -> Pet.builder()
                        .name(pet.name())
                        .age(pet.age())
                        .species(pet.species())
                        .sizeCategory(pet.sizeCategory())
                        .careNote(pet.careNote())
                        .owner(owner)
                        .isActive(true)
                        .build())
                .toList();

        List<Pet> savedPets = petRepository.saveAll(petsList);

        return null;
    }

    @Override
    public PetResponseDTO getPet(Long petId) {
        var pet = findPet(petId);
        return PetResponseDTO.builder()
                .id(pet.getId())
                .name(pet.getName())
                .age(pet.getAge())
                .species(pet.getSpecies())
                .sizeCategory(pet.getSizeCategory())
                .careNote(pet.getCareNote())
                .build();
    }

    @Override
    public List<PetResponseDTO> getAllPets(Long ownerId) {
        var owner = (Owner) securityService.verifyUserOrToken(ownerId);
        var pets = petRepository.findAllByOwnerId(owner.getId());
        if (pets.isEmpty())
            throw new PetcareException(ApiError.USER_HAS_NO_PETS);
        return pets.stream()
                .map(pet -> PetResponseDTO.builder()
                        .id(pet.getId())
                        .name(pet.getName())
                        .age(pet.getAge())
                        .species(pet.getSpecies())
                        .sizeCategory(pet.getSizeCategory())
                        .careNote(pet.getCareNote())
                        .build())
                .toList();
    }

    @Override
    @Transactional
    public PetResponseDTO updatePet(Long petId,
                                    PetUpdateRequestDTO petDTO) {
        var pet = findPet(petId);
        var owner = (Owner) securityService.userAuthenticate();
        if (pet.getOwner().equals(owner)) {
            pet.setName(petDTO.name());
            pet.setAge(petDTO.age());
            pet.setSpecies(petDTO.species());
            pet.setSizeCategory(petDTO.sizeCategory());
            pet.setCareNote(petDTO.careNote());
        } else {
            throw new PetcareException(ApiError.PET_NOT_OWNED_BY_USER);
        }
        return PetResponseDTO.builder()
                .id(pet.getId())
                .name(pet.getName())
                .age(pet.getAge())
                .species(pet.getSpecies())
                .sizeCategory(pet.getSizeCategory())
                .careNote(pet.getCareNote())
                .build();
    }

    @Override
    @Transactional
    public void deletePet(Long petId) {
        var pet = findPet(petId);
        var owner = securityService.userAuthenticate();
        if (!pet.getOwner().equals(owner)) {
            throw new PetcareException(ApiError.PET_NOT_OWNED_BY_USER);
        }
        pet.setActive(false);
        petRepository.save(pet);
    }

    private Pet findPet(Long petId) {
        return petRepository.findById(petId)
                .orElseThrow(() -> new PetcareException(ApiError.PET_NOT_FOUND));
    }
}
