package com.sebastian.portfolio.application.dto;

public record ProfileDTO(
        Long id,
        String name,
        String role,
        String manifesto,
        String location,
        String status,
        String aboutTitle,
        String aboutDescription,
        String englishLevel,
        String currentlyLearning,
        String profileImage) {
}
