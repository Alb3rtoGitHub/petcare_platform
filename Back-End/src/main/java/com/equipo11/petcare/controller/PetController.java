package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.PetAddRequestDTO;
import com.equipo11.petcare.dto.PetResponseDTO;
import com.equipo11.petcare.service.PetService;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/pet")
public class PetController {

    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    //TODO: generar la respuesta de acuerdo a lo que indique el front
    @PostMapping("/{id}")
    @Transactional
    public ResponseEntity<?> createPets(@PathVariable Long ownerId,
                                        List<PetAddRequestDTO> petsList,
                                        @RequestHeader("Authorization") String authHeader) {
        var response = petService.createPets(ownerId, petsList, authHeader);
        return null;
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetResponseDTO> getPet(@PathVariable Long petId) {
        var pet = petService.getPet(petId);
        return new ResponseEntity<>(pet, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<List<PetResponseDTO>> getAllPetsToTheOwner(
                            @PathVariable Long ownerId,
                            @RequestHeader("Authorization") String authHeader) {
        var pets = petService.getAllPets(ownerId, authHeader);
        return new ResponseEntity<>(pets, HttpStatus.OK);
    }
}
