package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.PetAddRequestDTO;
import com.equipo11.petcare.dto.PetDeleteRequestDTO;
import com.equipo11.petcare.dto.PetResponseDTO;
import com.equipo11.petcare.dto.PetUpdateRequestDTO;
import com.equipo11.petcare.model.Pet;
import com.equipo11.petcare.model.user.Owner;
import com.equipo11.petcare.repository.PetRepository;
import com.equipo11.petcare.security.SecurityService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PetServiceImpl implements PetService{

    private final SecurityService securityService;
    private final PetRepository petRepository;

    public PetServiceImpl(SecurityService securityService,
                          PetRepository petRepository) {
        this.securityService = securityService;
        this.petRepository = petRepository;
    }

    @Override
    public PetResponseDTO createPets(Long ownerId,
                                     List<PetAddRequestDTO> pets,
                                     String authHeader) {
        var owner = (Owner) securityService.verifyUserOrToken(ownerId, authHeader);
        List<Pet> petsList = pets.stream().map(pet -> Pet.builder()
                .name(pet.name())
                .age(pet.age())
                .species(pet.species())
                .sizeCategory(pet.sizeCategory())
                .careNote(pet.careNote())
                .owner(owner)
                .build())
                .toList();

        if (pets.isEmpty()) {
            throw new IllegalArgumentException("La lista de mascotas está vacía");
        }

        List<Pet> savedPets = petRepository.saveAll(petsList);

        return null;
    }

    @Override
    public PetResponseDTO getPet(Long petId) {
        var pet = petRepository.findById(petId)
                .orElseThrow(() -> new EntityNotFoundException("Mascota no encontrada"));
        return PetResponseDTO.builder()
                .name(pet.getName())
                .age(pet.getAge())
                .species(pet.getSpecies())
                .sizeCategory(pet.getSizeCategory())
                .careNote(pet.getCareNote())
                .build();
    }

    @Override
    public List<PetResponseDTO> getAllPets(Long ownerId,
                                           String authHeader) {
        return List.of();
    }

    @Override
    public PetResponseDTO updatePet(PetUpdateRequestDTO request) {
        return null;
    }

    @Override
    public void deletePet(PetDeleteRequestDTO request) {

    }
}
