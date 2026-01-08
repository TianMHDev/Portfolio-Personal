package com.sebastian.portfolio.application.mapper;

import com.sebastian.portfolio.application.dto.ProjectDTO;
import com.sebastian.portfolio.domain.model.Project;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class ProjectMapper {
    public ProjectDTO toDTO(Project project) {
        if (project == null)
            return null;
        return new ProjectDTO(project.getId(), project.getTitle(), project.getDescription(),
                project.getTechnologies(), project.getProblem(), project.getLearning(),
                project.getFeatures(), project.getArchitecture(),
                project.getGithubUrl(), project.getDemoUrl(), project.getImageUrls(),
                project.getVersion());
    }

    public Project toDomain(ProjectDTO dto) {
        if (dto == null)
            return null;
        return new Project(dto.id(), dto.title(), dto.description(), dto.technologies(),
                dto.problem(), dto.learning(), dto.features(),
                dto.architecture(), dto.githubUrl(), dto.demoUrl(), dto.imageUrls(),
                dto.version());
    }
}
