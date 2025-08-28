package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.AuthRequest;
import com.equipo11.petcare.service.AuthServiceImpl;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthServiceImpl authService;

    public AuthController(AuthServiceImpl authService) {
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<?> authUser(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authCredential(request));
    }
}
