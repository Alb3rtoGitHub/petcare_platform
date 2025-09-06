package com.equipo11.petcare.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.equipo11.petcare.dto.BookingCreateRequest;
import com.equipo11.petcare.dto.BookingResponse;
import com.equipo11.petcare.model.user.User;
import com.equipo11.petcare.service.BookingService;

@ExtendWith(MockitoExtension.class)
class BookingControllerTest {

  @Mock
  private BookingService bookingService;

  @InjectMocks
  private BookingController bookingController;

  private BookingResponse reservaTest;
  private BookingCreateRequest solicitudCreacion;
  private LocalDateTime fechaInicio;
  private LocalDateTime fechaFin;
  private User currentUser;

  @BeforeEach
  void setUp() {
    fechaInicio = LocalDateTime.now().plusDays(1).withNano(0);
    fechaFin = fechaInicio.plusHours(2);

    // Configuración de la solicitud de reserva
    solicitudCreacion = new BookingCreateRequest(
        1L, // idCliente
        2L, // idCuidador
        3L, // idDireccion
        List.of(10L), // idsMascotas
        fechaInicio,
        fechaFin,
        "Tratar con cuidado");

    // Usuario autenticado simulado
    currentUser = org.mockito.Mockito.mock(User.class);

    // Configuración de la respuesta esperada
    reservaTest = org.mockito.Mockito.mock(BookingResponse.class);

  }
}
