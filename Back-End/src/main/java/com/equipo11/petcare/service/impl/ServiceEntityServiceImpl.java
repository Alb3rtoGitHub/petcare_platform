package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.enums.ApiError;
import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.repository.JpaServiceEntityRepository;
import com.equipo11.petcare.service.ServiceEntityService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceEntityServiceImpl implements ServiceEntityService {
  private final JpaServiceEntityRepository serviceRepository;

  @Override
  public void validateServices(List<UUID> serviceIds) {
    if (serviceIds == null || serviceIds.isEmpty()) {
      throw new PetcareException(ApiError.VALIDATION_ERROR);
    }
    Set<UUID> requested = Set.copyOf(serviceIds);
    long found = serviceRepository.findAllById(requested).size();
    if (found != requested.size()) {
      // identify missing for better feedback (optional minimal)
      Set<UUID> existing = serviceRepository.findAllById(requested).stream()
          .map(s -> s.getId())
          .collect(Collectors.toSet());
      requested.removeAll(existing);
      throw new PetcareException(ApiError.RESOURCE_NOT_FOUND);
    }
  }
}
