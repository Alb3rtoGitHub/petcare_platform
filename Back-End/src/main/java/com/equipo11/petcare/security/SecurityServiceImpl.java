package com.equipo11.petcare.security;

import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.exception.enums.ApiError;
import com.equipo11.petcare.model.user.Role;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import static com.equipo11.petcare.model.user.enums.ERole.ROLE_ADMIN;

@Service
public class SecurityServiceImpl implements SecurityService{

    private final UserRepository userRepository;

    public SecurityServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public User verifyUserOrToken(Long targetId) {

        var userToken = userAuthenticate();
        var roles = userToken.getRoles().stream()
                .map(Role::getName)
                .toList();
        if (userToken.getId().equals(targetId) || roles.contains(ROLE_ADMIN)) {
            return userToken;
        }
        List<String> reason = new ArrayList<>(Collections.singleton("No puedes acceder o modificar datos de otro usuario"));
        throw new PetcareException(HttpStatus.UNAUTHORIZED, "No autorizado", reason );
    }

    @Override
    public void creatorClaimVerify(User claimUser) {
        var creator = userAuthenticate();
        if (!creator.equals(claimUser))
            throw new PetcareException(ApiError.CLAIM_OWNER_MISMATCH);
    }

    @Override
    public User userAuthenticate() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();

        String email = (String) auth.getPrincipal();

        return userRepository.findByEmail(email)
                .orElseThrow(() -> new PetcareException(ApiError.UNAUTHORIZED));

    }
}

