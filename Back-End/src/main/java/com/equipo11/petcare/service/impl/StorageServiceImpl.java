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
import java.util.Map;
import java.util.UUID;

@Service
public class StorageServiceImpl implements StorageService {

    private final Cloudinary cloudinary;

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
            String original = file.getOriginalFilename();
            String ext = original != null && original.contains(".")
                    ? original.substring(original.lastIndexOf('.') + 1)
                    : "jpg";

            String mimeType = file.getContentType();
            String resourceType = determineResourceType(mimeType);


            String publicId = folder + "/" + UUID.randomUUID();

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
}
