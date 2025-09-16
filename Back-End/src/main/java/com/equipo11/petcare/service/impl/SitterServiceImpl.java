package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.*;
import com.equipo11.petcare.exception.BusinessException;
import com.equipo11.petcare.model.availability.Availability;
import com.equipo11.petcare.model.review.Review;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import com.equipo11.petcare.model.user.Role;
import com.equipo11.petcare.model.user.Sitter;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.model.user.enums.ERole;
import com.equipo11.petcare.repository.*;
import com.equipo11.petcare.service.SitterService;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Collections;

import jakarta.validation.ValidationException;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class SitterServiceImpl implements SitterService {

  private final SitterRepository sitterRepository;
  private final ServiceEntityRepository serviceEntityRepository;
  private final UserRepository userRepository;
  private final AvailabilityRepository availabilityRepository;

  public SitterServiceImpl(SitterRepository sitterRepository, ServiceEntityRepository serviceEntityRepository,
      UserRepository userRepository, AvailabilityRepository availabilityRepository) {
    this.sitterRepository = sitterRepository;
    this.serviceEntityRepository = serviceEntityRepository;
    this.userRepository = userRepository;
    this.availabilityRepository = availabilityRepository;
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
      boolean all) {
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
  public SitterFullResponseDTO updateSitterApproval(Long id, boolean approved) {
    Sitter sitter = sitterRepository.findById(id)
        .orElseThrow(() -> new BusinessException("Sitter not found with id: " + id));
    sitter.setEnabled(approved);
    Sitter updatedSitter = sitterRepository.save(sitter);
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
        .orElseThrow(() -> new BusinessException("Sitter not found with id: " + id));

    if (!existingSitter.getDocumentNumber().equals(sitterFullRequestDTO.documentNumber()) &&
        sitterRepository.existsSitterByDocumentNumber(sitterFullRequestDTO.documentNumber())) {
      throw new BusinessException(
          "Sitter already exists with document number: " + sitterFullRequestDTO.documentNumber());
    }

    // Actualizar campos básicos
    existingSitter.setDocumentType(sitterFullRequestDTO.documentType());
    existingSitter.setDocumentNumber(sitterFullRequestDTO.documentNumber());
    existingSitter.setExperience(sitterFullRequestDTO.experience());
    existingSitter.setBio(sitterFullRequestDTO.bio());
    existingSitter.setProfilePicture(sitterFullRequestDTO.profilePicture());
    existingSitter.setIdCard(sitterFullRequestDTO.idCard());
    existingSitter.setBackgroundCheckDocument(sitterFullRequestDTO.backgroundCheckDocument());

    // Actualizar disponibilidades
    if (sitterFullRequestDTO.availabilities() != null) {
      // Eliminar disponibilidades existentes que no estén en la nueva lista
      Set<Long> existingAvailabilityIds = existingSitter.getAvailabilities().stream()
          .map(Availability::getId)
          .collect(Collectors.toSet());

      Set<Long> newAvailabilityIds = sitterFullRequestDTO.availabilities().stream()
          .map(Availability::getId)
          .filter(Objects::nonNull)
          .collect(Collectors.toSet());

      // Eliminar las que ya no están
      existingSitter.getAvailabilities().removeIf(av -> av.getId() != null && !newAvailabilityIds.contains(av.getId()));

      // Agregar o actualizar las nuevas disponibilidades
      for (Availability availability : sitterFullRequestDTO.availabilities()) {
        if (availability.getId() == null) {
          // Nueva disponibilidad
          availability.setSitter(existingSitter);
          existingSitter.getAvailabilities().add(availability);
        } else {
          // Actualizar existente
          availabilityRepository.findById(availability.getId())
              .ifPresent(existingAvail -> {
                existingAvail.setStartTime(availability.getStartTime());
                existingAvail.setEndTime(availability.getEndTime());
                existingAvail.setStartTime(availability.getStartTime());
                existingAvail.setEndTime(availability.getEndTime());
                existingAvail.setServiceEntity(availability.getServiceEntity());
                availabilityRepository.save(existingAvail);
              });
        }
      }
    }
    Sitter updatedSitter = sitterRepository.save(existingSitter);
    return toFullResponseDto(updatedSitter);
  }

  @Override
  @Transactional
  public SitterFullResponseDTO saveSitter(SitterFullRequestDTO sitterFullRequestDTO) {
    // Verificar si ya existe un sitter con el mismo número de documento
    if (sitterRepository.existsSitterByDocumentNumber(sitterFullRequestDTO.documentNumber())) {
      throw new BusinessException(
          "Ya existe un cuidador con el número de documento: " + sitterFullRequestDTO.documentNumber());
    }

    // Obtener el usuario autenticado actual
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String currentPrincipalName = authentication.getName();

    // Buscar el usuario autenticado
    User existingUser = userRepository.findByEmail(currentPrincipalName)
        .orElseThrow(() -> new BusinessException("No se pudo encontrar la información del usuario autenticado"));

    // Verificar que el usuario tenga el rol ROLE_SITTER
    boolean isSitter = existingUser.getRoles().stream()
        .anyMatch(role -> role.getName() == ERole.ROLE_SITTER);

    if (!isSitter) {
      throw new BusinessException("El usuario no tiene permisos para registrarse como cuidador");
    }

    // Verificar que el usuario no sea ya un sitter
    if (existingUser instanceof Sitter) {
      throw new BusinessException("Este usuario ya está registrado como cuidador");
    }

    // Crear el sitter a partir del usuario existente
    Sitter sitter = new Sitter();
    // Copiar propiedades del usuario
    sitter.setId(existingUser.getId());
    sitter.setFirstName(existingUser.getFirstName());
    sitter.setLastName(existingUser.getLastName());
    sitter.setEmail(existingUser.getEmail());
    sitter.setPassword(existingUser.getPassword());
    sitter.setPhoneNumber(existingUser.getPhoneNumber());
    sitter.setAddress(existingUser.getAddress());
    sitter.setEnabled(false);

    // Set the SITTER role
    Role sitterRole = new Role();
    sitterRole.setName(ERole.ROLE_SITTER);
    sitter.setRoles(Collections.singleton(sitterRole));

    // Establecer propiedades específicas del sitter
    sitter.setDocumentType(sitterFullRequestDTO.documentType());
    sitter.setDocumentNumber(sitterFullRequestDTO.documentNumber());
    sitter.setExperience(sitterFullRequestDTO.experience());
    sitter.setBio(sitterFullRequestDTO.bio());
    sitter.setProfilePicture(sitterFullRequestDTO.profilePicture());
    sitter.setIdCard(sitterFullRequestDTO.idCard());
    sitter.setBackgroundCheckDocument(sitterFullRequestDTO.backgroundCheckDocument());

    // Guardar el sitter
    Sitter savedSitter = sitterRepository.save(sitter);

    // Procesar las disponibilidades si existen
    if (sitterFullRequestDTO.availabilities() != null && !sitterFullRequestDTO.availabilities().isEmpty()) {
      for (Availability availability : sitterFullRequestDTO.availabilities()) {
        availability.setSitter(savedSitter);
        availabilityRepository.save(availability);
      }
    }

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
          sitter.getAddress().getCity().getRegion().getCountry().getCountryCode());
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
                      Boolean.TRUE.equals(service.getActive()))
                  : null;

              return new AvailabilityResponseDTO(
                  availability.getId(),
                  availability.getSitter() != null ? availability.getSitter().getId() : null,
                  serviceDTO,
                  availability.getStartTime(),
                  availability.getEndTime(),
                  Boolean.TRUE.equals(availability.getActive()));
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
        .build();
  }

  private ReviewDTO toReviewDto(Review review) {
    return ReviewDTO.builder()
        .bookingId(review.getBooking().getId())
        .rating(review.getRating())
        .comment(review.getComment())
        .build();
  }

  @Override
  public boolean hasAvailableSchedule(Long sitterId, LocalDateTime start, LocalDateTime end) {
    // Logica para validar si esta disponible
    List<Availability> availabilities = availabilityRepository.findBySitterId(sitterId);

    return availabilities.stream().anyMatch(av -> !start.isBefore(av.getStartTime()) && !end.isAfter(av.getEndTime()));
    // return false;
  }

  @Override
  public BigDecimal getServicePrice(Long serviceId, Long sistterId) {
    // Logica para obtener precio del servicio
    return null;
  }

  @Override
  public void validateSitter(Long sitterId) {
    User user = userRepository.findById(sitterId)
        .orElseThrow(() -> new ValidationException("El cuidador no existe"));
    boolean isSitter = user.getRoles().stream().anyMatch(r -> r.getName() == ERole.ROLE_SITTER);
    if (!isSitter) {
      throw new ValidationException("El usuario especificado no es un cuidador válido");
    }
  }

  @Override
  public Sitter findById(Long sitterId) {
    Sitter sitter = sitterRepository.findById(sitterId).orElseThrow(() -> new RuntimeException("Sitter not found"));
    return sitter;
  }
}
