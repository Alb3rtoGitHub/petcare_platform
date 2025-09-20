package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.UpdateUserRequestDTO;
import com.equipo11.petcare.dto.UserResponseDTO;

public interface UserService {
    UserResponseDTO getUser(Long id);
    UserResponseDTO updateUser(Long id, UpdateUserRequestDTO request);
    void deleteUser(Long id);
}
