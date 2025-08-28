package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.AuthResponse;
import com.equipo11.petcare.dto.AuthRequest;

public interface AuthService {

    AuthResponse authCredential(AuthRequest request);

}
