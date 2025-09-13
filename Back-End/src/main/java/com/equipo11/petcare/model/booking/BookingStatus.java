package com.equipo11.petcare.model.booking;

import java.util.Locale;

public enum BookingStatus {
  PENDING("pendiente"),
  CONFIRMED("confirmado"),
  IN_PROGRESS("en progreso"),
  COMPLETED("completado"),
  CANCELLED("cancelado");

  private final String label;

  public String getLabel() {
    return this.label;
  }

  BookingStatus(String label) {
    this.label = label;
  }

  // Acepta el estado en español, ademas recibe la cadena en minúscula o mayúscula
  // .
  public static BookingStatus fromValue(String value) {
    // Compara por label o nombre del enum e ignora mayúsculas
    if (value == null) {
      throw new IllegalArgumentException("El estado no puede ser nul");
    }
    String lowerCase = value.trim().toLowerCase();
    for (BookingStatus status : BookingStatus.values()) {
        if (status.name().equalsIgnoreCase(lowerCase) ||
                status.label.toLowerCase().equals(lowerCase)) {
            return status;
        }
    }
    throw new IllegalArgumentException("El estado no valido " + value);
  }
}
