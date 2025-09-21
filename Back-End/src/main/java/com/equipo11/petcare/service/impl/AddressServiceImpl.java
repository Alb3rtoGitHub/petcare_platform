package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.AddressDTO;
import com.equipo11.petcare.dto.CityResponseDTO;
import com.equipo11.petcare.dto.CountryResponseDTO;
import com.equipo11.petcare.dto.RegionResponseDTO;
import com.equipo11.petcare.exception.PetcareException;
import com.equipo11.petcare.exception.enums.ApiError;
import com.equipo11.petcare.model.address.Address;
import com.equipo11.petcare.model.address.City;
import com.equipo11.petcare.model.address.Country;
import com.equipo11.petcare.model.address.Region;
import com.equipo11.petcare.repository.AddressRepository;
import com.equipo11.petcare.repository.CityRepository;
import com.equipo11.petcare.repository.CountryRepository;
import com.equipo11.petcare.repository.RegionRepository;
import com.equipo11.petcare.service.AddressService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AddressServiceImpl implements AddressService {

    private final CountryRepository countryRepo;
    private final RegionRepository regionRepo;
    private final CityRepository cityRepo;
    private final AddressRepository addressRepo;

    public AddressServiceImpl(CountryRepository countryRepo,
                              RegionRepository regionRepo,
                              CityRepository cityRepo,
                              AddressRepository addressRepo) {
        this.countryRepo = countryRepo;
        this.regionRepo = regionRepo;
        this.cityRepo = cityRepo;
        this.addressRepo = addressRepo;
    }

    @Override
    public Address resolveAddress(AddressDTO dto) {

        Country country = countryRepo.findById(dto.countryCode())
                .orElseThrow(() -> new PetcareException(ApiError.COUNTRY_NOT_FOUND));

        Region region = regionRepo.findByNameAndCountry(dto.region(), country)
                .orElseThrow(() -> new PetcareException(ApiError.REGION_NOT_FOUND));

        City city = cityRepo.findByNameAndRegion(dto.city(), region)
                .orElseThrow(() -> new PetcareException(ApiError.CITY_NOT_FOUND));

        return Address.builder()
                .city(city)
                .streetAddress(dto.streetAddress())
                .unit(dto.unit())
                .build();
    }

    @Override
    public Address updateAddress(Long userId, AddressDTO dto) {
        Address address = addressRepo.findByUserId(userId);
        if (address == null) {
            throw new PetcareException(ApiError.RESOURCE_NOT_FOUND);
        }

        Address normalizeNewAddress = resolveAddress(dto);
        address.setCity(normalizeNewAddress.getCity());
        address.setStreetAddress(dto.streetAddress());
        address.setUnit(normalizeNewAddress.getUnit());
        addressRepo.save(address);
        return address;
        }

    @Override
    public Address createAddress(Address address) {
        return addressRepo.save(address);
    }

    @Override
    public List<CountryResponseDTO> getAllCountries() {
        var countries = countryRepo.findAll();
        return countries.stream()
                .map(country -> new CountryResponseDTO(country.getName(), country.getCountryCode()))
                .collect(Collectors.toList());
    }

    @Override
    public List<RegionResponseDTO> getAllRegionsByCountry(String countryCode) {
        Country country = countryRepo.findById(countryCode)
                .orElseThrow(() -> new PetcareException(ApiError.COUNTRY_NOT_FOUND));
        List<Region> regions = regionRepo.findAllByCountryCountryCode(country.getCountryCode());
        return regions.stream()
                .map(region -> new RegionResponseDTO(region.getId(), region.getName()))
                .collect(Collectors.toList());
    }

    @Override
    public List<CityResponseDTO> getAllCitiesByRegion(Long regionId) {
        Region region = regionRepo.findById(regionId)
                .orElseThrow(() -> new PetcareException(ApiError.REGION_NOT_FOUND));
        List<City> cities = cityRepo.findAllByRegion(region);
        return cities.stream()
                .map(city -> new CityResponseDTO(city.getId(), city.getName()))
                .collect(Collectors.toList());
    }
}