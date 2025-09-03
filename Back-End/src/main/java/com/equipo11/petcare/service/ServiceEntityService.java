package com.equipo11.petcare.service;

import java.util.List;
import java.util.UUID;

public interface ServiceEntityService {
  void validateServices(List<UUID> serviceIds);
}
