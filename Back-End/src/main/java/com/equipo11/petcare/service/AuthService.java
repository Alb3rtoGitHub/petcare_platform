package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.AuthResponse;
import com.equipo11.petcare.dto.LoginRequest;

public interface AuthService {

    AuthResponse login(LoginRequest request);

}
