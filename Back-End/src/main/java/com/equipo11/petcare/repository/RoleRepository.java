package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.user.Role;
import com.equipo11.petcare.model.user.enums.ERole;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(ERole eRole);
}
