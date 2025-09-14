package com.equipo11.petcare.model.serviceentity;

import com.equipo11.petcare.model.serviceentity.enums.ServiceName;
import jakarta.persistence.*;
import lombok.*;

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
