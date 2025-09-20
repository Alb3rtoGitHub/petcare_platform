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

    @Cacheable(value = CacheConfig.USERS_INFO_CACHE, unless = "#result==null")
    List<CountryResponseDTO> getAllCountries();

    @Cacheable(value = CacheConfig.USERS_INFO_CACHE, unless = "#result==null")
    List<RegionResponseDTO> getAllRegionsByCountry(String countryId);

    @Cacheable(value = CacheConfig.USERS_INFO_CACHE, unless = "#result==null")
    List<CityResponseDTO> getAllCitiesByRegion(Long regionId);
}
