package com.equipo11.petcare.security.jwt;

import java.util.List;

public interface TokenParser {
    String extractEmail(String token);
    List<String> extractRoles(String token);
    boolean isValid(String token);
}

