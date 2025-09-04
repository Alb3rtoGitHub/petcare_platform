package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.pet.Pet;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetRepository extends JpaRepository<Pet, Long> {
    List<Pet> findAllByOwnerId(Long ownerId);
}
