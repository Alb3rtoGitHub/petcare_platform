package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.booking.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JpaBookingRepository extends JpaRepository<Booking, Long> {
  @Query("SELECT b FROM Booking b WHERE " +
      "(:ownerId IS NULL OR b.owner.id = :ownerId) AND " +
      "(:sitterId IS NULL OR b.sitter.id = :sitterId) AND " +
      "(:status IS NULL OR b.status = :status) AND " +
      "(:fromDate IS NULL OR b.startDateTime >= :fromDate) AND " +
      "(:toDate IS NULL OR b.endDateTime <= :toDate)")
  List<Booking> findByFilters(
      @Param("ownerId") Long ownerId,
      @Param("sitterId") Long sitterId,
      @Param("status") BookingStatus status,
      @Param("fromDate") LocalDateTime fromDate,
      @Param("toDate") LocalDateTime toDate);

  @Query("SELECT COUNT(b) > 0 FROM Booking b " +
      "WHERE b.sitter.id = :sitterId AND " +
      "b.status IN ('CONFIRMED', 'IN_PROGRESS') AND " +
      "((b.startDateTime BETWEEN :start AND :end) OR " +
      "(b.endDateTime BETWEEN :start AND :end))")
  boolean existsOverlappingBooking(
      @Param("sitterId") Long sitterId,
      @Param("start") LocalDateTime start,
      @Param("end") LocalDateTime end);
}
