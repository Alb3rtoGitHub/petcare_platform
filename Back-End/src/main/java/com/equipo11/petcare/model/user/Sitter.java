package com.equipo11.petcare.model.user;

import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "sitters")
@DiscriminatorValue("SITTER")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Sitter extends User{

    @Column(name = "document_type")
    private String documentType;

    @Column(nullable = false)
    private boolean enabled = false;

    private String bio;

    private Double rating;
}
