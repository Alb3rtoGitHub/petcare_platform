package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.AddressDTO;
import com.equipo11.petcare.dto.CityResponseDTO;
import com.equipo11.petcare.dto.CountryResponseDTO;
import com.equipo11.petcare.dto.RegionResponseDTO;
import com.equipo11.petcare.model.address.Address;

import java.util.List;

public interface AddressService {

    Address resolveAddress(AddressDTO dto);
    Address updateAddress(Long userId, AddressDTO dto);
    Address createAddress(Address address);

    List<CountryResponseDTO> getAllCountries();

    List<RegionResponseDTO> getAllRegionsByCountry(String countryId);

    List<CityResponseDTO> getAllCitiesByRegion(Long regionId);
}
