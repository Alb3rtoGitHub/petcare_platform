package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.CreateReviewRequestDTO;
import com.equipo11.petcare.model.review.Review;

public interface ReviewService {
    Review createReview(CreateReviewRequestDTO request);
}
