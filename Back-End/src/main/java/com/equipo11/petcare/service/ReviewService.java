package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.ReviewDTO;
import com.equipo11.petcare.model.Review;

public interface ReviewService {
    Review createReview(ReviewDTO request);
}
