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
import org.springframework.web.servlet.view.RedirectView;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "http://localhost:5173/register")
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
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegisterRequestDTO request) {
        authService.registerUser(request);
        return new ResponseEntity<>("Usuario creado", HttpStatus.CREATED);
    }


    @GetMapping("/confirm")
    public RedirectView confirmEmail(@RequestParam String token){
        var response = authService.validateEmail(token);
        return new RedirectView(response);
    }
}
