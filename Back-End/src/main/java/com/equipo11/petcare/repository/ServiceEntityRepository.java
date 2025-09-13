package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.ServiceName;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ServiceEntityRepository extends JpaRepository<ServiceEntity, Long> {
    Optional<ServiceEntity> findByServiceName(ServiceName serviceName);
    boolean existsByServiceName(ServiceName serviceName);
}
