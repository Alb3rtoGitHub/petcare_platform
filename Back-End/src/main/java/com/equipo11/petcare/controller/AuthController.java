package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.AuthRequest;
import com.equipo11.petcare.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<?> authUser(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.authCredential(request));
    }

    @DeleteMapping
    public void test() {
        System.out.println("test");
    }
}
