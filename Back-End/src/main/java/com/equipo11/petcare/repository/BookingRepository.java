package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.booking.BookingStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
  List<Booking> findAllByOrderByCreatedAtDesc();

  @Query("""
          SELECT b FROM Booking b
          WHERE b.owner.id = :userId
          AND (:status IS NULL OR b.status = :status)
          AND (:startDate IS NULL OR b.startDateTime >= :startDate)
          AND (:endDate IS NULL OR b.endDateTime <= :endDate)
          ORDER BY b.createdAt DESC
      """)
  Page<Booking> findByOwnerIdAndFilters(
      @Param("userId") Long userId,
      @Param("status") BookingStatus status,
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate,
      Pageable pageable);

  @Query("""
          SELECT b FROM Booking b
          WHERE b.sitter.id = :userId
          AND (:status IS NULL OR b.status = :status)
          AND (:startDate IS NULL OR b.startDateTime >= :startDate)
          AND (:endDate IS NULL OR b.endDateTime <= :endDate)
          ORDER BY b.createdAt DESC
      """)
  Page<Booking> findBySitterIdAndFilters(
      @Param("userId") Long userId,
      @Param("status") BookingStatus status,
      @Param("startDate") LocalDateTime startDate,
      @Param("endDate") LocalDateTime endDate,
      Pageable pageable);

  @Query("SELECT COUNT(b) > 0 FROM Booking b " +
      "WHERE b.sitter.id = :sitterId AND " +
      "b.status IN ('CONFIRMED', 'IN_PROGRESS') AND " +
      "(b.startDateTime < :end AND b.endDateTime > :start) ")
  // "OR " + "(b.endDateTime BETWEEN :start AND :end))")
  boolean existsOverlappingBooking(
      @Param("sitterId") Long sitterId,
      @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);

  @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM Booking b " +
      "WHERE b.pet.id = :petId " +
      "AND b.status NOT IN ('CANCELLED', 'COMPLETED') " +
      "AND ((b.startDateTime <= :end AND b.endDateTime >= :start))")
  boolean existsOverlappingBookingForPet(
      @Param("petId") Long petId,
      @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);
}
