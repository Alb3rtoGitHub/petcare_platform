package com.equipo11.petcare.model.availability;

import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import com.equipo11.petcare.model.user.Sitter;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "availabilities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Availability {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sitter_id", nullable = false)
    private Sitter sitter;

    @ManyToOne
    @JoinColumn(name = "service_entity_id", nullable = false)
    private ServiceEntity serviceEntity;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(nullable = false)
    private Boolean active = true;

    @PrePersist
    @PreUpdate
    private void validate() {
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("Start and end time are required");
        }
        if (startTime.isAfter(endTime)) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
    }
}
