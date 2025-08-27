package com.equipo11.petcare.model.address;

import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "regions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "country_code", referencedColumnName = "country_code", nullable = false)
    private Country country;

    @OneToMany(mappedBy = "region", fetch = FetchType.LAZY)
    private Set<City> cities = new HashSet<>();
}
