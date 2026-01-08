package com.sebastian.portfolio.application.service;

import com.sebastian.portfolio.domain.port.in.ProjectUseCase;
import com.sebastian.portfolio.domain.port.out.ProjectOutputPort;
import com.sebastian.portfolio.application.dto.ProjectDTO;
import com.sebastian.portfolio.application.mapper.ProjectMapper;
import com.sebastian.portfolio.domain.model.Project;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de aplicación que implementa los casos de uso para Proyectos.
 * Orquestador entre el puerto de entrada (UseCase) y el puerto de salida
 * (Repository).
 */
@ApplicationScoped
public class ProjectService implements ProjectUseCase {
    private final ProjectOutputPort projectRepository;
    private final ProjectMapper projectMapper;

    public ProjectService(ProjectOutputPort projectRepository, ProjectMapper projectMapper) {
        this.projectRepository = projectRepository;
        this.projectMapper = projectMapper;
    }

    /**
     * Recupera todos los proyectos persistidos.
     */
    @Override
    public List<ProjectDTO> getAllProjects() {
        return projectRepository.findAll().stream()
                .map(projectMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Busca un proyecto por su identificador único.
     */
    @Override
    public ProjectDTO getProjectById(Long id) {
        return projectRepository.findById(id)
                .map(projectMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Proyecto no encontrado"));
    }

    /**
     * Transforma el DTO a dominio y lo persiste.
     */
    @Override
    @Transactional
    public ProjectDTO createProject(ProjectDTO projectDTO) {
        Project project = projectMapper.toDomain(projectDTO);
        return projectMapper.toDTO(projectRepository.save(project));
    }

    /**
     * Actualiza la información de un proyecto existente.
     */
    @Override
    @Transactional
    public ProjectDTO updateProject(Long id, ProjectDTO projectDTO) {
        Project project = projectMapper.toDomain(projectDTO);
        project.setId(id);
        return projectMapper.toDTO(projectRepository.update(project));
    }

    /**
     * Elimina el recurso por su ID.
     */
    @Override
    @Transactional
    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}
