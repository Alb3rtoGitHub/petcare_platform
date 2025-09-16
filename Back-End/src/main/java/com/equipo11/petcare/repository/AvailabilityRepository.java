package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.availability.Availability;
import com.equipo11.petcare.model.serviceentity.enums.ServiceName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AvailabilityRepository extends JpaRepository<Availability, Long> {
  List<Availability> findBySitterId(Long sitterId);

  @Query("SELECT a FROM Availability a WHERE a.sitter.id = :sitterId " +
      "AND a.active = true " +
      "AND a.serviceEntity.serviceName = :serviceName")
  List<Availability> findBySitterIdAndServiceNameAndActiveTrue(
      @Param("sitterId") Long sitterId,
      @Param("serviceName") ServiceName serviceName);

  // Verificar solapamiento: hay disponibilidad en el rango [startTime, endTime]
  @Query("SELECT a FROM Availability a WHERE a.sitter.id = :sitterId " +
      "AND a.active = true " +
      "AND a.startTime < :endTime AND a.endTime > :startTime")
  List<Availability> findOverlappingAvailabilities(
      @Param("sitterId") Long sitterId,
      @Param("startTime") LocalDateTime startTime,
      @Param("endTime") LocalDateTime endTime);
}
