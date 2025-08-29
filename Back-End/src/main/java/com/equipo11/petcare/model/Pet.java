package com.equipo11.petcare.model;

import com.equipo11.petcare.model.user.Owner;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "pets")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 25)
    private String name;

    private Integer age;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ESpecies species;

    @Enumerated(EnumType.STRING)
    @Column(name = "size_category")
    private ESize sizeCategory;

    @Column(name = "care_notes")
    private String careNote;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id",nullable = false)
    private Owner owner;
}
