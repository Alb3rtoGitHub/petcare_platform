package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findBySitterId(Long sitterId);

    List<Review> findByOwnerId(Long ownerId);
}
