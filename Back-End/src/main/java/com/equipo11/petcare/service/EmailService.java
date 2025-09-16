package com.equipo11.petcare.service;

public interface EmailService {
    void sendEmail(String to, String subject, String text);
}
