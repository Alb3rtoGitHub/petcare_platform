package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.AuthRequestDTO;
import com.equipo11.petcare.dto.AuthResponseDTO;
import com.equipo11.petcare.dto.RegisterRequestDTO;
import com.equipo11.petcare.service.AuthService;
import jakarta.transaction.Transactional;
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
    public ResponseEntity<AuthResponseDTO> loginUser(@Valid @RequestBody AuthRequestDTO request) {
        AuthResponseDTO response = authService.authCredential(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<AuthResponseDTO> registerUser(@Valid @RequestBody RegisterRequestDTO request) {
        AuthResponseDTO response = authService.registerUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    @GetMapping("/confirm")
    @Transactional
    public ResponseEntity<?> confirmEmail(@RequestParam String token){
        var response = authService.validateEmail(token);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping
    public void test() {
        System.out.println("test");
    }
}
