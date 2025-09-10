package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.claim.Claim;
import com.equipo11.petcare.model.claim.enums.ClaimState;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ClaimRepository extends JpaRepository<Claim, Long> {

    @Query("""
        SELECT c
          FROM Claim c
         WHERE (:userId    IS NULL OR c.reservation.owner.id = :userId)
           AND (:bookingId IS NULL OR c.reservation.id       = :bookingId)
           AND (:state     IS NULL OR c.state                = :state)
        """)
    Page<Claim> findByFilters(@Param("userId")    Long userId,
                              @Param("bookingId") Long bookingId,
                              @Param("state") ClaimState state,
                              Pageable pageable);
}