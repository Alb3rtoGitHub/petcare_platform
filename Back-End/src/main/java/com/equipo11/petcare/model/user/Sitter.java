package com.equipo11.petcare.model.user;

import com.equipo11.petcare.model.review.Review;
import jakarta.persistence.*;
import com.equipo11.petcare.model.availability.Availability;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "sitters", uniqueConstraints = {
        @UniqueConstraint(columnNames = "email"),
        @UniqueConstraint(columnNames = "document_number")
})
@DiscriminatorValue("SITTER")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Sitter extends User {

    @Column(name = "document_type", nullable = false)
    private String documentType;

    @Column(name = "document_number", nullable = false, unique = true)
    private String documentNumber;

    @Column(nullable = false)
    private boolean enabled = false;

    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @OneToMany(mappedBy = "sitter", cascade = CascadeType.ALL,
            orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Review> reviews;

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    @Column(name = "hourly_rate", precision = 10)
    private Double hourlyRate; // Tarifa por hora del servicio

    @Column(columnDefinition = "DOUBLE DEFAULT 0.0")
    private Double rating = 0.0; // Calificación promedio

    private String profilePicture; // URL de la foto de perfil

    private String idCard; // URL del documento

    private String backgroundCheckDocument; // URL del documento de antecedentes

    private Boolean backgroundCheck = false; // Verificación de antecedentes

    @Column(name = "registration_date", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime registrationDate = LocalDateTime.now();

    @ManyToMany
    @JoinTable(name = "sitter_service_entity",
            joinColumns = @JoinColumn(name = "sitter_id"),
            inverseJoinColumns = @JoinColumn(name = "service_entity_id"))
    private Set<ServiceEntity> serviceEntitySet = new HashSet<>();

    @OneToMany(mappedBy = "sitter", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Availability> availabilities = new HashSet<>();

    public void updateAverageRating() {
        if (this.reviews == null || this.reviews.isEmpty()) {
            this.averageRating = 0.0;
            return;
        }
        this.averageRating = this.reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
    }

    // Métodos de ayuda
    public void addService(ServiceEntity serviceEntity) {
        this.serviceEntitySet.add(serviceEntity);
        serviceEntity.getSitters().add(this);
    }

    public void removeService(ServiceEntity serviceEntity) {
        this.serviceEntitySet.remove(serviceEntity);
        serviceEntity.getSitters().remove(this);
    }
}