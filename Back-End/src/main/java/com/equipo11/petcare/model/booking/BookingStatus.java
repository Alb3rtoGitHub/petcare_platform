package com.equipo11.petcare.model.booking;

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
    String upperCase = value.trim().toUpperCase();
    for (BookingStatus status : BookingStatus.values()) {
      if (status.name().equalsIgnoreCase(upperCase) || status.label.equalsIgnoreCase(value.trim())) {
        return status;
      }
    }
    throw new IllegalArgumentException("El estado no valido " + value);
  }
}
