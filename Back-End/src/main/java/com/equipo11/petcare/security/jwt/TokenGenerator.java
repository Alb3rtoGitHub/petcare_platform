package com.equipo11.petcare.security.jwt;

import com.equipo11.petcare.model.user.User;

public interface TokenGenerator {
    String generateToken(User user);
}
