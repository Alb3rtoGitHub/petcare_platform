package com.equipo11.petcare.controller;


import com.equipo11.petcare.dto.ClaimCreateRequestDTO;
import com.equipo11.petcare.dto.ClaimResponseDTO;
import com.equipo11.petcare.dto.ClaimUpdateRequestDTO;
import com.equipo11.petcare.model.claim.enums.ClaimState;
import com.equipo11.petcare.service.ClaimService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/claims")
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping
    public ResponseEntity<ClaimResponseDTO> createClaim(
            @Valid @RequestBody ClaimCreateRequestDTO request
            ) {
        var response = claimService.createClaim(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClaimResponseDTO> getClaim(@PathVariable Long id) {
        var response = claimService.getClaim(id);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<Page<ClaimResponseDTO>> getClaims(
            @RequestParam(value = "userId",    required = false) Long userId,
            @RequestParam(value = "bookingId", required = false) Long bookingId,
            @RequestParam(value = "state",     required = false) ClaimState state,
            Pageable page

    ) {
        var response = claimService.getClaims(userId, bookingId, state, page);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<ClaimResponseDTO> updateClaim(
            @Valid @RequestBody ClaimUpdateRequestDTO request) {
        var response = claimService.updateState(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
