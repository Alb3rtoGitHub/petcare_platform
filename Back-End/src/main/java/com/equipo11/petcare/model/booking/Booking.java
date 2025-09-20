package com.equipo11.petcare.model.booking;

import com.equipo11.petcare.model.pet.Pet;
import com.equipo11.petcare.model.review.Review;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import com.equipo11.petcare.model.user.Owner;
import com.equipo11.petcare.model.user.Sitter;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Builder
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "owner_id", nullable = false)
    private Owner owner;

    @ManyToOne(optional = false)
    @JoinColumn(name = "sitter_id", nullable = false)
    private Sitter sitter;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private Review review;

    @ManyToOne(optional = false)
    @JoinColumn(name = "pet_id", nullable = false)
    private Pet pet;

    @ManyToOne(optional = false)
    @JoinColumn(name = "service_entity_id", nullable = false)
    private ServiceEntity serviceEntity;

    @Column(name = "start_date_time")
    private LocalDateTime startDateTime;

    @Column(name = "end_date_time")
    private LocalDateTime endDateTime;

    @Column(name = "total_price")
    private Double totalPrice;

    @Column(length = 1000)
    private String specialInstructions;

    private LocalDateTime createdAt;
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}