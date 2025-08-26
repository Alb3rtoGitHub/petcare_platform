package com.equipo11.petcare.domain.user.address;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import lombok.*;

@Email
@Table(name = "address")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "street_name", nullable = false)
    private String streetName;

    @Column(name = "street_number", nullable = false)
    private String streetNumber;

    private String unit;

    @ManyToOne
    @JoinColumn(name = "city_id", nullable = false)
    private City city;
}
