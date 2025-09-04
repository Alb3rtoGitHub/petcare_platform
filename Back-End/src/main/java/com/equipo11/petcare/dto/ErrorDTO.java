package com.equipo11.petcare.dto;

import java.util.List;

public record ErrorDTO(
    String description,
    List<String> reasons) {
}
