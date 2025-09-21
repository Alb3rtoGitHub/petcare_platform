package com.equipo11.petcare.service;


import com.equipo11.petcare.dto.ServiceEntityRequestDTO;
import com.equipo11.petcare.dto.ServiceEntityResponseDTO;
import com.equipo11.petcare.model.serviceentity.enums.ServiceName;


import java.util.List;

public interface ServiceEntityService {
  List<ServiceEntityResponseDTO> findAllServiceEntity();

  ServiceEntityResponseDTO findServiceEntityById(Long id);

  ServiceEntityResponseDTO findServiceEntityByName(ServiceName name);

  ServiceEntityResponseDTO saveServiceEntity(ServiceEntityRequestDTO serviceEntityRequestDTO);

  ServiceEntityResponseDTO updateServiceEntity(Long id, ServiceEntityRequestDTO serviceEntityRequestDTO);

  void deleteServiceEntity(Long id);
}
