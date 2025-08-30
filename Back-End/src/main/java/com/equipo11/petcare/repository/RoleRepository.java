package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.user.Role;
import com.equipo11.petcare.model.user.enums.ERole;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByName(ERole eRole);
}
