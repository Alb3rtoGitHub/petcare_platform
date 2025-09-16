package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.user.Sitter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SitterRepository extends JpaRepository<Sitter, Long> {

    Page<Sitter> findByAddressCityIdAndEnabledTrue(Long cityId, Pageable pageable);
    Page<Sitter> findAllByEnabledTrue(Pageable pageable);
    @Query("SELECT s FROM Sitter s WHERE s.email = :email")
    Optional<Sitter> findSitterByEmail(@Param("email") String email);
    @Query("SELECT s FROM Sitter s WHERE s.documentNumber = :documentNumber")
    Optional<Sitter> findSitterByDocumentNumber(@Param("documentNumber") String documentNumber);
    Boolean existsSitterByDocumentNumber(String documentNumber);
    List<Sitter> findSittersByEnabled(boolean enabled);
}
