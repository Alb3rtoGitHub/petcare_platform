package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.SitterFullResponseDTO;
import com.equipo11.petcare.dto.SitterPatchRequestDTO;
import org.springframework.web.multipart.MultipartFile;

public interface SitterDocumentsService {
    SitterFullResponseDTO loadCredentials(
            Long sitterId,
            SitterPatchRequestDTO request,
            MultipartFile idCard,
            MultipartFile loadCredentials);
}
