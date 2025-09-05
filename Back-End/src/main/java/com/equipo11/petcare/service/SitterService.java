package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.SitterResponseDTO;
import com.equipo11.petcare.model.user.Sitter;
import org.springframework.data.domain.Page;

import java.util.Optional;

public interface SitterService {
    Optional<Sitter> findSitterById(Long id);
    Page<SitterResponseDTO> getSitters(Long cityId,
                                       int page,
                                       int size,
                                       String sortBy,
                                       String sortDir,
                                       boolean all
    );

}
