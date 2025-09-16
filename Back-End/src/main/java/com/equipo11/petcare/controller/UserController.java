package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.UpdateUserRequestDTO;
import com.equipo11.petcare.dto.UserResponseDTO;
import com.equipo11.petcare.service.UserProfileService;
import com.equipo11.petcare.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;
    private final UserProfileService userProfileService;


    public UserController(UserService userService,
                          UserProfileService userProfileService) {
        this.userService = userService;
        this.userProfileService = userProfileService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable Long id) {
        UserResponseDTO response = userService.getUser(id);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @PutMapping(value = "/{id}", consumes =
            MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<UserResponseDTO> updateUser(
            @PathVariable Long id,
            @Valid @RequestPart("data") UpdateUserRequestDTO data,
            @RequestPart(value = "file", required = false) MultipartFile file
    ){
        UserResponseDTO response = userProfileService.updateUser(id, data, file);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>("Usuario eliminado", HttpStatus.OK);
    }
}
