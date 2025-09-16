package com.equipo11.petcare.model.booking;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import jakarta.persistence.*;

import com.equipo11.petcare.model.pet.Pet;
import com.equipo11.petcare.model.user.Owner;
import com.equipo11.petcare.model.user.Sitter;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
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

  @ManyToOne(optional = false)
  @JoinColumn(name = "pet_id", nullable = false)
  private Pet pet;

  @ManyToMany(targetEntity = ServiceEntity.class, fetch = FetchType.EAGER)
  private List<ServiceEntity> serviceEntities;

  @Column(name = "start_date_time")
  private LocalDateTime startDateTime;

  @Column(name = "end_date_time")
  private LocalDateTime endDateTime;

  @Column(name = "total_price")
  private BigDecimal totalPrice;

  @Enumerated(EnumType.STRING)
  private BookingStatus status;

  @Column(length = 1000)
  private String specialInstructions;

  private LocalDateTime createdAt;

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();

  }

  @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
  private Review review;
}
