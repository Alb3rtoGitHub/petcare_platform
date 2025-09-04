package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.exception.BusinessException;
import com.equipo11.petcare.model.user.Sitter;
import com.equipo11.petcare.repository.SitterRepository;
import com.equipo11.petcare.service.SitterService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SitterServiceImpl implements SitterService {

    private final SitterRepository sitterRepository;

    public SitterServiceImpl(SitterRepository sitterRepository) {
        this.sitterRepository = sitterRepository;
    }

    @Override
    public Optional<Sitter> findSitterById(Long id) {
        if (id == null) {
            throw new BusinessException("Sitter ID cannot be null");
        }

        return sitterRepository.findById(id);
    }
}
