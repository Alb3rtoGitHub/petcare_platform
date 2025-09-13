package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.enums.ApiError;
import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import com.equipo11.petcare.repository.ServiceEntityRepository;
import com.equipo11.petcare.service.ServiceEntityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ServiceEntityServiceImpl implements ServiceEntityService {
  private final ServiceEntityRepository serviceRepository;

  @Override
  public List<ServiceEntity> validateServices(List<Long> serviceIds) {
    if (serviceIds == null || serviceIds.isEmpty()) {
      throw new PetcareException(ApiError.VALIDATION_ERROR);
    }

    Set<Long> requested = Set.copyOf(serviceIds);

    List<ServiceEntity> foundServiceEntities = serviceRepository.findAllById(requested);

    if (foundServiceEntities.size() != requested.size()) {
      // identify missing for better feedback (optional minimal)
      Set<Long> existing = foundServiceEntities.stream()
          .map(s -> s.getId())
          .collect(Collectors.toSet());
      requested.removeAll(existing);
      throw new PetcareException(ApiError.RESOURCE_NOT_FOUND);
    }
    return foundServiceEntities;
  }
}
