package com.equipo11.petcare.model.user;

import com.equipo11.petcare.model.review.Review;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Table(name = "sitters")
@DiscriminatorValue("SITTER")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Sitter extends User{

    @Column(name = "document_type")
    private String documentType;

    @Column(nullable = false)
    private boolean enabled = false;

    private String bio;

    @OneToMany(mappedBy = "sitter", cascade = CascadeType.ALL,
            orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Review> reviews;

    @Column(name = "average_rating")
    private Double averageRating = 0.0;

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
}
