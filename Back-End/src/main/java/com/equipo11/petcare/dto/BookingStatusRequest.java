package com.equipo11.petcare.dto;

import com.equipo11.petcare.model.booking.BookingStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BookingStatusRequest {
  @NotNull(message = "El estado de la reserva no puede ser nulo")
  private BookingStatus bookingStatus;
}
