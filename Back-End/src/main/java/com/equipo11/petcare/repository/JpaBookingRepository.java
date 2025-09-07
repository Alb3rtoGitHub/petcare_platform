package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.booking.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaBookingRepository extends JpaRepository<Booking, Long> {
}
