package com.equipo11.petcare.service;

import com.equipo11.petcare.model.user.Sitter;

import java.util.Optional;

public interface SitterService {
    Optional<Sitter> findSitterById(Long id);
}
