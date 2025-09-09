package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.ClaimCreateRequestDTO;
import com.equipo11.petcare.dto.ClaimResponseDTO;
import com.equipo11.petcare.dto.ClaimUpdateRequestDTO;
import com.equipo11.petcare.enums.ApiError;
import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.claim.Claim;
import com.equipo11.petcare.model.claim.enums.ClaimState;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.repository.ClaimRepository;
import com.equipo11.petcare.repository.JpaBookingRepository;
import com.equipo11.petcare.security.SecurityService;
import com.equipo11.petcare.security.email.VerificationToken;
import com.equipo11.petcare.service.ClaimService;
import com.equipo11.petcare.service.EmailService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ClaimServiceImpl implements ClaimService {

    private final JpaBookingRepository bookingRepository;
    private final ClaimRepository claimRepository;
    private final SecurityService securityService;
    private final EmailService emailService;

    public ClaimServiceImpl(JpaBookingRepository bookingRepository,
                            ClaimRepository claimRepository,
                            SecurityService securityService,
                            EmailService emailService) {
        this.bookingRepository = bookingRepository;
        this.claimRepository = claimRepository;
        this.securityService = securityService;
        this.emailService = emailService;
    }

    @Override
    public ClaimResponseDTO createClaim(ClaimCreateRequestDTO request, String bearer) {
        var booking = findBooking(request.bookingId());
        securityService.creatorClaimVerify(booking.getOwner(), bearer);
        Claim newClaim = Claim.builder()
                .owner(booking.getOwner())
                .booking(booking)
                .description(request.description())
                .build();
        Claim claimSaved = claimRepository.save(newClaim);
        sendCreatorEmail(claimSaved, "Se registró con éxito!");
        return buildClaimResponse(claimSaved);
    }

    @Override
    public ClaimResponseDTO getClaim(Long claimId, String bearer) {
        var claim = findClaimById(claimId);
        securityService.creatorClaimVerify(claim.getOwner(), bearer);
        return buildClaimResponse(claim);
    }

    @Override
    public Page<ClaimResponseDTO> getClaims(Long userId, Long bookingId, ClaimState state, Pageable page) {
        return null;
    }

    @Override
    public ClaimResponseDTO updateState(ClaimUpdateRequestDTO request) {
        Claim claim = findClaimById(request.claimId());
        claim.setState(request.newState());
        claim.setDetermination(request.determination());
        Claim updateClaim = claimRepository.save(claim);
        sendCreatorEmail(updateClaim, "Se encuentra: en " + updateClaim.getState());
        return buildClaimResponse(updateClaim);
    }

    private Booking findBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new PetcareException(ApiError.BOOKING_NOT_FOUND));
    }

    private ClaimResponseDTO buildClaimResponse(Claim claim) {
        return ClaimResponseDTO.builder()
                .id(claim.getId())
                .ownerId(claim.getOwner().getId())
                .bookingId(claim.getBooking().getId())
                .description(claim.getDescription())
                .state(claim.getState())
                .determination(claim.getDetermination())
                .createdAt(claim.getCreatedAt())
                .updateAt(claim.getUpdateAt())
                .build();
    }

    private Claim findClaimById(Long claimId) {
        return claimRepository.findById(claimId)
                .orElseThrow(() -> new PetcareException(ApiError.CLAIM_NOT_FOUND));
    }

    private void sendCreatorEmail(Claim claim, String state) {
        var email = claim.getOwner().getEmail();
        var subject = "Se registró tu reclamo";
        var text = "Hola " + claim.getOwner().getFirstName() + ":" +
                "\nQueriamos avisarte que tu reclamo: " +
                "\n" + claim.toString() + "\n" + state +
                "\nSaludos.\nNo responder este email!";
        emailService.sendEmail(email, subject, text);
    }
}
