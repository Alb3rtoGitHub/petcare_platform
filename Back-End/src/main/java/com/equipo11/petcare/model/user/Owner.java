package com.equipo11.petcare.model.user;

import com.equipo11.petcare.model.Pet;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "owners")
@DiscriminatorValue("OWNER")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Owner extends User{

    @OneToMany(mappedBy = "owner", cascade = CascadeType.ALL)
    private List<Pet> pets = new ArrayList<>();
}
