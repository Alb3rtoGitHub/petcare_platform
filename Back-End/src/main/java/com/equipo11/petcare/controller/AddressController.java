package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.CityResponseDTO;
import com.equipo11.petcare.dto.CountryResponseDTO;
import com.equipo11.petcare.dto.RegionResponseDTO;
import com.equipo11.petcare.service.AddressService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public ResponseEntity<List<CountryResponseDTO>> getAllCountries() {
        return ResponseEntity.ok(addressService.getAllCountries());
    }

    @GetMapping("/regions/{countryCode}")
    public ResponseEntity<List<RegionResponseDTO>> getAllRegionsByCountry(
            @PathVariable String countryCode
    ) {
        return ResponseEntity.ok(addressService.getAllRegionsByCountry(countryCode));
    }

    @GetMapping("/cities/{regionId}")
    public ResponseEntity<List<CityResponseDTO>> getAllCitiesByRegion(
            @PathVariable Long regionId
    ) {
        return ResponseEntity.ok(addressService.getAllCitiesByRegion(regionId));
    }
}
