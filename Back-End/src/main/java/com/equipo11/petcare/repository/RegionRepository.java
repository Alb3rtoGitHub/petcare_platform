package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.address.Country;
import com.equipo11.petcare.model.address.Region;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RegionRepository extends JpaRepository<Region, Long> {
    Optional<Region> findByNameAndCountry(String region, Country country);
}
