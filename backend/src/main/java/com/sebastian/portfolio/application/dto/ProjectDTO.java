package com.sebastian.portfolio.application.dto;

import java.util.List;

public record ProjectDTO(
                Long id,
                String title,
                String description,
                List<String> technologies,
                String problem,
                String learning,
                List<String> features,
                String architecture,
                String githubUrl,
                String demoUrl,
                List<String> imageUrls,
                String version) {
}
