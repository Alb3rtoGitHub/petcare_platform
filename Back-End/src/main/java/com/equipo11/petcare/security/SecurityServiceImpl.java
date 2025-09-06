package com.equipo11.petcare.security;

import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.repository.UserRepository;
import com.equipo11.petcare.security.jwt.TokenParser;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class SecurityServiceImpl implements SecurityService{

    private final TokenParser tokenParser;
    private final UserRepository userRepository;

    public SecurityServiceImpl(TokenParser tokenParser,
                               UserRepository userRepository) {
        this.tokenParser = tokenParser;
        this.userRepository = userRepository;
    }

    @Override
    public User verifyUserOrToken(Long targetId, String bearer) {
        String token = bearer.substring(7);
        String email = tokenParser.extractEmail(token);
        var userToken = userRepository.findByEmail(email);
        if (userToken.isPresent()) {
            var user = userToken.get();
            if (user.getId().equals(targetId) || tokenParser.extractRoles(token).contains("ROLE_ADMIN")) {
                return user;
            }
        }
        List<String> reason = new ArrayList<>(Collections.singleton("No puedes acceder o modificar datos de otro usuario"));
        throw new PetcareException(HttpStatus.UNAUTHORIZED, "No autorizado", reason );
    }
}
