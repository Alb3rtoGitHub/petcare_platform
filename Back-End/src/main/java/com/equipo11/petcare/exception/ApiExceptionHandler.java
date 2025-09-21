package com.equipo11.petcare.exception;

import com.equipo11.petcare.dto.ErrorDTO;
import com.equipo11.petcare.exception.enums.ApiError;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.ArrayList;
import java.util.List;

/**
 * Manejador global de excepciones para la aplicación PetCare.
 * Se encarga de procesar varias excepciones y convertirlas en respuestas API
 * apropiadas.
 */
@RestControllerAdvice
public class ApiExceptionHandler extends ResponseEntityExceptionHandler {

    /**
     * Maneja las instancias de PetcareException lanzadas por la aplicación.
     *
     * @param e       La excepción PetcareException que fue lanzada
     * @param request La solicitud web actual
     * @return ResponseEntity conteniendo los detalles del error y el estado HTTP
     *         apropiado
     */
    @ExceptionHandler(PetcareException.class)
    public ResponseEntity<ErrorDTO> duplicateResource(PetcareException e, WebRequest request) {
        return ResponseEntity.status(e.getStatus()).body(new ErrorDTO(e.getDescription(), e.getReasons()));
    }

    /**
     * Maneja los errores de validación para los cuerpos de las solicitudes.
     * Convierte los errores de validación en una respuesta de error estructurada.
     *
     * @param ex      La excepción MethodArgumentNotValidException que fue lanzada
     * @param headers Los encabezados que se escribirán en la respuesta
     * @param status  El estado de respuesta seleccionado
     * @param request La solicitud actual
     * @return ResponseEntity conteniendo los detalles de los errores de validación
     */
    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
                                                                  HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        List<String> reasons = new ArrayList<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            reasons.add(String.format("%s - %s", error.getField(), error.getDefaultMessage()));
        }
        return ResponseEntity.status(ApiError.VALIDATION_ERROR.getHttpStatus())
                .body(new ErrorDTO(ApiError.VALIDATION_ERROR.getMessage(), reasons));
    }
}