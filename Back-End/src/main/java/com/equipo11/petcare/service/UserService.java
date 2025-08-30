package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.UserRequestDTO;
import com.equipo11.petcare.dto.UserResponseDTO;

public interface UserService {
    UserResponseDTO getUser(Long id, String bearer);
    UserResponseDTO updateUser(Long id, UserRequestDTO request);
    Boolean deleteUser(Long id);
}
