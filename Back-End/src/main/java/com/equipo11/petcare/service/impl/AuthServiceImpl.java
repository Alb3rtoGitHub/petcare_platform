package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.AuthRequestDTO;
import com.equipo11.petcare.dto.AuthResponseDTO;
import com.equipo11.petcare.dto.RegisterRequestDTO;
import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.exception.enums.ApiError;
import com.equipo11.petcare.model.address.Address;
import com.equipo11.petcare.model.user.Owner;
import com.equipo11.petcare.model.user.Role;
import com.equipo11.petcare.model.user.Sitter;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.model.user.enums.ERole;
import com.equipo11.petcare.repository.RoleRepository;
import com.equipo11.petcare.repository.UserRepository;
import com.equipo11.petcare.security.UserDetailsImpl;
import com.equipo11.petcare.security.email.VerificationToken;
import com.equipo11.petcare.security.email.VerificationTokenRepository;
import com.equipo11.petcare.security.jwt.TokenGenerator;
import com.equipo11.petcare.service.AddressService;
import com.equipo11.petcare.service.AuthService;
import com.equipo11.petcare.service.EmailService;
import jakarta.transaction.Transactional;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authManager;
    private final UserRepository userRepo;
    private final TokenGenerator tokenGenerator;
    private final RoleRepository roleRepo;
    private final AddressService addressService;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository tokenRepo;
    private final EmailService emailService;
    private final VerificationTokenRepository verificationTokenRepo;

    public AuthServiceImpl(AuthenticationManager authManager,
                           UserRepository userRepo,
                           TokenGenerator tokenGenerator,
                           RoleRepository roleRepo,
                           AddressService addressService,
                           PasswordEncoder passwordEncoder,
                           VerificationTokenRepository tokenRepo,
                           EmailService emailService,
                           VerificationTokenRepository verificationTokenRepo) {
        this.authManager = authManager;
        this.userRepo = userRepo;
        this.tokenGenerator = tokenGenerator;
        this.roleRepo = roleRepo;
        this.addressService = addressService;
        this.passwordEncoder = passwordEncoder;
        this.tokenRepo = tokenRepo;
        this.emailService = emailService;
        this.verificationTokenRepo = verificationTokenRepo;
    }

    @Override
    public AuthResponseDTO authCredential(AuthRequestDTO request) {
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()));
        var user = (UserDetailsImpl) auth.getPrincipal();
        var userId = user.getId();
        var jwt = tokenGenerator.generateToken(user);
        return new AuthResponseDTO(userId, jwt);
    }

    @Override
    @Transactional
    public void registerUser(RegisterRequestDTO request) {
        if (userRepo.findByEmail(request.email()).isPresent())
            throw new PetcareException(ApiError.EMAIL_ALREADY_IN_USE);
        ERole roleType = request.role();
        if (roleType == ERole.ROLE_ADMIN) {
            throw new PetcareException(ApiError.ROLE_NOT_ALLOWED);
        }
        Role role = roleRepo.findByName(roleType)
                .orElseThrow(() -> new PetcareException(ApiError.ROLE_NOT_FOUND));
        Address address = addressService.createAddress(
                addressService.resolveAddress(request.address()));
        var newUser = userRepo.save(builderUser(address, request, role));
        sendVerificationEmail(newUser);
    }

    private User builderUser(Address address, RegisterRequestDTO request, Role role) {
        Set<Role> roles = new HashSet<>();
        roles.add(role);
        return switch (role.getName()) {
            case ROLE_OWNER ->
                    Owner.builder()
                            .email(request.email())
                            .password(passwordEncoder.encode(request.password()))
                            .firstName(request.firstName())
                            .lastName(request.lastName())
                            .phoneNumber(request.phoneNumber())
                            .address(address)
                            .roles(roles)
                            .createdAt(LocalDateTime.now())
                            .build();
            case ROLE_SITTER ->
                    Sitter.builder()
                            .email(request.email())
                            .password(passwordEncoder.encode(request.password()))
                            .firstName(request.firstName())
                            .lastName(request.lastName())
                            .phoneNumber(request.phoneNumber())
                            .address(address)
                            .roles(roles)
                            .createdAt(LocalDateTime.now())
                            .build();
            default -> throw new PetcareException(ApiError.INVALID_ROLE);
        };
    }

    private void sendVerificationEmail(User user) {
        VerificationToken token = new VerificationToken(user, LocalDateTime.now().plusHours(24));
        tokenRepo.save(token);

        String confirmationLink = "http://localhost:8080/api/v1/auth/confirm?token=" + token.getToken();
        String subject = "Confirma tu cuenta PetCare";
        String text = String.format(
                "Hola %s,%n\nVisita el siguiente enlace para activar tu cuenta:%n%s%n\nEl enlace expira en 24 horas.%n\nNo responda este e-mail.",
                user.getFirstName(), confirmationLink
        );
        emailService.sendEmail(user.getEmail(), subject, text);
    }


    @Override
    @Transactional
    public String validateEmail(String token) {
        String response;
        var verificationToken = verificationTokenRepo.findByToken(token)
                .orElseThrow(() -> new PetcareException(ApiError.TOKEN_NOT_FOUND));
        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new PetcareException(ApiError.TOKEN_EXPIRED);
        }

        var user = verificationToken.getUser();
        user.setVerified(true);
        userRepo.save(user);
        verificationTokenRepo.delete(verificationToken);
        var userDetails = new UserDetailsImpl(userRepo.save(user));
        var jwt = tokenGenerator.generateToken(userDetails);
        response = UriComponentsBuilder
                .fromUriString("http://localhost:5173/Register/pets")
                .queryParam("userId",   user.getId())
                .queryParam("jwtToken", jwt)
                .build().toUriString();
        return response;
    }
}
