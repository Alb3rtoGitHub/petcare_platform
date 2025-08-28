package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.AuthResponse;
import com.equipo11.petcare.dto.AuthRequest;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.repository.UserRepository;
import com.equipo11.petcare.security.jwt.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService{

    private final AuthenticationManager authManager;
    private final UserRepository userRepo;
    private final JwtService jwtService;

    public AuthServiceImpl(AuthenticationManager authManager,
                           UserRepository userRepo,
                           JwtService jwtService) {
        this.authManager = authManager;
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse authCredential(AuthRequest request) {
        Authentication aut = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()));

        User user = userRepo.findByEmail(request.email()).get();

        return new AuthResponse(jwtService.generateToken(user));
    }
}
