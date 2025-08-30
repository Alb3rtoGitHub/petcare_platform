package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.AuthResponseDTO;
import com.equipo11.petcare.dto.AuthRequestDTO;
import com.equipo11.petcare.dto.RegisterRequestDTO;

public interface AuthService {

    AuthResponseDTO authCredential(AuthRequestDTO request);

    AuthResponseDTO registerUser(RegisterRequestDTO request);

}
