package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.ReviewDTO;
import com.equipo11.petcare.service.ReviewService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<ReviewDTO> createReview(@RequestBody @Valid ReviewDTO request) {
        var response = reviewService.createReview(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
