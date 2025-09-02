package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.UpdateUserRequestDTO;
import com.equipo11.petcare.dto.UserResponseDTO;

public interface UserService {
    UserResponseDTO getUser(Long id, String bearer);
    UserResponseDTO updateUser(Long id, UpdateUserRequestDTO request, String bearer);
    Boolean deleteUser(Long id);
}
