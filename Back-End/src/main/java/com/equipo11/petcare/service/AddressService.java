package com.equipo11.petcare.service;

import com.equipo11.petcare.dto.AddressDTO;
import com.equipo11.petcare.model.address.Address;

public interface AddressService {

    Address resolveAddress(AddressDTO dto);
}
