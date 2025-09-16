package com.equipo11.petcare.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.core.convert.converter.Converter;

import com.equipo11.petcare.dto.BookingDetailResponse;
import com.equipo11.petcare.dto.BookingResponse;
import com.equipo11.petcare.dto.ServiceDetailResponse;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.serviceentity.ServiceEntity;
import com.equipo11.petcare.model.user.User;

@Mapper(componentModel = "spring")
public interface BookingResponseMapper extends Converter<Booking, BookingResponse> {

  // Booking -> BookingResponse (plano)
  @Override
  @Mapping(source = "owner.id", target = "ownerId")
  @Mapping(source = "sitter.id", target = "sitterId")
  @Mapping(source = "pet.id", target = "petId")
  @Mapping(source = "serviceEntities", target = "serviceIds", qualifiedByName = "mapServiceIds")
  BookingResponse convert(Booking source);

  List<BookingResponse> convertList(List<Booking> source);

  @Named("mapServiceIds")
  default List<Long> mapServiceIds(List<ServiceEntity> services) {
    return services.stream().map(ServiceEntity::getId).toList();
  }

  // Booking -> BookingDetailResponse (detallado)
  @Mapping(source = "owner.id", target = "ownerId")
  @Mapping(source = "owner.email", target = "ownerEmail")
  @Mapping(source = "owner", target = "ownerName", qualifiedByName = "fullName")
  @Mapping(source = "sitter.id", target = "sitterId")
  @Mapping(source = "sitter.email", target = "sitterEmail")
  @Mapping(source = "sitter", target = "sitterName", qualifiedByName = "fullName")
  @Mapping(source = "pet.id", target = "petId")
  @Mapping(source = "pet.name", target = "petName")
  @Mapping(source = "pet.species", target = "petType")
  @Mapping(source = "serviceEntities", target = "services")
  @Mapping(source = "status.label", target = "statusLabel")
  @Mapping(source = "createdAt", target = "createdAt")
  BookingDetailResponse toDetailResponse(Booking booking);

  List<BookingDetailResponse> toDetailResponseList(List<Booking> bookings);

  // ServiceEntity -> ServiceDetailResponse
  @Mapping(source = "serviceName", target = "serviceName")
  @Mapping(source = "description", target = "description")
  @Mapping(source = "price", target = "price")
  @Mapping(source = "duration", target = "duration")
  @Mapping(source = "active", target = "active")
  ServiceDetailResponse toServiceDetailResponse(ServiceEntity service);

  @Named("fullName")
  default String fullName(User u) {
    if (u == null)
      return null;
    String fn = u.getFirstName() != null ? u.getFirstName() : "";
    String ln = u.getLastName() != null ? u.getLastName() : "";
    String res = (fn + " " + ln).trim();
    return res.isEmpty() ? null : res;
  }
}
