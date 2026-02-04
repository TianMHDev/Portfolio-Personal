package com.sebastian.portfolio.application.dto;

import java.time.LocalDateTime;

/**
 * DATA TRANSFER OBJECT (Application Layer)
 * Objeto que viaja entre capas. Define la estructura de los datos.
 */
public record ContactDTO(
        Long id,
        String name,
        String email,
        String message,
        LocalDateTime createdAt) {
}
