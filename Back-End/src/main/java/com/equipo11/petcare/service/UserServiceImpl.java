package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.AuthResponse;
import com.equipo11.petcare.dto.RegisterRequest;
import com.equipo11.petcare.model.address.Address;
import com.equipo11.petcare.model.user.Role;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.model.user.enums.ERole;
import com.equipo11.petcare.repository.RoleRepository;
import com.equipo11.petcare.repository.UserRepository;
import com.equipo11.petcare.security.jwt.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
public class UserServiceImpl implements UserService{

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final AddressService addressService;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserServiceImpl(UserRepository userRepo,
                           RoleRepository roleRepo,
                           AddressService addressService,
                           PasswordEncoder passwordEncoder,
                           JwtService jwtService) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.addressService = addressService;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepo.findByEmail(request.email()).isPresent())
            throw new IllegalArgumentException("Email ya está en uso!");

        Role role;
        if (request.role().equals("ROLE_OWNER")){
            role = roleRepo.findByName(ERole.ROLE_OWNER);
        } else if (request.role().equals("ROLE_SITTER"))
            role = roleRepo.findByName(ERole.ROLE_SITTER);
        else
            throw new IllegalArgumentException("Tipo de usuario no válido");

        Set<Role> roles = new HashSet<>();
        roles.add(role);
        Address address = addressService.resolveAddress(request.address());

        User newUser = User.builder()
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .firstName(request.firstName())
                .lastName(request.lastName())
                .birthDate(request.birthdate())
                .phoneNumber(request.phoneNumber())
                .address(address)
                .roles(roles)
                .createdAt(LocalDateTime.now())
                .build();

        userRepo.save(newUser);

        return new AuthResponse(jwtService.generateToken(newUser));
    }
}
