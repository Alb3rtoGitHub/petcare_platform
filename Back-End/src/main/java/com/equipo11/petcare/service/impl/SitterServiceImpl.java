package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.SitterResponseDTO;
import com.equipo11.petcare.exception.BusinessException;
import com.equipo11.petcare.model.user.Sitter;
import com.equipo11.petcare.repository.SitterRepository;
import com.equipo11.petcare.service.SitterService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
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

    public Page<SitterResponseDTO> getSitters(
            Long cityId,
            int page,
            int size,
            String sortBy,
            String sortDir,
            boolean all
    ) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);

        Pageable pageable = all
                ? PageRequest.of(0, Integer.MAX_VALUE, sort)
                : PageRequest.of(page, size, sort);

        Page<Sitter> sitterPage = (cityId != null)
                ? sitterRepository.findByCityId(cityId, pageable)
                : sitterRepository.findAll(pageable);

        return sitterPage.map(this::toResponseDto);
    }

    private SitterResponseDTO toResponseDto(Sitter sitter) {
        return SitterResponseDTO.builder()
                .id(sitter.getId())
                .firstName(sitter.getFirstName())
                .lastName(sitter.getLastName())
                .rating(sitter.getRating())
                .cityId(sitter.getAddress().getCity().getId())
                .build();
    }
}
