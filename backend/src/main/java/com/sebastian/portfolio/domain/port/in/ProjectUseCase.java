package com.sebastian.portfolio.domain.port.in;

import com.sebastian.portfolio.application.dto.ProjectDTO;
import java.util.List;

public interface ProjectUseCase {
    List<ProjectDTO> getAllProjects();

    ProjectDTO getProjectById(Long id);

    ProjectDTO createProject(ProjectDTO projectDTO);

    ProjectDTO updateProject(Long id, ProjectDTO projectDTO);

    void deleteProject(Long id);
}
