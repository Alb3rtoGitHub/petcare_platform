package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PetRepository extends JpaRepository<Pet, Long> {
}
