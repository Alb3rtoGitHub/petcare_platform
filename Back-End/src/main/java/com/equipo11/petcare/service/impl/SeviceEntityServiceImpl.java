package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.ServiceEntityRequestDTO;
import com.equipo11.petcare.dto.ServiceEntityResponseDTO;
import com.equipo11.petcare.exception.BusinessException;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import com.equipo11.petcare.model.serviceentity.enums.ServiceName;
import com.equipo11.petcare.repository.ServiceEntityRepository;
import com.equipo11.petcare.service.ServiceEntityService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeviceEntityServiceImpl implements ServiceEntityService {

    private final ServiceEntityRepository serviceEntityRepository;

    public SeviceEntityServiceImpl(ServiceEntityRepository serviceEntityRepository) {
        this.serviceEntityRepository = serviceEntityRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceEntityResponseDTO> findAllServiceEntity() {
        return serviceEntityRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }


    @Override
    @Transactional(readOnly = true)
    public ServiceEntityResponseDTO findServiceEntityById(Long id) {
        ServiceEntity serviceEntity = serviceEntityRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Service entity not found with id: " + id));
        return toResponse(serviceEntity);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceEntityResponseDTO findServiceEntityByName(ServiceName name) {
        ServiceEntity serviceEntity = serviceEntityRepository.findByServiceName(name)
                .orElseThrow(() -> new BusinessException("Service not found with name: " + name));
        return toResponse(serviceEntity);
    }

    @Override
    @Transactional
    public ServiceEntityResponseDTO saveServiceEntity(ServiceEntityRequestDTO serviceEntityRequestDTO) {
        ServiceEntity serviceEntity = ServiceEntity.builder()
                .serviceName(serviceEntityRequestDTO.serviceName())
                .description(serviceEntityRequestDTO.description())
                .price(serviceEntityRequestDTO.price())
                .duration(serviceEntityRequestDTO.duration())
                .active(serviceEntityRequestDTO.active())
                .build();
        ServiceEntity savedServiceEntity = serviceEntityRepository.save(serviceEntity);
        return toResponse(savedServiceEntity);
    }

    @Override
    @Transactional
    public ServiceEntityResponseDTO updateServiceEntity(Long id, ServiceEntityRequestDTO serviceEntityRequestDTO) {
        ServiceEntity existingServiceEntity = serviceEntityRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Service entity not found with id: " + id));
        existingServiceEntity.setServiceName(serviceEntityRequestDTO.serviceName());
        existingServiceEntity.setDescription(serviceEntityRequestDTO.description());
        existingServiceEntity.setPrice(serviceEntityRequestDTO.price());
        existingServiceEntity.setDuration(serviceEntityRequestDTO.duration());
        existingServiceEntity.setActive(serviceEntityRequestDTO.active());

        ServiceEntity updatedExistingServiceEntity = serviceEntityRepository.save(existingServiceEntity);
        return toResponse(updatedExistingServiceEntity);
    }

    @Override
    @Transactional
    public void deleteServiceEntity(Long id) {
        if (!serviceEntityRepository.existsById(id)) {
            throw new BusinessException("Service entity not found with id: " + id);
        }
        serviceEntityRepository.deleteById(id);
    }

    private ServiceEntityResponseDTO toResponse(ServiceEntity serviceEntity) {
        return new ServiceEntityResponseDTO(
                serviceEntity.getId(),
                serviceEntity.getServiceName(),
                serviceEntity.getDescription(),
                serviceEntity.getPrice(),
                serviceEntity.getDuration(),
                serviceEntity.getActive()
        );
    }
}
