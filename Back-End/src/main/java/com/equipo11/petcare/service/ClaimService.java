package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.ClaimCreateRequestDTO;
import com.equipo11.petcare.dto.ClaimResponseDTO;
import com.equipo11.petcare.dto.ClaimUpdateRequestDTO;
import com.equipo11.petcare.model.claim.enums.ClaimState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ClaimService {
    ClaimResponseDTO createClaim(ClaimCreateRequestDTO request);
    ClaimResponseDTO getClaim(Long claimId);
    Page<ClaimResponseDTO> getClaims(Long userId, Long bookingId, ClaimState state, Pageable page);
    ClaimResponseDTO updateState(ClaimUpdateRequestDTO request);
}
