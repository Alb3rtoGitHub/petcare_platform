package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.*;
import com.equipo11.petcare.exception.BusinessException;
import com.equipo11.petcare.model.review.Review;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import com.equipo11.petcare.model.user.Sitter;
import com.equipo11.petcare.model.user.enums.ERole;
import com.equipo11.petcare.repository.ServiceEntityRepository;
import com.equipo11.petcare.repository.SitterRepository;
import com.equipo11.petcare.service.SitterService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class SitterServiceImpl implements SitterService {

    private final SitterRepository sitterRepository;
    private final ServiceEntityRepository serviceEntityRepository;
    private final PasswordEncoder passwordEncoder;

    public SitterServiceImpl(SitterRepository sitterRepository, ServiceEntityRepository serviceEntityRepository, PasswordEncoder passwordEncoder) {
        this.sitterRepository = sitterRepository;
        this.serviceEntityRepository = serviceEntityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public Optional<Sitter> findSitterById(Long id) {
        if (id == null) {
            throw new BusinessException("Sitter ID cannot be null");
        }

        return sitterRepository.findById(id);
    }

    @Override
    public Page<SitterResponseDTO> getSitters(
            Long cityId,
            int page,
            int size,
            String sortBy,
            String sortDir,
            boolean all
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);

        Pageable pageable = all
                ? PageRequest.of(0, Integer.MAX_VALUE, sort)
                : PageRequest.of(page, size, sort);

        Page<Sitter> sitterPage = (cityId != null)
                ? sitterRepository.findByAddressCityIdAndEnabledTrue(cityId, pageable)
                : sitterRepository.findAllByEnabledTrue(pageable);

        return sitterPage.map(this::toResponseDto);
    }

    @Override
    public List<SitterFullResponseDTO> findAllSitters() {
        return sitterRepository.findAll()
                .stream().map(this::toFullResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public SitterFullResponseDTO findSitterByUserId(Long userId) {
        Sitter sitter = sitterRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Sitter not found with id: " + userId));
        return toFullResponseDto(sitter);
    }

    @Override
    @Transactional
    public void deleteSitter(Long id) {
        Sitter sitter = sitterRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Sitter not found with id: " + id));
        sitter.setEnabled(false);
        sitterRepository.save(sitter);
    }

    @Override
    @Transactional
    public SitterFullResponseDTO addService(Long sitterId, Long serviceEntityId) {
        Sitter sitter = sitterRepository.findById(sitterId)
                .orElseThrow(() -> new BusinessException("Sitter not found with id: " + sitterId));

        ServiceEntity serviceEntity = serviceEntityRepository.findById(serviceEntityId)
                .orElseThrow(() -> new BusinessException("Service entity not found with id: " + serviceEntityId));

        sitter.addService(serviceEntity);
        Sitter updatedSitter = sitterRepository.save(sitter);
        return toFullResponseDto(updatedSitter);
    }

    @Override
    @Transactional
    public void removeService(Long sitterId, Long serviceEntityId) {
        Sitter sitter = sitterRepository.findById(sitterId)
                .orElseThrow(() -> new BusinessException("Sitter not found with id: " + sitterId));

        ServiceEntity serviceEntity = serviceEntityRepository.findById(serviceEntityId)
                .orElseThrow(() -> new BusinessException("Service entity not found with id: " + serviceEntityId));

        sitter.removeService(serviceEntity);
        sitterRepository.save(sitter);
    }

    @Override
    public boolean existsSitterByDocumentNumber(String documentNumber) {
        return sitterRepository.existsSitterByDocumentNumber(documentNumber);
    }

    @Override
    @Transactional
    public SitterFullResponseDTO updateSitter(Long id, SitterFullRequestDTO sitterFullRequestDTO) {
        Sitter existingSitter = sitterRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Sitter not found with id: " + id));

        if (!existingSitter.getDocumentNumber().equals(sitterFullRequestDTO.documentNumber()) &&
            sitterRepository.existsSitterByDocumentNumber(sitterFullRequestDTO.documentNumber())) {
            throw new BusinessException("Sitter already exists with document number: " + sitterFullRequestDTO.documentNumber());
        }

        // Actualizar campos básicos
        existingSitter.setFirstName(sitterFullRequestDTO.firstName());
        existingSitter.setLastName(sitterFullRequestDTO.lastName());
        existingSitter.setBirthDate(sitterFullRequestDTO.birthDate());
        existingSitter.setPhoneNumber(sitterFullRequestDTO.phoneNumber());
        existingSitter.setDocumentType(sitterFullRequestDTO.documentType());
        existingSitter.setDocumentNumber(sitterFullRequestDTO.documentNumber());
        existingSitter.setExperience(sitterFullRequestDTO.experience());
        existingSitter.setBio(sitterFullRequestDTO.bio());
        existingSitter.setHourlyRate(sitterFullRequestDTO.hourlyRate());
        existingSitter.setProfilePicture(sitterFullRequestDTO.profilePicture());
        existingSitter.setIdCard(sitterFullRequestDTO.idCard());
        existingSitter.setBackgroundCheckDocument(sitterFullRequestDTO.backgroundCheckDocument());
        existingSitter.setBackgroundCheck(sitterFullRequestDTO.backgroundCheck());

        if (sitterFullRequestDTO.serviceIds() != null && !sitterFullRequestDTO.serviceIds().isEmpty()) {
            Set<ServiceEntity> serviceEntitySet = new HashSet<>(
                    serviceEntityRepository.findAllById(sitterFullRequestDTO.serviceIds())
            );
            existingSitter.setServiceEntitySet(serviceEntitySet);
        }
        Sitter updatedSitter = sitterRepository.save(existingSitter);
        return toFullResponseDto(updatedSitter);
    }

    @Override
    @Transactional
    public SitterFullResponseDTO saveSitter(SitterFullRequestDTO sitterFullRequestDTO) {
        if (sitterRepository.findSitterByEmail(sitterFullRequestDTO.email()).isPresent()) {
            throw new BusinessException("Sitter already exists with email: " + sitterFullRequestDTO.email());
        }

        if (sitterRepository.existsSitterByDocumentNumber(sitterFullRequestDTO.documentNumber())) {
            throw new BusinessException("Sitter already exists with document number: " + sitterFullRequestDTO.documentNumber());
        }

        // Convertir DTO a entidad
        Sitter sitter = Sitter.builder()
                .email(sitterFullRequestDTO.email())
                .password(passwordEncoder.encode(sitterFullRequestDTO.password()))
                .firstName(sitterFullRequestDTO.firstName())
                .lastName(sitterFullRequestDTO.lastName())
                .birthDate(sitterFullRequestDTO.birthDate())
                .address(sitterFullRequestDTO.address())
                .phoneNumber(sitterFullRequestDTO.phoneNumber())
                .documentType(sitterFullRequestDTO.documentType())
                .documentNumber(sitterFullRequestDTO.documentNumber())
                .experience(sitterFullRequestDTO.experience())
                .bio(sitterFullRequestDTO.bio())
                .hourlyRate(sitterFullRequestDTO.hourlyRate())
                .profilePicture(sitterFullRequestDTO.profilePicture())
                .idCard(sitterFullRequestDTO.idCard())
                .backgroundCheckDocument(sitterFullRequestDTO.backgroundCheckDocument())
                .backgroundCheck(sitterFullRequestDTO.backgroundCheck() != null ? sitterFullRequestDTO.backgroundCheck() : false)
                .enabled(true)
                .build();

        // Si existen servicios asignar
        if (sitterFullRequestDTO.serviceIds() != null && !sitterFullRequestDTO.serviceIds().isEmpty()) {
            Set<ServiceEntity> serviceEntitySet = new HashSet<>(
                    serviceEntityRepository.findAllById(sitterFullRequestDTO.serviceIds())
            );
            sitter.setServiceEntitySet(serviceEntitySet);
        }

        Sitter savedSitter = sitterRepository.save(sitter);
        return toFullResponseDto(savedSitter);
    }

    private SitterResponseDTO toResponseDto(Sitter sitter) {
        return SitterResponseDTO.builder()
                .id(sitter.getId())
                .firstName(sitter.getFirstName())
                .lastName(sitter.getLastName())
                .rating(sitter.getAverageRating())
                .cityId(sitter.getAddress() != null && sitter.getAddress().getCity() != null
                        ? sitter.getAddress().getCity().getId()
                        : null)
                .build();
    }

    private SitterFullResponseDTO toFullResponseDto(Sitter sitter) {
        // Convertir Address a AddressDTO
        AddressDTO addressDTO = null;
        if (sitter.getAddress() != null) {
            addressDTO = new AddressDTO(
                    sitter.getAddress().getStreetAddress(),
                    sitter.getAddress().getUnit(),
                    sitter.getAddress().getCity().getName(),
                    sitter.getAddress().getCity().getRegion().getName(),
                    sitter.getAddress().getCity().getRegion().getCountry().getCountryCode()
            );
        }

        // Convertir servicios a DTOs
        Set<ServiceEntityResponseDTO> serviceEntityDTOs = new HashSet<>();
        if (sitter.getServiceEntitySet() != null) {
            serviceEntityDTOs = sitter.getServiceEntitySet().stream()
                    .map(serviceEntity -> new ServiceEntityResponseDTO(
                            serviceEntity.getId(),
                            serviceEntity.getServiceName(),
                            serviceEntity.getDescription(),
                            serviceEntity.getPrice(),
                            serviceEntity.getDuration(),
                            serviceEntity.getActive(),
                            serviceEntity.getSitters()
                    ))
                    .collect(Collectors.toSet());
        }

        // Convertir disponibilidades a DTOs
        Set<AvailabilityResponseDTO> availabilityDTOs = new HashSet<>();
        if (sitter.getAvailabilities() != null) {
            availabilityDTOs = sitter.getAvailabilities()
                    .stream()
                    .map(availability -> new AvailabilityResponseDTO(
                            availability.getId(),
                            availability.getSitter().getId(),
                            availability.getServiceName(),
                            availability.getStartTime(),
                            availability.getEndTime(),
                            availability.getActive()))
                    .collect(Collectors.toSet());
        }

        // Convertir reviews a DTOs
        Set<ReviewDTO> reviewDTOs = new HashSet<>();
        if (sitter.getReviews() != null) {
            reviewDTOs = sitter.getReviews()
                    .stream()
                    .map(this::toReviewDto)
                    .collect(Collectors.toSet());
        }

        return SitterFullResponseDTO.builder()
                .id(sitter.getId())
                .email(sitter.getEmail())
                .firstName(sitter.getFirstName())
                .lastName(sitter.getLastName())
                .birthDate(sitter.getBirthDate())
                .address(addressDTO)
                .phoneNumber(sitter.getPhoneNumber())
                .documentType(sitter.getDocumentType())
                .documentNumber(sitter.getDocumentNumber())
                .experience(sitter.getExperience())
                .enabled(sitter.isEnabled())
                .bio(sitter.getBio())
                .hourlyRate(sitter.getHourlyRate())
                .rating(sitter.getRating())
                .averageRating(sitter.getAverageRating())
                .profilePicture(sitter.getProfilePicture())
                .idCard(sitter.getIdCard())
                .backgroundCheckDocument(sitter.getBackgroundCheckDocument())
                .backgroundCheck(sitter.getBackgroundCheck())
                .registrationDate(sitter.getRegistrationDate())
                .servicesEntities(serviceEntityDTOs)
                .availabilities(availabilityDTOs)
                .reviews(reviewDTOs)
                .roles(Set.of(ERole.ROLE_SITTER))
                .build();
    }

    private ReviewDTO toReviewDto(Review review) {
        return ReviewDTO.builder()
                .bookingId(review.getBooking().getId())
                .rating(review.getRating())
                .comment(review.getComment())
                .build();
    }
}
