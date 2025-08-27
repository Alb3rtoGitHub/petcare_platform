package com.equipo11.petcare.security.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class JwtService {

    @Value("${api.security.secret}")
    private static String SECRET_KEY;

    private static final Algorithm algorithm = Algorithm.HMAC256(SECRET_KEY);

    public static String generateToken(String userName, List<String> roles){
        return JWT.create()
                .withIssuer("petcare")
                .withSubject(userName)
                .withClaim("roles", roles)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 10800000))
                .sign(algorithm);
    }

    public static DecodedJWT validateToken(String token) {
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token); // lanza excepción si es inválido
    }

    public static List<String> getRoles(DecodedJWT jwt) {
        return jwt.getClaim("roles").asList(String.class);
    }

    public static String getUsername(DecodedJWT jwt) {
        return jwt.getSubject();
    }
}
