package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.address.Country;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CountryRepository extends JpaRepository<Country, String> {
}
