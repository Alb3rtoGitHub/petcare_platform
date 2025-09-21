package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.address.City;
import com.equipo11.petcare.model.address.Region;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CityRepository extends JpaRepository<City, Long> {
    Optional<City> findByNameAndRegion(String city, Region region);

    List<City> findAllByRegion(Region region);
}
