package com.equipo11.petcare.security.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.equipo11.petcare.model.user.User;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtTokenGenerator implements TokenGenerator{

    private final Algorithm algorithm;
    private final long expirationMs;

    public JwtTokenGenerator(JwtProperties props) {
        this.algorithm = Algorithm.HMAC256(props.getSecret());
        this.expirationMs = props.getExpirationMs();
    }

    @Override
    public String generateToken(User user) {
        Instant now = Instant.now();
        return JWT.create()
                .withIssuer("petcare")
                .withIssuedAt(now)
                .withExpiresAt(now.plusSeconds(expirationMs))
                .withSubject(user.getEmail())
                .withClaim("roles", user.getRoles()
                        .stream()
                        .map(r -> r.getName().name())
                        .toList()
                )
                .sign(algorithm);
    }
}
