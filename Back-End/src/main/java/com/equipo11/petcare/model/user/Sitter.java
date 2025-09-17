package com.equipo11.petcare.model.user;

import com.equipo11.petcare.model.review.Review;
import jakarta.persistence.*;
import com.equipo11.petcare.model.availability.Availability;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

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

    @Column(name = "document_type")
    private String documentType;

    @Column(name = "document_number")
    private String documentNumber;

    @Column(nullable = false)
    private boolean enabled = false; // Verificación por Admin

    @Column(columnDefinition = "TEXT")
    private String experience;

    @Column(columnDefinition = "TEXT")
    private String bio; // About Me

    @OneToMany(mappedBy = "sitter", cascade = CascadeType.ALL,
            orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Review> reviews;

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

    private String idCard; // URL del documento

    private String backgroundCheckDocument; // URL del documento de antecedentes

    @OneToMany(mappedBy = "sitter", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Availability> availabilities = new HashSet<>();

    @PostLoad
    @PrePersist
    @PreUpdate
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
        this.availabilities.add(Availability.builder()
                .sitter(this)
                .serviceEntity(serviceEntity)
                .build());
    }

    public void removeService(ServiceEntity serviceEntity) {
        this.availabilities.removeIf(availability ->
                availability.getServiceEntity().equals(serviceEntity));
    }
}