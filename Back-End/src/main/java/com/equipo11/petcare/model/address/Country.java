package com.equipo11.petcare.model.user.address;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "countries")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Country {

    @Id
    @Column(name = "country_code", length = 2, nullable = false, unique = true)
    private String countryCode;

    @Column(nullable = false, length = 20)
    private String name;

    @OneToMany(mappedBy = "country", fetch = FetchType.LAZY)
    private Set<Region> regions = new HashSet<>();
}
