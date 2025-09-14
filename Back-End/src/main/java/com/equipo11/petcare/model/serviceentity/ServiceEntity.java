package com.equipo11.petcare.model.serviceentity;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

import com.equipo11.petcare.model.serviceentity.enums.ServiceName;
import com.equipo11.petcare.model.user.Sitter;
import jakarta.persistence.*;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "services")
public class ServiceEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private ServiceName serviceName;

  private String description;

  private BigDecimal basePrice;

  private Long duration;

  private Boolean isActive;

    @ManyToMany(mappedBy = "serviceEntitySet")
    private Set<Sitter> sitters = new HashSet<>();
}
