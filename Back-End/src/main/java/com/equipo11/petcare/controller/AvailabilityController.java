package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.AvailabilityRequestDTO;
import com.equipo11.petcare.dto.AvailabilityResponseDTO;
import com.equipo11.petcare.service.AvailabilityService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/availabilities")
public class AvailabilityController {

    private final AvailabilityService availabilityService;

    public AvailabilityController(AvailabilityService availabilityService) {
        this.availabilityService = availabilityService;
    }

    @PostMapping("/sitters/{sitterId}")
    public ResponseEntity<AvailabilityResponseDTO> createAvailability(
            @PathVariable Long sitterId,
            @Valid @RequestBody AvailabilityRequestDTO availabilityRequest) {

        AvailabilityResponseDTO availabilityResponseDTO = availabilityService.createAvailability(sitterId, availabilityRequest);
        return ResponseEntity.created(URI.create("/api/v1/availabilities/" + availabilityResponseDTO.id())).body(availabilityResponseDTO);
    }

    @GetMapping("/sitters/{sitterId}")
    public ResponseEntity<List<AvailabilityResponseDTO>> getBySitterId(@PathVariable Long sitterId) {
        return ResponseEntity.ok(availabilityService.getBySitterId(sitterId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAvailability(@PathVariable Long id) {
        availabilityService.deleteAvailability(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/active")
    public ResponseEntity<AvailabilityResponseDTO> updateAvailability(
            @PathVariable Long id,
            @RequestParam boolean active) {
        return ResponseEntity.ok(availabilityService.updateAvailability(id, active));
    }
}
