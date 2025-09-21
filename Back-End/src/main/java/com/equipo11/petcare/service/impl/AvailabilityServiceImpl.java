package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.AvailabilityRequestDTO;
import com.equipo11.petcare.dto.AvailabilityResponseDTO;
import com.equipo11.petcare.dto.ServiceEntityResponseDTO;
import com.equipo11.petcare.exception.BusinessException;
import com.equipo11.petcare.model.availability.Availability;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import com.equipo11.petcare.model.serviceentity.enums.ServiceName;
import com.equipo11.petcare.model.user.Sitter;
import com.equipo11.petcare.repository.AvailabilityRepository;
import com.equipo11.petcare.repository.ServiceEntityRepository;
import com.equipo11.petcare.service.AvailabilityService;
import com.equipo11.petcare.service.SitterService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AvailabilityServiceImpl implements AvailabilityService {

    private final AvailabilityRepository availabilityRepository;
    private final SitterService sitterService;
    private final ServiceEntityRepository serviceEntityRepository;

    public AvailabilityServiceImpl(AvailabilityRepository availabilityRepository, SitterService sitterService, ServiceEntityRepository serviceEntityRepository) {
        this.availabilityRepository = availabilityRepository;
        this.sitterService = sitterService;
        this.serviceEntityRepository = serviceEntityRepository;
    }

    @Override
    public AvailabilityResponseDTO createAvailability(Long sitterId, AvailabilityRequestDTO availabilityRequestDTO) {
        Sitter sitter = sitterService.findSitterById(sitterId)
                .orElseThrow(() -> new BusinessException("Sitter not found"));

        dateValidation(availabilityRequestDTO.startTime(), availabilityRequestDTO.endTime());
        durationValidation(availabilityRequestDTO.serviceName(), availabilityRequestDTO.startTime(), availabilityRequestDTO.endTime());

        // Buscar el ServiceEntity por su nombre
        ServiceEntity serviceEntity = serviceEntityRepository.findByServiceName(availabilityRequestDTO.serviceName())
                .orElseThrow(() -> new BusinessException("Service not found: " + availabilityRequestDTO.serviceName()));

        // Verificar solapamiento de servicios
        List<Availability> overlappingAvailabilities = availabilityRepository.findOverlappingAvailabilities(
                sitterId,
                availabilityRequestDTO.startTime(),
                availabilityRequestDTO.endTime()
        );

        if (!overlappingAvailabilities.isEmpty()) {
            throw new BusinessException("Availability overlaps with existing schedule");
        }

        Availability availability = Availability.builder()
                .sitter(sitter)
                .serviceEntity(serviceEntity)
                .startTime(availabilityRequestDTO.startTime())
                .endTime(availabilityRequestDTO.endTime())
                .active(true)
                .build();

        Availability savedAvailability = availabilityRepository.save(availability);
        return toResponse(savedAvailability);
    }

    @Override
    public List<AvailabilityResponseDTO> getBySitterId(Long sitterId) {
        return availabilityRepository.findBySitterIdAndServiceNameAndActiveTrue(sitterId, null)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAvailability(Long id) {
        if (!availabilityRepository.existsById(id)) {
            throw new BusinessException("Availability with id " + id + " not found");
        }
        availabilityRepository.deleteById(id);
    }

    @Override
    public AvailabilityResponseDTO updateAvailability(Long id, boolean active) {
        Availability availability = availabilityRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Availability with id " + id + " not found"));

        availability.setActive(active);
        Availability savedAvailability = availabilityRepository.save(availability);
        return toResponse(savedAvailability);
    }

    private void dateValidation(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime.isAfter(endTime)) {
            throw new BusinessException("Start time must be before end time");
        }
    }

    private void durationValidation(ServiceName serviceName, LocalDateTime startTime, LocalDateTime endTime) {
        if (serviceName == ServiceName.WALKING || serviceName == ServiceName.PET_SITTING) {
            long minutes = Duration.between(startTime, endTime).toMinutes();
            boolean isValidDuration = minutes >= 60 && minutes % 60 == 0;

            if (!isValidDuration) {
                throw new BusinessException("Walks and pet sitting must be in full-hour blocks (1h, 2h, 3h, etc.)");
            }
        } else if (serviceName == ServiceName.PET_DAYCARE) {
            // Para PET_DAYCARE, solo verificamos que la fecha de inicio sea antes que la de fin
            if (!startTime.isBefore(endTime)) {
                throw new BusinessException("Start date must be before end date for pet daycare");
            }

            long nights = calculateNights(startTime, endTime);
            //Validar que la duración sea de al menos una noche, sea un valor entero y no sea un valor negativo
            if (nights < 1 || nights % 1 != 0) {
                throw new BusinessException("Pet daycare must be in full-night blocks (1n, 2n, 3n, etc.)");
            }
        }
    }

    private long calculateNights(LocalDateTime start, LocalDateTime end) {
        // Calcula la diferencia en días completos (noches)
        return Duration.between(
                start.toLocalDate().atStartOfDay(),
                end.toLocalDate().atStartOfDay()
        ).toDays();
    }

    private AvailabilityResponseDTO toResponse(Availability availability) {
        ServiceEntity serviceEntity = availability.getServiceEntity();
        ServiceEntityResponseDTO serviceEntityResponseDTO = serviceEntity != null ? new ServiceEntityResponseDTO(
                serviceEntity.getId(),
                serviceEntity.getServiceName(),
                serviceEntity.getDescription(),
                serviceEntity.getPrice(),
                serviceEntity.getDuration(),
                Boolean.TRUE.equals(serviceEntity.getActive())
        ) : null;

        assert availability.getServiceEntity() != null;
        return new AvailabilityResponseDTO(
                availability.getId(),
                availability.getSitter() != null ? availability.getSitter().getId() : null,
                availability.getServiceEntity().getServiceName().name(),
                availability.getStartTime(),
                availability.getEndTime(),
                Boolean.TRUE.equals(availability.getActive())
        );
    }
}
