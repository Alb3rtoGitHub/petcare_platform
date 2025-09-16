package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.SitterFullRequestDTO;
import com.equipo11.petcare.dto.SitterFullResponseDTO;
import com.equipo11.petcare.dto.SitterResponseDTO;
import com.equipo11.petcare.model.user.Sitter;
import org.springframework.data.domain.Page;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface SitterService {
  Optional<Sitter> findSitterById(Long id);

  Page<SitterResponseDTO> getSitters(Long cityId,
      int page,
      int size,
      String sortBy,
      String sortDir,
      boolean all);

  List<SitterFullResponseDTO> findAllSitters();

  SitterFullResponseDTO findSitterByUserId(Long userId);

  SitterFullResponseDTO saveSitter(SitterFullRequestDTO sitterFullRequestDTO);

  SitterFullResponseDTO updateSitter(Long id, SitterFullRequestDTO sitterFullRequestDTO);

  void deleteSitter(Long id);

  SitterFullResponseDTO addService(Long sitterId, Long serviceEntityId);

  void removeService(Long sitterId, Long serviceEntityId);

  boolean existsSitterByDocumentNumber(String documentNumber);

  SitterFullResponseDTO updateSitterApproval(Long id, boolean approved);

  List<SitterFullResponseDTO> findSittersByApprovalStatus(boolean approved);

  SitterFullResponseDTO updateSitterRating(Long id);

  boolean hasAvailableSchedule(Long sitterId, LocalDateTime start, LocalDateTime end);

  BigDecimal getServicePrice(Long serviceId, Long sitterId);

  // Validation helper
  void validateSitter(Long sitterId);

  Sitter findById(Long sitterId);
}
