package com.equipo11.petcare.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface SitterService {
  boolean hasAvailableSchedule(Long sitterId, LocalDateTime start, LocalDateTime end);

  BigDecimal getServicePrice(Long serviceId, Long sitterId);

  // Validation helper
  void validateSitter(Long sitterId);
}
