package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.AuthResponseDTO;
import com.equipo11.petcare.dto.AuthRequestDTO;
import com.equipo11.petcare.dto.RegisterRequestDTO;
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
public class AuthServiceImpl implements AuthService{

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
        return new AuthResponseDTO(userId, tokenGenerator.generateToken(user));
    }

    @Override
    @Transactional
    public void registerUser(RegisterRequestDTO request) {
        if (userRepo.findByEmail(request.email()).isPresent())
            throw new IllegalArgumentException("Email ya está en uso!");
        User newUser;
        Role role;
        Set<Role> roles = new HashSet<>();
        if (ERole.ROLE_OWNER.equals(request.role())){
            role = roleRepo.findByName(ERole.ROLE_OWNER);
            roles.add(role);
            newUser = Owner.builder()
                    .email(request.email())
                    .password(passwordEncoder.encode(request.password()))
                    .firstName(request.firstName())
                    .lastName(request.lastName())
                    .birthDate(request.birthdate())
                    .phoneNumber(request.phoneNumber())
                    .roles(roles)
                    .createdAt(LocalDateTime.now())
                    .build();
        } else if (ERole.ROLE_SITTER.equals(request.role())) {
            role = roleRepo.findByName(ERole.ROLE_SITTER);
            roles.add(role);
            newUser = Sitter.builder()
                    .email(request.email())
                    .password(passwordEncoder.encode(request.password()))
                    .firstName(request.firstName())
                    .lastName(request.lastName())
                    .birthDate(request.birthdate())
                    .phoneNumber(request.phoneNumber())
                    .roles(roles)
                    .createdAt(LocalDateTime.now())
                    .build();
        } else
            throw new IllegalArgumentException("Tipo de usuario no válido");
        Address address = addressService.createAddress(
                addressService.resolveAddress(request.address()));
        newUser.setAddress(address);
        var user = userRepo.save(newUser);

        VerificationToken token = new VerificationToken(user, LocalDateTime.now().plusHours(24));
        tokenRepo.save(token);

        String confirmationLink = "http://localhost:8080/api/v1/auth/confirm?token=" + token.getToken();
        String subject = "Confirma tu cuenta PetCare";
        String text = String.format(
                "Hola %s,%n\nVisita el siguiente enlace para activar tu cuenta:%n%s%n\nEl enlace expira en 24 horas.%n\nNo responda este e-mail.",
                user.getFirstName(), confirmationLink
        );
        emailService.sendVerificationEmail(user.getEmail(), subject, text);
    }

    @Override
    public String validateEmail(String token) {
        String response;
        var verificationTokenValid = verificationTokenRepo.findByToken(token)
                .map(t -> {
                    if (t.getExpiryDate().isBefore(LocalDateTime.now())) {
                        throw new IllegalArgumentException("Token expirado");
                    }
                    var user = t.getUser();
                    user.setVerified(true);
                    userRepo.save(user);
                    verificationTokenRepo.delete(t);
                    var userDetails = new UserDetailsImpl(userRepo.save(user));

                    return new AuthResponseDTO(user.getId(), tokenGenerator.generateToken(userDetails));
                });
         if (verificationTokenValid.isPresent()) {
             var userToken = verificationTokenValid.get();
             response = UriComponentsBuilder
                     .fromUriString("https://www.google.com")
                     .queryParam("userId",   userToken.id())
                     .queryParam("jwtToken", userToken.token())
                     .build().toUriString();

         } else
             throw new IllegalArgumentException("Token no válido");
         return response;
    }
}
