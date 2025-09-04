package com.equipo11.petcare.service.impl;

import com.equipo11.petcare.dto.AddressDTO;
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
                .orElseThrow(() -> new IllegalArgumentException("País no encontrado"));

        Region region = regionRepo.findByNameAndCountry(dto.region(), country)
                .orElseThrow(() -> new IllegalArgumentException("Región no válida para el país"));

        City city = cityRepo.findByNameAndRegion(dto.city(), region)
                .orElseThrow(() -> new IllegalArgumentException("Ciudad no válida para la región"));

        return Address.builder()
                .city(city)
                .streetName(dto.streetName())
                .streetNumber(dto.streetNumber())
                .unit(dto.unit())
                .build();
    }

    @Override
    public Address updateAddress(Long userId, AddressDTO dto) {
        Address address = addressRepo.findByUserId(userId);
        Address normalizeNewAddress = resolveAddress(dto);
        address.setCity(normalizeNewAddress.getCity());
        address.setStreetName(normalizeNewAddress.getStreetName());
        address.setStreetNumber(normalizeNewAddress.getStreetNumber());
        address.setUnit(normalizeNewAddress.getUnit());
        addressRepo.save(address);
        return address;
        }

    @Override
    public Address createAddress(Address address) {
        return addressRepo.save(address);
    }
}