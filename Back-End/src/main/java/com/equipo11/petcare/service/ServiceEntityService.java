package com.equipo11.petcare.service;

import java.util.List;

import com.equipo11.petcare.model.serviceentity.ServiceEntity;

public interface ServiceEntityService {
  List<ServiceEntity> validateServices(List<Long> serviceIds);
}
