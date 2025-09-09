package com.equipo11.petcare.security;

import com.equipo11.petcare.enums.ApiError;
import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.model.user.Owner;
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
        var userToken = extractTokenUser(bearer);
        if (userToken.getId().equals(targetId) || tokenParser.extractRoles(bearer.substring(7)).contains("ROLE_ADMIN")) {
            return userToken;
        }
        List<String> reason = new ArrayList<>(Collections.singleton("No puedes acceder o modificar datos de otro usuario"));
        throw new PetcareException(HttpStatus.UNAUTHORIZED, "No autorizado", reason );
    }

    @Override
    public void creatorClaimVerify(User claimUser, String bearer) {
        var creator = extractTokenUser(bearer);
        if (!creator.equals(claimUser))
            throw new PetcareException(ApiError.CLAIM_OWNER_MISMATCH);
    }

    private User extractTokenUser(String bearer) {
        String token = bearer.substring(7);
        String email = tokenParser.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new PetcareException(ApiError.USER_NOT_FOUND));
    }
}
