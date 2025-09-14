package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.UpdateUserRequestDTO;
import com.equipo11.petcare.dto.UserResponseDTO;
import com.equipo11.petcare.service.StorageService;
import com.equipo11.petcare.service.UserProfileService;
import com.equipo11.petcare.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    private final StorageService storageService;
    private final UserService userService;

    public UserProfileServiceImpl(StorageService storageService,
                                  UserService userService) {
        this.storageService = storageService;
        this.userService = userService;
    }


    @Override
    @Transactional
    public UserResponseDTO updateUser(Long id, UpdateUserRequestDTO request, MultipartFile file) {
        var payload = request;
        if (file != null && !file.isEmpty()) {
            String url = storageService.uploadImage(file, "users");
            payload = new UpdateUserRequestDTO(
                    request.phoneNumber(),
                    request.firstName(),
                    request.lastName(),
                    request.address(),
                    url);
        }
        return userService.updateUser(id, payload);
    }
}
