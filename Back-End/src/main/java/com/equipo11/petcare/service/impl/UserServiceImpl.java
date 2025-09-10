package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.UpdateUserRequestDTO;
import com.equipo11.petcare.dto.UserResponseDTO;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.repository.UserRepository;
import com.equipo11.petcare.security.SecurityService;
import com.equipo11.petcare.service.AddressService;
import com.equipo11.petcare.service.UserService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final AddressService addressService;
    private final SecurityService securityService;

    public UserServiceImpl(UserRepository userRepository,
                           AddressServiceImpl addressService,
                           SecurityService securityService) {
        this.userRepository = userRepository;
        this.addressService = addressService;
        this.securityService = securityService;
    }

    @Override
    public UserResponseDTO getUser(Long id) {
        var user = securityService.verifyUserOrToken(id);
        return new UserResponseDTO(user);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UpdateUserRequestDTO request) {
        User user = securityService.verifyUserOrToken(id);
        user.setPhoneNumber(request.phoneNumber());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setBirthDate(request.birthdate());
        user.setAddress(addressService.updateAddress(id, request.address()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        return new UserResponseDTO(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = securityService.verifyUserOrToken(id);
        user.setDeleted(true);
    }


}
