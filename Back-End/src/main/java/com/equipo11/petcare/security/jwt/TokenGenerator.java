package com.equipo11.petcare.security.jwt;

import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.security.UserDetailsImpl;

public interface TokenGenerator {
    String generateToken(UserDetailsImpl user);
}
