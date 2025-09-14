package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.UpdateUserRequestDTO;
import com.equipo11.petcare.dto.UserResponseDTO;
import com.equipo11.petcare.service.StorageService;
import com.equipo11.petcare.service.UserService;
import jakarta.transaction.Transactional;
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
    private final StorageService storageService;


    public UserController(UserService userService,
                          StorageService storageService) {
        this.userService = userService;
        this.storageService = storageService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable Long id) {
        UserResponseDTO response = userService.getUser(id);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @PutMapping(value = "/{id}", consumes = {
            MediaType.APPLICATION_JSON_VALUE,
            MediaType.MULTIPART_FORM_DATA_VALUE
    })
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id,
                                                      @Valid @RequestPart UpdateUserRequestDTO request,
                                                      @RequestPart(value = "file", required = false) MultipartFile file
    ){
        var playload = request;
        if (file != null && !file.isEmpty()) {
            String url = storageService.uploadImage(file, "users");
            playload = new UpdateUserRequestDTO(
                    request.phoneNumber(),
                    request.firstName(),
                    request.lastName(),
                    request.address(),
                    url);

        }
        UserResponseDTO response = userService.updateUser(id, playload);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @DeleteMapping("{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ResponseEntity<>("Usuario eliminado", HttpStatus.OK);
    }
}
