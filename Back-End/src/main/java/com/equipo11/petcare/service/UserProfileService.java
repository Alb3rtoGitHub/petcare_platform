package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.UpdateUserRequestDTO;
import com.equipo11.petcare.dto.UserResponseDTO;
import org.springframework.web.multipart.MultipartFile;

public interface UserProfileService {

    UserResponseDTO updateUser(Long id, UpdateUserRequestDTO request, MultipartFile file);

}
