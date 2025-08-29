package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.AuthRequest;
import com.equipo11.petcare.dto.AuthResponse;
import com.equipo11.petcare.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<AuthResponse> loginUser(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.authCredential(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping
    public void test() {
        System.out.println("test");
    }
}
