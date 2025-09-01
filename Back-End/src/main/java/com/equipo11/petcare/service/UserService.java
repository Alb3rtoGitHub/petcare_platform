package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.AuthResponse;
import com.equipo11.petcare.dto.RegisterRequest;
import com.equipo11.petcare.model.user.Sitter;
import com.equipo11.petcare.model.user.User;

import java.util.Optional;

public interface UserService {

    AuthResponse registerUser(RegisterRequest request);

    Optional<Sitter> findSitterById(Long id);

    Sitter getSitterByIdOrThrow(Long id);

    User getUserById(Long id);
}
