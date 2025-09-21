package com.equipo11.petcare.security.jwt.impl;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.exception.enums.ApiError;
import com.equipo11.petcare.security.jwt.JwtProperties;
import com.equipo11.petcare.security.jwt.TokenParser;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JwtTokenParser implements TokenParser {

    private final JWTVerifier verifier;

    public JwtTokenParser(JwtProperties props) {
        Algorithm algorithm = Algorithm.HMAC256(props.getSecret());
        this.verifier = JWT.require(algorithm)
                .withIssuer("petcare")
                .build();
    }

    @Override
    public String extractEmail(String token) {
        DecodedJWT jwt = verify(token);
        return jwt.getSubject();
    }

    @Override
    public List<String> extractRoles(String token) {
        DecodedJWT jwt = verify(token);
        return jwt.getClaim("roles").asList(String.class);
    }

    @Override
    public boolean isValid(String token) {
        try {
            verify(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public DecodedJWT verify(String token) {
        try {
            return verifier.verify(token);
        } catch (JWTVerificationException e) {
            throw new PetcareException(ApiError.TOKEN_EXPIRED);
        }
    }
}
