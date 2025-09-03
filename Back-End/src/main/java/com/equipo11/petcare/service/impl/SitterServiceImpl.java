package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.model.user.enums.ERole;
import com.equipo11.petcare.repository.UserRepository;
import com.equipo11.petcare.service.SitterService;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class SitterServiceImpl implements SitterService {
  private final UserRepository userRepository;

  @Override
  public boolean hasAvailableSchedule(Long sistterId, LocalDateTime start, LocalDateTime end) {
    // Logica para validar si esta disponible
    return false;
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
}
