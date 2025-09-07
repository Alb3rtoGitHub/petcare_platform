package com.equipo11.petcare.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.core.convert.converter.Converter;

import com.equipo11.petcare.dto.BookingResponse;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;

@Mapper(componentModel = "spring")
public interface BookingResponseMapper extends Converter<Booking, BookingResponse> {

  // De Booking -> BookingResponse
  @Override
  @Mapping(source = "owner.id", target = "ownerId")
  @Mapping(source = "sitter.id", target = "sitterId")
  @Mapping(source = "pet.id", target = "petId")
  @Mapping(source = "serviceEntities", target = "serviceIds", qualifiedByName = "mapServiceIds")
  @Mapping(source = "status", target = "status")
  @Mapping(source = "startDateTime", target = "startDateTime")
  @Mapping(source = "endDateTime", target = "endDateTime")

  BookingResponse convert(Booking source);

  // Manejar Lista
  List<BookingResponse> convertList(List<Booking> source);

  @Named("mapServiceIds")
  default List<Long> mapServiceIds(List<?> services) {
    return services.stream()
        .map(s -> ((ServiceEntity) s).getId())
        .toList();
  }
}
