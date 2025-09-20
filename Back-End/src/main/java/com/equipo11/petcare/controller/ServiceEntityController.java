package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.ServiceEntityRequestDTO;
import com.equipo11.petcare.dto.ServiceEntityResponseDTO;
import com.equipo11.petcare.model.serviceentity.enums.ServiceName;
import com.equipo11.petcare.service.ServiceEntityService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/service-entities")
public class ServiceEntityController {

    private final ServiceEntityService serviceEntityService;

    public ServiceEntityController(ServiceEntityService serviceEntityService) {
        this.serviceEntityService = serviceEntityService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceEntityResponseDTO>> getAllServiceEntities() {
        return ResponseEntity.ok(serviceEntityService.findAllServiceEntity());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ServiceEntityResponseDTO> getServiceEntityById(@PathVariable Long id) {
        return ResponseEntity.ok(serviceEntityService.findServiceEntityById(id));
    }

    @GetMapping("/serviceName/{serviceName}")
    public ResponseEntity<ServiceEntityResponseDTO> getServiceEntityByServiceName(@PathVariable ServiceName serviceName) {
        return ResponseEntity.ok(serviceEntityService.findServiceEntityByName(serviceName));
    }

    @PostMapping
    public ResponseEntity<ServiceEntityResponseDTO> createServiceEntity(@Valid @RequestBody ServiceEntityRequestDTO serviceEntityRequestDTO) {
        return new ResponseEntity<>(serviceEntityService.saveServiceEntity(serviceEntityRequestDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceEntityResponseDTO> updateServiceEntity(
            @PathVariable Long id,
            @Valid @RequestBody ServiceEntityRequestDTO serviceEntityRequestDTO) {
        return new ResponseEntity<>(serviceEntityService.updateServiceEntity(id, serviceEntityRequestDTO), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteServiceEntity(@PathVariable Long id) {
        serviceEntityService.deleteServiceEntity(id);
        return ResponseEntity.noContent().build();
    }
}
