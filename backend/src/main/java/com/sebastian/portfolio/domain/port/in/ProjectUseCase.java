package com.sebastian.portfolio.domain.port.in;

import com.sebastian.portfolio.application.dto.ProjectDTO;
import java.util.List;

/**
 * PUERTO DE ENTRADA (Domain Layer)
 * Define las acciones que el mundo exterior puede realizar en nuestra
 * aplicación.
 * Es la interfaz que implementará el servicio de aplicación.
 */
public interface ProjectUseCase {
    List<ProjectDTO> getAllProjects();

    ProjectDTO getProjectById(Long id);

    ProjectDTO createProject(ProjectDTO projectDTO);

    ProjectDTO updateProject(Long id, ProjectDTO projectDTO);

    void deleteProject(Long id);
}
