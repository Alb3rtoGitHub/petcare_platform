package com.equipo11.petcare.security.jwt.impl;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.equipo11.petcare.security.UserDetailsImpl;
import com.equipo11.petcare.security.jwt.JwtProperties;
import com.equipo11.petcare.security.jwt.TokenGenerator;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtTokenGenerator implements TokenGenerator {

    private final Algorithm algorithm;
    private final long expirationMs;

    public JwtTokenGenerator(JwtProperties props) {
        this.algorithm = Algorithm.HMAC256(props.getSecret());
        this.expirationMs = props.getExpirationMs();
    }

    @Override
    public String generateToken(UserDetailsImpl user) {
        Instant now = Instant.now();
        return JWT.create()
                .withIssuer("petcare")
                .withIssuedAt(now)
                .withExpiresAt(now.plusSeconds(expirationMs))
                .withSubject(user.getUsername())
                .withClaim("name", user.getUserFirstName())
                .withClaim("cityId", user.getCityId())
                .withClaim("roles", user.getAuthorities()
                        .stream()
                        .map(GrantedAuthority::getAuthority)
                        .toList()
                )
                .sign(algorithm);
    }
}
