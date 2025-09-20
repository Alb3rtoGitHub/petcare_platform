package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.serviceentity.enums.ServiceName;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServiceEntityRepository extends JpaRepository<ServiceEntity, Long> {
    Optional<ServiceEntity> findByServiceName(ServiceName serviceName);
    boolean existsByServiceName(ServiceName serviceName);
}
