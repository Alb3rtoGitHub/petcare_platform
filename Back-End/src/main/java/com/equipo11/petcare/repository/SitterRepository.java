package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.user.Sitter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SitterRepository extends JpaRepository<Sitter, Long> {
}
