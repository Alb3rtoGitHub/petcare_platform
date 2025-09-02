package com.equipo11.petcare.controller;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.model.booking.Booking;
import com.equipo11.petcare.model.booking.BookingStatus;
import com.equipo11.petcare.service.BookingService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class BookingControllerTest {

  @Mock
  private BookingService bookingService;

  @InjectMocks
  private BookingController bookingController;

  @Test
  void crearReserva_debeRetornarReservaCreada() {
    // Preparación
    LocalDateTime inicio = LocalDateTime.now().plusDays(1).withNano(0);
    LocalDateTime fin = inicio.plusHours(2);
    BookingCreateRequest solicitud = new BookingCreateRequest(
        1L, 2L, 3L,
        List.of(UUID.randomUUID()),
        inicio, fin,
        "tratar con cuidado");

    // Simular respuesta del servicio
    Booking reservaEsperada = new Booking();
    reservaEsperada.setId(UUID.randomUUID());
    reservaEsperada.setStartDateTime(inicio);
    reservaEsperada.setEndDateTime(fin);
    reservaEsperada.setTotalPrice(new BigDecimal("25.00"));
    reservaEsperada.setStatus(BookingStatus.PENDING);
    reservaEsperada.setSpecialInstructions("tratar con cuidado");

    when(bookingService.addBooking(any(BookingCreateRequest.class))).thenReturn(reservaEsperada);

    // Ejecución
    ResponseEntity<Booking> respuesta = bookingController.addBooking(solicitud);

    // Verificaciones
    assertNotNull(respuesta, "La respuesta no debería ser nula");
    assertEquals(201, respuesta.getStatusCodeValue(), "El código de estado debería ser 201 (CREATED)");

    Booking reservaReal = respuesta.getBody();
    assertNotNull(reservaReal, "El cuerpo de la respuesta no debería ser nulo");
    assertEquals(reservaEsperada.getId(), reservaReal.getId(), "El ID de la reserva no coincide");
    assertEquals(reservaEsperada.getStartDateTime(), reservaReal.getStartDateTime(), "La fecha de inicio no coincide");
    assertEquals(reservaEsperada.getEndDateTime(), reservaReal.getEndDateTime(), "La fecha de fin no coincide");
    assertEquals(reservaEsperada.getTotalPrice(), reservaReal.getTotalPrice(), "El precio total no coincide");
    assertEquals(reservaEsperada.getStatus(), reservaReal.getStatus(), "El estado no coincide");
    assertEquals(reservaEsperada.getSpecialInstructions(), reservaReal.getSpecialInstructions(),
        "Las instrucciones especiales no coinciden");

    // Verificar la interacción con el servicio
    verify(bookingService).addBooking(any(BookingCreateRequest.class));
  }
}
