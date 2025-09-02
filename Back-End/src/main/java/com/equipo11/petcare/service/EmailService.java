package com.equipo11.petcare.service;

public interface EmailService {
    void sendVerificationEmail(String to, String subject, String text);
}
