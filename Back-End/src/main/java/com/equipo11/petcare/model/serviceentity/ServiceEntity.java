package com.equipo11.petcare.model.serviceentity;

import com.equipo11.petcare.model.availability.enums.ServiceName;
import com.equipo11.petcare.model.user.Sitter;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "service_entities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private ServiceName serviceName;

    private String description;

    private Double price;

    private Long duration; // en minutos?

    private Boolean active;
}
