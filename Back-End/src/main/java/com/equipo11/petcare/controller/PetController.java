package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.PetAddRequestDTO;
import com.equipo11.petcare.service.PetService;
import jakarta.transaction.Transactional;
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
    @PostMapping("/id")
    @Transactional
    public ResponseEntity<?> createPets(@PathVariable Long ownerId,
                                        List<PetAddRequestDTO> request,
                                        @RequestHeader("Authorization") String authHeader) {
        var response = petService.createPets(ownerId, request, authHeader);
        return null;
    }
}
