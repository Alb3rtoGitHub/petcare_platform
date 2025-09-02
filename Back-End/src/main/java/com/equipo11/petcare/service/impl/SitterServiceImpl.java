package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.service.SitterService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
public class SitterServiceImpl implements SitterService {

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
}
