package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.enums.ApiError;
import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.security.email.EmailProperties;
import com.equipo11.petcare.service.EmailService;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final String from;

    public EmailServiceImpl(JavaMailSender mailSender,
                            EmailProperties prop) {
        this.mailSender = mailSender;
        this.from = prop.getFrom();
    }

    @Override
    public void sendVerificationEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(from);
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(text);
            mailSender.send(msg);
        } catch (Exception e) {
            throw new PetcareException(ApiError.EMAIL_DELIVERY_FAILED);
        }
    }
}
