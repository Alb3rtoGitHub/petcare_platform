package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.AvailabilityRequestDTO;
import com.equipo11.petcare.dto.AvailabilityResponseDTO;

import java.util.List;

public interface AvailabilityService {
    AvailabilityResponseDTO createAvailability(Long sitterId, AvailabilityRequestDTO availabilityRequest);
    List<AvailabilityResponseDTO> getBySitterId(Long sitterId);
    void deleteAvailability(Long id);
    AvailabilityResponseDTO updateAvailability(Long id, boolean active);
}
