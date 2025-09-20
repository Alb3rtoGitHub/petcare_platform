package com.equipo11.petcare.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.equipo11.petcare.exception.enums.ApiError;
import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.service.StorageService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class StorageServiceImpl implements StorageService {

    private final Cloudinary cloudinary;
    private static final Set<String> IMAGE_MIME_TYPES = Set.of(
            "image/jpeg", "image/png", "image/gif", "image/webp"
    );
    private static final String PDF_MIME_TYPE = "application/pdf";
    private static final Set<String> ALLOWED_MIME_TYPES = Collections.unmodifiableSet(
            Stream.concat(IMAGE_MIME_TYPES.stream(), Stream.of(PDF_MIME_TYPE))
                    .collect(Collectors.toSet())
    );


    public StorageServiceImpl(@Value("${cloudinary.cloud-name}") String cloudName,
                              @Value("${cloudinary.api-key}") String apiKey,
                              @Value("${cloudinary.api-secret}") String apiSecret) {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret" ,apiSecret
        ));
    }

    @Override
    public String uploadFile(MultipartFile file, String folder) {
        try {
            validateFileType(file);

            String mimeType = file.getContentType();
            String ext = Optional.ofNullable(file.getOriginalFilename())
                    .filter(name -> name.contains("."))
                    .map(name -> name.substring(name.lastIndexOf('.') + 1).toLowerCase())
                    .orElseGet(() -> mimeType.equals(PDF_MIME_TYPE) ? "pdf" : "jpg");

            String resourceType = determineResourceType(mimeType);

            String publicId = String.format("%s/%s.%s",
                    folder, UUID.randomUUID(), ext);

            Map<?,?> result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", folder,
                            "public_id", publicId,
                            "overwrite", true,
                            "resource_type", resourceType
                    )
            );
            return result.get("secure_url").toString();
        } catch (IOException e) {
            throw new PetcareException(ApiError.FILE_SAVING_FAILED);
        }
    }

    private String determineResourceType(String mimeType) {
        if (mimeType == null) return "auto";
        if (mimeType.startsWith("image/")) return "image";
        if (mimeType.equals("application/pdf")) return "raw";
        return "auto";
    }

    private void validateFileType(MultipartFile file) {
        String mimeType = file.getContentType();
        if (mimeType == null || !ALLOWED_MIME_TYPES.contains(mimeType)) {
            throw new PetcareException(ApiError.UNSUPPORTED_FILE_TYPE);
        }
    }

}
