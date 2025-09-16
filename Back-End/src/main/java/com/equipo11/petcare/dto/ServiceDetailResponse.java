package com.equipo11.petcare.dto;

import java.math.BigDecimal;

public record ServiceDetailResponse(
    Long id,
    String serviceName,
    String description,
    Double price,
    Long duration,
    Boolean active) {

}
