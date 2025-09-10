package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.claim.Claim;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
}
