package com.equipo11.petcare.model.serviceentity;

import java.math.BigDecimal;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
  @UuidGenerator(style = UuidGenerator.Style.RANDOM)
  private UUID id;
  private String name;
  private String description;
  private BigDecimal basePrice;
  private Long duration;
  private Boolean isActive;
}
