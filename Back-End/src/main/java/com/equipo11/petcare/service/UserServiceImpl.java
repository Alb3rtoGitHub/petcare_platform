package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.UserRequestDTO;
import com.equipo11.petcare.dto.UserResponseDTO;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.repository.UserRepository;
import com.equipo11.petcare.security.jwt.TokenParser;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{

    private final TokenParser tokenParser;
    private final UserRepository userRepository;

    public UserServiceImpl(TokenParser tokenParser,
                           UserRepository userRepository) {
        this.tokenParser = tokenParser;
        this.userRepository = userRepository;
    }

    @Override
    public UserResponseDTO getUser(Long id, String bearer) {
        var user = confirmIdAndIdUserToken(id, bearer);
        return new UserResponseDTO(user);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UserRequestDTO request) {
        return null;
    }

    @Override
    public Boolean deleteUser(Long id) {
        return null;
    }

    private User confirmIdAndIdUserToken(Long id, String bearer) {
        String token = bearer.substring(7);
        String email = tokenParser.extractEmail(token);
        var userToken = userRepository.findByEmail(email);
        if (userToken.isPresent()) {
            var user = userToken.get();
            if (user.getId().equals(id) || tokenParser.extractRoles(token).contains("ROLE_ADMIN")) {
                return user;
            }
        }
        throw new IllegalArgumentException("Usuario no autorizado");
    }
}
