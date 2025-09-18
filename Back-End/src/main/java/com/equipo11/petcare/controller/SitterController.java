package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.SitterFullRequestDTO;
import com.equipo11.petcare.dto.SitterFullResponseDTO;
import com.equipo11.petcare.dto.SitterPatchRequestDTO;
import com.equipo11.petcare.dto.SitterResponseDTO;
import com.equipo11.petcare.service.SitterDocumentsService;
import com.equipo11.petcare.service.SitterService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sitters")
public class SitterController {

    private final SitterService sitterService;
    private final SitterDocumentsService sitterDocumentsService;

    public SitterController(SitterService sitterService,
                            SitterDocumentsService sitterDocumentsService) {
        this.sitterService = sitterService;
        this.sitterDocumentsService = sitterDocumentsService;
    }

    @GetMapping
    public ResponseEntity<Page<SitterResponseDTO>> getSitters(
            @RequestParam(required = false) Long cityId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "averageRating") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir,
            @RequestParam(defaultValue = "false") boolean all

    ) {
        var response = sitterService.getSitters(
                cityId,
                page,
                size,
                sortBy,
                sortDir,
                all
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/all")
    public ResponseEntity<List<SitterFullResponseDTO>> getAllSitters() {
        List<SitterFullResponseDTO> sitters = sitterService.findAllSitters();
        return new ResponseEntity<>(sitters, HttpStatus.OK);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<SitterFullResponseDTO> getSitterByUserId(@PathVariable Long userId) {
        SitterFullResponseDTO sitter = sitterService.findSitterByUserId(userId);
        return new ResponseEntity<>(sitter, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SitterFullResponseDTO> getSitterById(@PathVariable Long id) {
        return sitterService.findSitterById(id)
                .map(sitter -> new ResponseEntity<>(
                        sitterService.findSitterByUserId(sitter.getId()),
                        HttpStatus.OK
                ))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PatchMapping(value ="/{sitterId}/documents", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SitterFullResponseDTO> loadSitterDocuments(
            @PathVariable Long sitterId,
            @RequestPart("data") @Valid SitterPatchRequestDTO sitterPatchRequestDTO,
            @RequestPart(value = "idCard", required = false)MultipartFile idCard,
            @RequestPart(value = "backgroundCheckDocument", required = false)MultipartFile backgroundCheckDocument
            ) {
        if (!sitterId.equals(sitterPatchRequestDTO.sitterId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Sitter ID in path does not match the request body");
        }
        SitterFullResponseDTO response = sitterDocumentsService.loadCredentials(
                sitterId,
                sitterPatchRequestDTO,
                idCard,
                backgroundCheckDocument);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SitterFullResponseDTO> updateSitter(
            @PathVariable Long id,
            @Valid @RequestBody SitterFullRequestDTO sitterFullRequestDTO
    ) {
        SitterFullResponseDTO updatedSitter = sitterService.updateSitter(id, sitterFullRequestDTO);
        return new ResponseEntity<>(updatedSitter, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSitter(@PathVariable Long id) {
        sitterService.deleteSitter(id);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @PostMapping("/{sitterId}/services/{serviceEntityId}")
    public ResponseEntity<SitterFullResponseDTO> addService(
            @PathVariable Long sitterId,
            @PathVariable Long serviceEntityId
    ) {
        return ResponseEntity.ok(sitterService.addService(sitterId, serviceEntityId));
    }

    @DeleteMapping("/{sitterId}/services/{serviceEntityId}")
    public ResponseEntity<Void> removeService(
            @PathVariable Long sitterId,
            @PathVariable Long serviceEntityId
    ) {
        sitterService.removeService(sitterId, serviceEntityId);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/approval")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SitterFullResponseDTO> updateSitterApproval(
            @PathVariable Long id,
            @RequestParam boolean approved) {
        SitterFullResponseDTO updatedSitter = sitterService.updateSitterApproval(id, approved);
        return new ResponseEntity<>(updatedSitter, HttpStatus.OK);
    }

    @GetMapping("/pending-approval")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SitterFullResponseDTO>> getPendingApprovalSitters() {
        List<SitterFullResponseDTO> pendingSitters = sitterService.findSittersByApprovalStatus(false);
        return new ResponseEntity<>(pendingSitters, HttpStatus.OK);
    }

    @PostMapping("/{id}/update-rating")
    public ResponseEntity<SitterFullResponseDTO> updateSitterRating(@PathVariable Long id) {
        SitterFullResponseDTO updatedSitter = sitterService.updateSitterRating(id);
        return new ResponseEntity<>(updatedSitter, HttpStatus.OK);
    }
}
