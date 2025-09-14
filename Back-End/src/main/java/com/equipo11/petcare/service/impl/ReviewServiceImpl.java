package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.ReviewDTO;
import com.equipo11.petcare.enums.ApiError;
import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.model.review.Review;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.booking.BookingStatus;
import com.equipo11.petcare.repository.JpaBookingRepository;
import com.equipo11.petcare.repository.ReviewRepository;
import com.equipo11.petcare.service.ReviewService;
import jakarta.transaction.Transactional;
import org.springframework.dao.DataAccessException;
import org.springframework.stereotype.Service;

@Service
public class ReviewServiceImpl implements ReviewService {

    private final JpaBookingRepository bookingRepository;
    private final ReviewRepository reviewRepository;

    public ReviewServiceImpl(JpaBookingRepository bookingRepository,
                             ReviewRepository reviewRepository) {
        this.bookingRepository = bookingRepository;
        this.reviewRepository = reviewRepository;
    }

    @Override
    @Transactional
    public ReviewDTO createReview(ReviewDTO request) {
        Booking booking = fetchBooking(request.bookingId());
        bookingEnsureCompleted(booking);
        bookingEnsureNoExistingReview(booking);

        Review review = Review.builder()
                .booking(booking)
                .owner(booking.getOwner())
                .sitter(booking.getSitter())
                .rating(request.rating())
                .comment(request.comment())
                .build();

        Review reviewSaved;
        try {
            reviewSaved = reviewRepository.save(review);
            booking.setReview(reviewSaved);
            bookingRepository.save(booking);
        } catch (DataAccessException e) {
            throw new PetcareException(ApiError.REVIEW_SAVE_ERROR);
        }

        return new ReviewDTO(reviewSaved.getBooking().getId(), reviewSaved.getRating(),reviewSaved.getComment());
    }

    private Booking fetchBooking(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new PetcareException(ApiError.BOOKING_NOT_FOUND));
    }

    private void bookingEnsureCompleted(Booking booking) {
        if (booking.getStatus() != BookingStatus.COMPLETED) {
            throw new PetcareException(ApiError.BOOKING_NOT_COMPLETED);
        }
    }

    private void bookingEnsureNoExistingReview(Booking booking) {
        if (booking.getReview() != null) {
            throw new PetcareException(ApiError.REVIEW_ALREADY_EXIST);
        }
    }
}
