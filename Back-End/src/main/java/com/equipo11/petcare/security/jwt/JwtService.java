package com.equipo11.petcare.security.jwt;

import com.equipo11.petcare.model.user.User;

import java.util.List;

public interface JwtService {

    String generateToken(User user);

    boolean validateToken(String token);

    String getEmailFromToken(String token);

    List<String> getRolesFromToken(String token);
}
