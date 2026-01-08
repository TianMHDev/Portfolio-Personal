package com.sebastian.portfolio.application.dto;

public record LearningToolDTO(
        Long id,
        String name,
        String category,
        String status,
        Integer progress) {
}
