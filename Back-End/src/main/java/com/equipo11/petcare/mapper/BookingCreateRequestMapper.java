package com.equipo11.petcare.mapper;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.model.booking.Booking;
import org.mapstruct.Mapper;
import org.springframework.core.convert.converter.Converter;

@Mapper(componentModel = "spring")
public interface BookingCreateRequestMapper extends Converter<BookingCreateRequest, Booking> {
  // De DTO -> Entity
  @Override
  Booking convert(BookingCreateRequest source);
}
