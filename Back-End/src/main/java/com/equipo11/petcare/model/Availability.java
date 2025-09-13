package com.equipo11.petcare.model;

import com.equipo11.petcare.model.user.Sitter;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity @Getter @Setter
@Table(name = "sitter_availability")
public class Availability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "sitter_id", nullable = false)
    private Sitter sitter;

    @Enumerated(EnumType.STRING)
    @Column(name = "service_name", nullable = false)
    private ServiceName serviceName;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_date", nullable = false)
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
