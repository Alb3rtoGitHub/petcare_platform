package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.AuthResponse;
import com.equipo11.petcare.dto.RegisterRequest;

public interface UserService {

    AuthResponse register(RegisterRequest request);
}
