package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.ReviewDTO;
import com.equipo11.petcare.model.review.Review;

public interface ReviewService {
    ReviewDTO createReview(ReviewDTO request);
}
