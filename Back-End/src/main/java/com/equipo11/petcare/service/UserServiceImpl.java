package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.UpdateUserRequestDTO;
import com.equipo11.petcare.dto.UserResponseDTO;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.repository.UserRepository;
import com.equipo11.petcare.security.jwt.TokenParser;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService{

    private final TokenParser tokenParser;
    private final UserRepository userRepository;
    private final AddressService addressService;

    public UserServiceImpl(TokenParser tokenParser,
                           UserRepository userRepository,
                           AddressServiceImpl addressService) {
        this.tokenParser = tokenParser;
        this.userRepository = userRepository;
        this.addressService = addressService;
    }

    @Override
    public UserResponseDTO getUser(Long id, String bearer) {
        var user = confirmIdAndIdUserToken(id, bearer);
        return new UserResponseDTO(user);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UpdateUserRequestDTO request, String bearer) {
        User user = confirmIdAndIdUserToken(id, bearer);
        user.setPhoneNumber(request.phoneNumber());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setBirthDate(request.birthdate());
        user.setAddress(addressService.createAddress(
                addressService.updateAddress(id, request.address())));
        userRepository.save(user);
        return new UserResponseDTO(user);
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
