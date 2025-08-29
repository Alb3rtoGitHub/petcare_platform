package com.equipo11.petcare.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import com.equipo11.petcare.model.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class JwtServiceImpl implements JwtService{

    @Value("${petcare.app.jwtSecret}")
    private String secretKey;

    @Value("${petcare.app.jwtExpirationMs}")
    private long jwtExpirationMs;

    @Override
    public String generateToken(User user) {
        return JWT.create()
                .withIssuer("petcare")
                .withSubject(user.getEmail())
                .withClaim("role", user.getRoles().stream()
                .map(r -> r.getName().name())
                .toList())
                .withExpiresAt(generateExpirationTime())
                .sign(getAlgorithm());
    }

    @Override
    public boolean validateToken(String token) {
        try {
            JWTVerifier verifier =JWT.require(getAlgorithm()).build();
            verifier.verify(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String getEmailFromToken(String token) {
        DecodedJWT jwt =JWT.require(getAlgorithm()).build().verify(token);
        return jwt.getSubject();
    }

    @Override
    public List<String> getRolesFromToken(String token) {
        DecodedJWT jwt =JWT.require(getAlgorithm()).build().verify(token);
        return jwt.getClaim("role").asList(String.class);
    }

    private Algorithm getAlgorithm() {
        return Algorithm.HMAC256(secretKey);
    }

    private Instant generateExpirationTime() {
        Instant now = Instant.now();
        return now.plusSeconds(jwtExpirationMs);
    }
}
