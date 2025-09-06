package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.PetAddRequestDTO;
import com.equipo11.petcare.dto.PetResponseDTO;
import com.equipo11.petcare.dto.PetUpdateRequestDTO;
import com.equipo11.petcare.model.pet.Pet;
import com.equipo11.petcare.model.user.Owner;
import com.equipo11.petcare.repository.PetRepository;
import com.equipo11.petcare.repository.UserRepository;
import com.equipo11.petcare.security.SecurityService;
import com.equipo11.petcare.security.jwt.TokenParser;
import com.equipo11.petcare.service.PetService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetServiceImpl implements PetService {

    private final SecurityService securityService;
    private final PetRepository petRepository;
    private final UserRepository userRepository;
    private final TokenParser tokenParser;

    public PetServiceImpl(SecurityService securityService,
                          PetRepository petRepository,
                          UserRepository userRepository,
                          TokenParser tokenParser) {
        this.securityService = securityService;
        this.petRepository = petRepository;
        this.userRepository = userRepository;
        this.tokenParser = tokenParser;
    }

    @Override
    public PetResponseDTO createPets(Long ownerId,
                                     List<PetAddRequestDTO> pets,
                                     String token) {
        var owner = (Owner) securityService.verifyUserOrToken(ownerId, token);
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
                .id(pet.getId())
                .name(pet.getName())
                .age(pet.getAge())
                .species(pet.getSpecies())
                .sizeCategory(pet.getSizeCategory())
                .careNote(pet.getCareNote())
                .build();
    }

    @Override
    public List<PetResponseDTO> getAllPets(Long ownerId,
                                           String token) {
        var owner = (Owner) securityService.verifyUserOrToken(ownerId, token);
        var pets = petRepository.findAllByOwnerId(owner.getId());
        if (pets.isEmpty())
            throw new EntityNotFoundException("No hay mascotas para el usuario");
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
    public PetResponseDTO updatePet(Long petId,
                                    PetUpdateRequestDTO petDTO,
                                    String token) {
        var pet = petRepository.findById(petId)
                .orElseThrow(() -> new EntityNotFoundException("Mascota no encontrada"));
        var owner = userRepository.findByEmail(tokenParser.extractEmail(token.substring(7)))
                .orElseThrow(() -> new EntityNotFoundException("Usuario no válido"));
        if (pet.getOwner().equals(owner)) {
            pet.setName(petDTO.name());
            pet.setAge(petDTO.age());
            pet.setSpecies(petDTO.species());
            pet.setSizeCategory(petDTO.sizeCategory());
            pet.setCareNote(petDTO.careNote());
        } else {
            throw new IllegalArgumentException("La mascota no pertenece a es usuario");
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
    public void deletePet(Long petId, String token) {
        var pet = petRepository.findById(petId)
                .orElseThrow(() -> new EntityNotFoundException("Mascota no encontrada"));
        var owner = userRepository.findByEmail(tokenParser.extractEmail(token.substring(7)))
                .orElseThrow(() -> new EntityNotFoundException("Usuario no válido"));
        if (!pet.getOwner().getId().equals(owner.getId())) {
            throw new IllegalArgumentException("La mascota no pertenece al dueño");
        }
        pet.setActive(false);
        petRepository.save(pet);
    }
}
