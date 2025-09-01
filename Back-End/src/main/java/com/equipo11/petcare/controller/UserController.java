package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.UpdateUserRequestDTO;
import com.equipo11.petcare.dto.UserResponseDTO;
import com.equipo11.petcare.service.UserService;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDTO> getUser(@PathVariable Long id,
                                  @RequestHeader("Authorization") String authHeader) {
        UserResponseDTO response = userService.getUser(id, authHeader);
        return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity<UserResponseDTO> updateUser(@PathVariable Long id,
                                                      @RequestHeader("Authorization") String authHeader,
                                                      @Valid @RequestBody UpdateUserRequestDTO request){
        UserResponseDTO response = userService.updateUser(id, request, authHeader);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
