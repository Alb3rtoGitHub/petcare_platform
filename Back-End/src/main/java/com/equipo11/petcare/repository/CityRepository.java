package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.address.City;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CityRepository extends JpaRepository<City, Long> {
    Optional<City> findByNameAndRegion(String city, Long id);
}
