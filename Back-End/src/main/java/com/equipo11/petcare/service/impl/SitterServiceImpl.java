package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.*;
import com.equipo11.petcare.exception.BusinessException;
import com.equipo11.petcare.model.availability.Availability;
import com.equipo11.petcare.model.review.Review;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import com.equipo11.petcare.model.user.Sitter;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.model.user.enums.ERole;
import com.equipo11.petcare.repository.*;
import com.equipo11.petcare.security.SecurityService;
import com.equipo11.petcare.security.email.EmailProperties;
import com.equipo11.petcare.service.AddressService;
import com.equipo11.petcare.service.BookingService;
import com.equipo11.petcare.service.EmailService;
import com.equipo11.petcare.service.SitterService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SitterServiceImpl implements SitterService {

    private final SitterRepository sitterRepository;
    private final ServiceEntityRepository serviceEntityRepository;
    private final AvailabilityRepository availabilityRepository;
    private final SecurityService securityService;
    private final AddressService addressService;
    private final EmailService emailService;
    private final String from;

    public SitterServiceImpl(SitterRepository sitterRepository,
                             ServiceEntityRepository serviceEntityRepository,
                             AvailabilityRepository availabilityRepository,
                             SecurityService securityService,
                             AddressService addressService,
                             EmailService emailService,
                             EmailProperties prop) {
        this.sitterRepository = sitterRepository;
        this.serviceEntityRepository = serviceEntityRepository;
        this.availabilityRepository = availabilityRepository;
        this.securityService = securityService;
        this.addressService = addressService;
        this.emailService = emailService;
        this.from = prop.getFrom();
    }

    @Override
    public Optional<Sitter> findSitterById(Long id) {
        if (id == null) {
            throw new BusinessException("Sitter ID cannot be null");
        }

        return sitterRepository.findById(id);
    }

    @Override
    public Page<SitterFullResponseDTO> getSitters(
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

        return sitterPage.map(this::toFullResponseDto);
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
    public SitterFullResponseDTO updateSitterApproval(Long id, boolean approved) {
        Sitter sitter = sitterRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Sitter not found with id: " + id));
        sitter.setEnabled(approved);
        Sitter updatedSitter = sitterRepository.save(sitter);
        String subjet = "Fuiste aprobado como cuidador en PetCare";
        String text = "¡Felicitaciones, " + sitter.getFirstName() +
                "!\nFuiste aprobado para ofrecer tus servicios como cuidador en nuestra plataforma.\n" +
                "Saludos, Equipo de PetCare.\n";
        emailService.sendEmail(sitter.getEmail(), subjet, text);
        return toFullResponseDto(updatedSitter);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<SitterFullResponseDTO> findSittersByApprovalStatus(boolean approved) {
        List<Sitter> sitters = sitterRepository.findSittersByEnabled(approved);
        return sitters.stream()
                .map(this::toFullResponseDto)
                .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public SitterFullResponseDTO updateSitterRating(Long id) {
        Sitter sitter = sitterRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Sitter not found with id: " + id));
        
        sitter.updateAverageRating();
        Sitter updatedSitter = sitterRepository.save(sitter);
        
        return toFullResponseDto(updatedSitter);
    }

    @Override
    @Transactional
    public SitterFullResponseDTO updateSitter(Long id, SitterFullRequestDTO sitterFullRequestDTO) {
        Sitter existingSitter = sitterRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Sitter no encontrado con id: " + id));

        // Actualizar datos básicos
        updateBasicInfo(existingSitter, sitterFullRequestDTO);

        // Actualizar dirección
        existingSitter.setAddress(addressService.updateAddress(
                existingSitter.getAddress().getId(),
                sitterFullRequestDTO.updateUserRequestDTO().address()
        ));

        // Actualizar disponibilidades si vienen en el DTO
        if (sitterFullRequestDTO.availabilities() != null) {
            updateAvailabilities(existingSitter, sitterFullRequestDTO.availabilities());
        }

        Sitter updatedSitter = sitterRepository.save(existingSitter);
        return toFullResponseDto(updatedSitter);
    }

    private void updateBasicInfo(Sitter sitter, SitterFullRequestDTO dto) {
        var userRequest = dto.updateUserRequestDTO();
        sitter.setFirstName(userRequest.firstName());
        sitter.setLastName(userRequest.lastName());
        sitter.setPhoneNumber(userRequest.phoneNumber());
        sitter.setProfilePicture(userRequest.profilePicture());
        sitter.setDocumentType(dto.documentType());
        sitter.setDocumentNumber(dto.documentNumber());
        sitter.setExperience(dto.experience());
        sitter.setBio(dto.bio());
        sitter.setIdCard(dto.idCard());
        sitter.setBackgroundCheckDocument(dto.backgroundCheckDocument());
    }

    private void updateAvailabilities(Sitter sitter, Set<Availability> newAvailabilities) {
        // Obtener IDs de las nuevas disponibilidades (excluyendo nulos)
        Set<Long> newAvailabilityIds = newAvailabilities.stream()
                .map(Availability::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // Eliminar las que ya no están en la nueva lista
        sitter.getAvailabilities().removeIf(av ->
                av.getId() != null && !newAvailabilityIds.contains(av.getId())
        );

        // Procesar nuevas y actualizadas
        List<Availability> updatedAvailabilities = new ArrayList<>();

        for (Availability availability : newAvailabilities) {
            if (availability.getId() == null) {
                // Nueva disponibilidad
                availability.setSitter(sitter);
                updatedAvailabilities.add(availability);
            } else {
                // Actualizar existente
                availabilityRepository.findById(availability.getId()).ifPresent(existing -> {
                    existing.setStartTime(availability.getStartTime());
                    existing.setEndTime(availability.getEndTime());
                    existing.setServiceEntity(availability.getServiceEntity());
                    existing.setActive(availability.getActive());
                    updatedAvailabilities.add(existing);
                });
            }
        }

        // Guardar todas las disponibilidades actualizadas de una vez
        List<Availability> savedAvailabilities = availabilityRepository.saveAll(updatedAvailabilities);
        sitter.setAvailabilities(new HashSet<>(savedAvailabilities));
    }

    @Override
    public SitterFullResponseDTO saveSitterDocuments(SitterPatchRequestDTO sitterPatchRequestDTO) {
        // Buscar el usuario autenticado
        User existingUser = securityService.userAuthenticate();

        // Verificar que el usuario tenga el rol ROLE_SITTER
        boolean isSitter = existingUser.getRoles().stream()
                .anyMatch(role -> role.getName() == ERole.ROLE_SITTER);
                
        if (!isSitter) {
            throw new BusinessException("El usuario no tiene permisos para registrarse como cuidador");
        }

        // Crear el sitter a partir del usuario existente
        Sitter sitter = sitterRepository.findById(existingUser.getId())
                .orElseThrow(() -> new BusinessException("El usuario no tiene permisos para registrarse como cuidador"));
        sitter.setDocumentType(sitterPatchRequestDTO.documentType());
        sitter.setDocumentNumber(sitterPatchRequestDTO.documentNumber());
        sitter.setExperience(sitterPatchRequestDTO.experience());
        sitter.setBio(sitterPatchRequestDTO.bio());
        if (sitterPatchRequestDTO.idCard() != null)
            sitter.setIdCard(sitterPatchRequestDTO.idCard());
        if (sitterPatchRequestDTO.backgroundCheckDocument() != null)
            sitter.setBackgroundCheckDocument(sitterPatchRequestDTO.backgroundCheckDocument());

        // Guardar el sitter
        Sitter savedSitter = sitterRepository.save(sitter);

        String subjet = "Recibimos tus documentos.";
        String text = "¡Hola, " + sitter.getFirstName() +
                "!\nRecibimos la documentación requerida para calificar como cuidador en nuestra plataforma.\n" +
                "Tendras noticias nuestras muy pronto.\n" +
                "Saludos, Equipo de PetCare.\n";
        emailService.sendEmail(sitter.getEmail(), subjet, text);
        emailService.sendEmail(from, "nueva documentación!", "Hay un nuevo sitter para revisar.");
        return toFullResponseDto(savedSitter);
    }

    private SitterResponseDTO toResponseDto(Sitter sitter) {
        return SitterResponseDTO.builder()
                .id(sitter.getId())
                .firstName(sitter.getFirstName())
                .lastName(sitter.getLastName())
                .averageRating(sitter.getAverageRating())
                .cityName(sitter.getAddress() != null && sitter.getAddress().getCity() != null
                        ? sitter.getAddress().getCity().getName()
                        : null)
                .profilePicture(sitter.getProfilePicture())
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

        // Convertir disponibilidades a DTOs
        Set<AvailabilityResponseDTO> availabilityDTOs = sitter.getAvailabilities() == null
                ? new HashSet<>()
                : sitter.getAvailabilities().stream()
                .filter(Objects::nonNull)
                .map(availability -> {
                    // Mapeo seguro de ServiceEntity a ServiceEntityResponseDTO
                    ServiceEntity service = availability.getServiceEntity();
                    ServiceEntityResponseDTO serviceDTO = service != null
                            ? new ServiceEntityResponseDTO(
                            service.getId(),
                            service.getServiceName(),
                            service.getDescription(),
                            service.getPrice(),
                            service.getDuration(),
                            Boolean.TRUE.equals(service.getActive())
                    )
                            : null;

                    assert availability.getServiceEntity() != null;
                    return new AvailabilityResponseDTO(
                            availability.getId(),
                            availability.getSitter() != null ? availability.getSitter().getId() : null,
                            availability.getServiceEntity().getServiceName().name(),
                            availability.getStartTime(),
                            availability.getEndTime(),
                            Boolean.TRUE.equals(availability.getActive())
                    );
                })
                .collect(Collectors.toSet());

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
                .address(addressDTO)
                .phoneNumber(sitter.getPhoneNumber())
                .documentType(sitter.getDocumentType())
                .documentNumber(sitter.getDocumentNumber())
                .experience(sitter.getExperience())
                .enabled(sitter.isEnabled())
                .bio(sitter.getBio())
                .averageRating(sitter.getAverageRating())
                .profilePicture(sitter.getProfilePicture())
                .idCard(sitter.getIdCard())
                .createdAt(sitter.getCreatedAt())
                .backgroundCheckDocument(sitter.getBackgroundCheckDocument())
                .availabilities(availabilityDTOs)
                .reviews(reviewDTOs)
                .roles(Set.of(ERole.ROLE_SITTER))
                .bookings(sitter.getBookings().stream()
                        .map(booking -> BookingResponseDTO.builder()
                                .id(booking.getId())
                                .ownerName(booking.getOwner().getFirstName())
                                .sitterId(booking.getSitter().getId())
                                .petName(booking.getPet().getName())
                                .serviceName(booking.getServiceEntity().getServiceName().name())
                                .startDateTime(booking.getStartDateTime())
                                .endDateTime(booking.getEndDateTime())
                                .totalPrice(booking.getTotalPrice())
                                .specialInstructions(booking.getSpecialInstructions())
                                .status(booking.getStatus())
                                .createdAt(booking.getCreatedAt())
                                .build())
                        .collect(Collectors.toSet()))
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
