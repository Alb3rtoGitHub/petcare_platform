package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface JpaServiceEntityRepository extends JpaRepository<ServiceEntity, UUID> {
}
