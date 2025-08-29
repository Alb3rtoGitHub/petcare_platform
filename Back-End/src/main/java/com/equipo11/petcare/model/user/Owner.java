package com.equipo11.petcare.model.user;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "owners")
@DiscriminatorValue("OWNER")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Owner extends User{
}
