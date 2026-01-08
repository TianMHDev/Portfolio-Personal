package com.sebastian.portfolio.application.dto;

import java.time.LocalDateTime;

public record ContactDTO(
        Long id,
        String name,
        String email,
        String message,
        LocalDateTime createdAt) {
}
