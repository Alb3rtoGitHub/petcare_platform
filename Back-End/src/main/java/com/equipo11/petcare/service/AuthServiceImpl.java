package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.AuthResponse;
import com.equipo11.petcare.dto.LoginRequest;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService{



    @Override
    public AuthResponse login(LoginRequest request) {


        return new AuthResponse("");
    }


}
