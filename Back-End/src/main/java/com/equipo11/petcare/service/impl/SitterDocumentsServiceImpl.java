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
    public SitterFullResponseDTO loadCredentials(SitterPatchRequestDTO request,
                                                 MultipartFile profilePicture,
                                                 MultipartFile idCard,
                                                 MultipartFile backgroundCheckDocument) {

        String urlProfilePicture = uploadIfPresent(profilePicture, "users");
        String urlIdCard = uploadIfPresent(idCard, "sitters");
        String urlBackgroundCheckDocument = uploadIfPresent(backgroundCheckDocument, "sitters");

        var newRequest =  new SitterPatchRequestDTO(
                request.documentType(),
                request.documentNumber(),
                request.experience(),
                request.bio(),
                urlProfilePicture,
                urlIdCard,
                urlBackgroundCheckDocument
                );
        return sitterService.saveSitterDocuments(newRequest);
    }

    private String uploadIfPresent(MultipartFile file, String folder) {
        return (file != null && !file.isEmpty())
                ? storageService.uploadFile(file, folder)
                : null;
    }
}


