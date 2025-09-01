package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.AvailabilityRequestDTO;
import com.equipo11.petcare.dto.AvailabilityResponseDTO;
import com.equipo11.petcare.exception.BusinessException;
import com.equipo11.petcare.model.availability.Availability;
import com.equipo11.petcare.model.availability.enums.ServiceName;
import com.equipo11.petcare.model.user.Sitter;
import com.equipo11.petcare.repository.AvailabilityRepository;
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
    private final UserService userService;

    // Precios mínimos recomendados para cada servicio
    private static final double MIN_HOURLY_RATE = 10.0;  // Precio mínimo por hora
    private static final double MIN_DAILY_RATE = 30.0;   // Precio mínimo por día

    public AvailabilityServiceImpl(AvailabilityRepository availabilityRepository, UserService userService) {
        this.availabilityRepository = availabilityRepository;
        this.userService = userService;
    }

    @Override
    public AvailabilityResponseDTO createAvailability(Long sitterId, AvailabilityRequestDTO availabilityRequestDTO) {
        System.out.println("Id" + sitterId);
        Sitter sitter = userService.findSitterById(sitterId)
                .orElseThrow(() -> new BusinessException("Sitter not found"));

        dateValidation(availabilityRequestDTO.startTime(), availabilityRequestDTO.endTime());
        durationValidation(availabilityRequestDTO.serviceName(), availabilityRequestDTO.startTime(), availabilityRequestDTO.endTime());

        // Verificar solapamiento de servicios
        List<Availability> overlappingAvailabilities = availabilityRepository.findOverlappingAvailabilities(
                sitterId,
                availabilityRequestDTO.startTime(),
                availabilityRequestDTO.endTime()
        );

        if (!overlappingAvailabilities.isEmpty()) {
            throw new BusinessException("Availability overlaps with existing schedule");
        }

        // Validar que el precio sea apropiado para el tipo de servicio
        validatePrice(
                availabilityRequestDTO.serviceName(),
                availabilityRequestDTO.startTime(),
                availabilityRequestDTO.endTime(),
                availabilityRequestDTO.price()
        );

        Availability availability = Availability.builder()
                .sitter(sitter)
                .serviceName(availabilityRequestDTO.serviceName())
                .startTime(availabilityRequestDTO.startTime())
                .endTime(availabilityRequestDTO.endTime())
                .active(true)
                .price(availabilityRequestDTO.price())
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
        }
    }

    private long calculateNights(LocalDateTime start, LocalDateTime end) {
        // Calcula la diferencia en días completos (noches)
        return java.time.Duration.between(
                start.toLocalDate().atStartOfDay(),
                end.toLocalDate().atStartOfDay()
        ).toDays();
    }

    private void validatePrice(ServiceName serviceName, LocalDateTime startTime, LocalDateTime endTime, double price) {
        double minExpectedPrice;

        switch (serviceName) {
            case WALKING, PET_SITTING -> {
                long hours = Duration.between(startTime, endTime).toHours();
                minExpectedPrice = hours * MIN_HOURLY_RATE;

                if (price < minExpectedPrice) {
                    throw new BusinessException(String.format(
                            "El precio mínimo para %s es de $%.2f por hora. Para %d hora(s), el precio mínimo es $%.2f",
                            serviceName.toString().toLowerCase(), MIN_HOURLY_RATE, hours, minExpectedPrice
                    ));
                }
            }
            case PET_DAYCARE -> {
                long nights = calculateNights(startTime, endTime);
                minExpectedPrice = nights * MIN_DAILY_RATE;

                if (price < minExpectedPrice) {
                    throw new BusinessException(String.format(
                            "El precio mínimo para guardería es de $%.2f por noche. Para %d noche(s), el precio mínimo es $%.2f",
                            MIN_DAILY_RATE, nights, minExpectedPrice
                    ));
                }
            }
        }

    }

    private AvailabilityResponseDTO toResponse(Availability availability) {
        return new AvailabilityResponseDTO(
                availability.getId(),
                availability.getSitter().getId(),
                availability.getServiceName(),
                availability.getStartTime(),
                availability.getEndTime(),
                availability.getPrice(),
                availability.getActive()
        );
    }
}
