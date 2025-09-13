package com.equipo11.petcare.model.user;

import com.equipo11.petcare.model.Availability;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "sitters")
@DiscriminatorValue("SITTER")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Sitter extends User{

    @Column(name = "document_number",nullable = true)
    private String documentNumber;

    @Column(nullable = false)
    private boolean enabled = false;

    private String bio;
    @ManyToMany
    @JoinTable(name = "sitter_service_entity",
            joinColumns = @JoinColumn(name = "sitter_id"),
            inverseJoinColumns = @JoinColumn(name = "service_entity_id"))
    private Set<ServiceEntity> serviceEntitySet = new HashSet<>();

    @OneToMany(mappedBy = "sitter", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Availability> availabilities = new ArrayList<>();

}
