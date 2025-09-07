package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.SitterResponseDTO;
import com.equipo11.petcare.service.SitterService;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/sitters")
public class SitterController {

    private final SitterService sitterService;

    public SitterController(SitterService sitterService) {
        this.sitterService = sitterService;
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
}
