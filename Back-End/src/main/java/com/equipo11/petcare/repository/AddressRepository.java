package com.equipo11.petcare.repository;

import com.equipo11.petcare.model.address.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, Long> {
}
