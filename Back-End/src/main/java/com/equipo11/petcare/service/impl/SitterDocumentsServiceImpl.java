package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.SitterFullResponseDTO;
import com.equipo11.petcare.dto.SitterPatchRequestDTO;
import com.equipo11.petcare.service.SitterDocumentsService;
import com.equipo11.petcare.service.SitterService;
import com.equipo11.petcare.service.StorageService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class SitterDocumentsServiceImpl implements SitterDocumentsService {

    private final StorageService storageService;
    private final SitterService sitterService;

    public SitterDocumentsServiceImpl(StorageService storageService,
                                      SitterService sitterService) {
        this.storageService = storageService;
        this.sitterService = sitterService;
    }

    @Override
    @Transactional
    public SitterFullResponseDTO loadCredentials(
            Long sitterId,
            SitterPatchRequestDTO request,
            MultipartFile idCard,
            MultipartFile backgroundCheckDocument) {

        String urlIdCard = uploadIfPresent(idCard, "sitters/id-card");
        String urlBackgroundCheckDocument = uploadIfPresent(backgroundCheckDocument, "sitters/background-check");

        var newRequest = SitterPatchRequestDTO.builder()
                .sitterId(request.sitterId())
                .documentType(request.documentType())
                .documentNumber(request.documentNumber())
                .experience(request.experience())
                .bio(request.bio())
                .idCard(urlIdCard != null ? urlIdCard : request.idCard())
                .backgroundCheckDocument(urlBackgroundCheckDocument != null ? urlBackgroundCheckDocument : request.backgroundCheckDocument())
                .build();

        return sitterService.saveSitterDocuments(newRequest);
    }

    private String uploadIfPresent(MultipartFile file, String folder) {
        return (file != null && !file.isEmpty())
                ? storageService.uploadFile(file, folder)
                : null;
    }
}


