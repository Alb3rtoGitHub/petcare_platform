package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.SitterFullRequestDTO;
import com.equipo11.petcare.dto.SitterFullResponseDTO;
import com.equipo11.petcare.dto.SitterPatchRequestDTO;
import com.equipo11.petcare.dto.SitterResponseDTO;
import com.equipo11.petcare.model.user.Sitter;
import org.springframework.data.domain.Page;

import java.util.List;
import java.util.Optional;

public interface SitterService {
    Optional<Sitter> findSitterById(Long id);

    Page<SitterFullResponseDTO> getSitters(Long cityId,
                                       int page,
                                       int size,
                                       String sortBy,
                                       String sortDir,
                                       boolean all
    );

    List<SitterFullResponseDTO> findAllSitters();

    SitterFullResponseDTO findSitterByUserId(Long userId);

    SitterFullResponseDTO saveSitterDocuments(SitterPatchRequestDTO sitterPatchRequestDTO);

    SitterFullResponseDTO updateSitter(Long id, SitterFullRequestDTO sitterFullRequestDTO);

    void deleteSitter(Long id);

    SitterFullResponseDTO addService(Long sitterId, Long serviceEntityId);

    void removeService(Long sitterId, Long serviceEntityId);

    boolean existsSitterByDocumentNumber(String documentNumber);

    SitterFullResponseDTO updateSitterApproval(Long id, boolean approved);

    List<SitterFullResponseDTO> findSittersByApprovalStatus(boolean approved);

    SitterFullResponseDTO updateSitterRating(Long id);
}
