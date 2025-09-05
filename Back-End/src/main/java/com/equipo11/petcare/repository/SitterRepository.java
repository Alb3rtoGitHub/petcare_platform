package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.user.Sitter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SitterRepository extends JpaRepository<Sitter, Long> {

    @Query("SELECT s FROM Sitter s " +
            "JOIN s.address a " +
            "JOIN a.city c " +
            "WHERE c.id = :cityId")
    Page<Sitter> findByCityId(@Param("cityId") Long cityId, Pageable pageable);
}
