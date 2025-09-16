package com.equipo11.petcare.exception;

import java.util.List;

import org.springframework.http.HttpStatus;

import com.equipo11.petcare.enums.ApiError;

public class PetcareException extends RuntimeException {
    private HttpStatus status;
    private String description;
    private List<String> reasons;

    public PetcareException(ApiError error) {
        this.status = error.getHttpStatus();
        this.description = error.getMessage();
    }

    public PetcareException(HttpStatus status, String description, List<String> reasons) {
        this.status = status;
        this.description = description;
        this.reasons = reasons;
    }

    public HttpStatus getStatus() {
        return this.status;
    }

    public void setStatus(HttpStatus status) {
        this.status = status;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<String> getReasons() {
        return this.reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }
}
