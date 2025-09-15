package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.BookingRequestDTO;
import com.equipo11.petcare.dto.BookingResponseDTO;
import com.equipo11.petcare.exception.BusinessException;
import com.equipo11.petcare.model.availability.Availability;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.booking.BookingStatus;
import com.equipo11.petcare.model.pet.Pet;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import com.equipo11.petcare.model.user.Owner;
import com.equipo11.petcare.model.user.Sitter;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.repository.BookingRepository;
import com.equipo11.petcare.repository.ServiceEntityRepository;
import com.equipo11.petcare.security.SecurityService;
import com.equipo11.petcare.service.BookingService;
import com.equipo11.petcare.service.EmailService;
import com.equipo11.petcare.service.SitterService;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Optional;
import java.util.Set;

@Service
public class BookingServiceImpl implements BookingService {

    private final SitterService sitterService;
    private final SecurityService securityService;
    private final ServiceEntityRepository serviceEntityRepository;
    private final BookingRepository bookingRepository;
    private final EmailService emailService;

    public BookingServiceImpl(SitterService sitterService,
                              SecurityService securityService,
                              ServiceEntityRepository serviceEntityRepository, BookingRepository bookingRepository, EmailService emailService) {
        this.sitterService = sitterService;
        this.securityService = securityService;
        this.serviceEntityRepository = serviceEntityRepository;
        this.bookingRepository = bookingRepository;
        this.emailService = emailService;
    }

    @Override
    @Transactional
    public BookingResponseDTO createBooking(BookingRequestDTO bookingRequestDTO) {
        Sitter sitter = sitterService.findSitterById(bookingRequestDTO.sitterId())
                .orElseThrow(() -> new BusinessException("Sitter no encontrado"));

        if (!checkAvailability(sitter, bookingRequestDTO)) {
            throw new BusinessException("El cuidador no está disponible en el rango de fechas solicitado");
        }

        Owner owner = (Owner) securityService.userAuthenticate();

        Pet pet = owner.getPets().stream()
                .filter(petFoud -> petFoud.getId().equals(bookingRequestDTO.petId()))
                .findFirst()
                .orElseThrow(() -> new BusinessException("La Mascota no pertenece al dueño"));

        ServiceEntity serviceEntity = serviceEntityRepository.findById(bookingRequestDTO.serviceEntityId())
                .orElseThrow(() -> new BusinessException("El servicio no existe"));

        Booking booking = Booking.builder()
                .owner(owner)
                .sitter(sitter)
                .pet(pet)
                .status(BookingStatus.PENDING)
                .serviceEntity(serviceEntity)
                .startDateTime(bookingRequestDTO.startDateTime())
                .endDateTime(bookingRequestDTO.endDateTime())
                .totalPrice(serviceEntity.getPrice() * Duration.between(bookingRequestDTO.startDateTime(), bookingRequestDTO.endDateTime()).toHours())
                .specialInstructions(bookingRequestDTO.specialInstructions())
                .build();

        bookingRepository.save(booking);

        sendBookingConfirmationEmail(owner, sitter, booking);

        return toResponse(booking);
    }


    @Override
    @Transactional
    public BookingResponseDTO updateBooking(Long id, BookingStatus status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BusinessException("La reserva no existe"));

        booking.setStatus(status);
        return toResponse(bookingRepository.save(booking));
    }

    @Override
    @Transactional
    public void deleteBooking(Long id) {
        if (!bookingRepository.existsById(id)) {
            throw new BusinessException("La reserva no existe");
        }
        bookingRepository.deleteById(id);
    }

    @Override
    public BookingResponseDTO getBooking(Long id) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new BusinessException("La reserva no existe"));
        return toResponse(booking);
    }

    @Override
    public Page<BookingResponseDTO> getAllBookings(
            int page,
            int size,
            String sortBy
    ) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        Page<Booking> bookings = bookingRepository.findAll(pageable);
        return bookings.map(this::toResponse);
    }

    @Override
    public Page<BookingResponseDTO> getBookingsByUser(Long userId, int page, int size, String sortBy) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(sortBy));

        User user = securityService.userAuthenticate();
        if (user instanceof Owner)
            return bookingRepository.findByOwnerId(userId, pageable).map(this::toResponse);
        return bookingRepository.findBySitterId(userId, pageable).map(this::toResponse);
    }

    private boolean checkAvailability(Sitter sitter, BookingRequestDTO bookingRequestDTO) {
        Set<Availability> availabilities = sitter.getAvailabilities();

        if (availabilities == null || availabilities.isEmpty()) {
            return false;
        }

        Optional<Availability> matchingAvailability = availabilities.stream()
                .filter(avail -> avail.getServiceEntity().getId().equals(bookingRequestDTO.serviceEntityId()))
                .filter(avail -> !bookingRequestDTO.startDateTime().isBefore(avail.getStartTime()) &&
                        !bookingRequestDTO.endDateTime().isAfter(avail.getEndTime()) &&
                        avail.getActive())
                .findFirst();

        matchingAvailability.ifPresent(avail -> {
            avail.setActive(false);
        });

        return matchingAvailability.isPresent();
    }

    private BookingResponseDTO toResponse(Booking booking) {
        return BookingResponseDTO.builder()
                .id(booking.getId())
                .ownerId(booking.getOwner().getId())
                .sitterId(booking.getSitter().getId())
                .petId(booking.getPet().getId())
                .serviceEntityId(booking.getServiceEntity().getId())
                .startDateTime(booking.getStartDateTime())
                .endDateTime(booking.getEndDateTime())
                .totalPrice(booking.getTotalPrice())
                .specialInstructions(booking.getSpecialInstructions())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .build();
    }

    private void sendBookingConfirmationEmail(Owner owner, Sitter sitter, Booking booking) {
        String subject = "Confirmacion de Servicio Agendado";
        String body = "Se ha confirmado el servicio agendado con el cuidador "
                + sitter.getFirstName() + " para el servicio "
                + booking.getServiceEntity().getServiceName();
        emailService.sendEmail(owner.getEmail(), subject, body);
        emailService.sendEmail(sitter.getEmail(), subject, body);
    }
}
