package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.booking.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    Page<Booking> findByOwnerId(Long ownerId, Pageable pageable);
    Page<Booking> findBySitterId(Long sitterId, Pageable pageable);
}
