package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.SitterResponseDTO;
import com.equipo11.petcare.model.user.Sitter;
import org.springframework.data.domain.Page;

import java.util.List;
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

    List<SitterFullResponseDTO> findAllSitters();
    SitterFullResponseDTO findSitterByUserId(Long userId);
    SitterFullResponseDTO saveSitter(SitterFullRequestDTO sitterFullRequestDTO);
    SitterFullResponseDTO updateSitter(Long id, SitterFullRequestDTO sitterFullRequestDTO);
    void deleteSitter(Long id);
    SitterFullResponseDTO addService(Long sitterId, Long serviceEntityId);
    void removeService(Long sitterId, Long serviceEntityId);

}
