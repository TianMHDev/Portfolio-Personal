package com.sebastian.portfolio.infrastructure.persistence.repository;

import com.sebastian.portfolio.domain.model.Project;
import com.sebastian.portfolio.domain.port.out.ProjectOutputPort;
import com.sebastian.portfolio.infrastructure.persistence.entity.ProjectEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class PanacheProjectRepository implements ProjectOutputPort {

    @ApplicationScoped
    public static class PanacheInternalRepository implements PanacheRepository<ProjectEntity> {
    }

    private final PanacheInternalRepository internalRepository;

    public PanacheProjectRepository(PanacheInternalRepository internalRepository) {
        this.internalRepository = internalRepository;
    }

    @Override
    public List<Project> findAll() {
        return internalRepository.listAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public Optional<Project> findById(Long id) {
        return internalRepository.findByIdOptional(id).map(this::toDomain);
    }

    @Override
    public Project save(Project project) {
        ProjectEntity entity = toEntity(project);
        internalRepository.persist(entity);
        return toDomain(entity);
    }

    @Override
    public Project update(Project project) {
        ProjectEntity entity = internalRepository.findById(project.getId());
        if (entity != null) {
            entity.title = project.getTitle();
            entity.description = project.getDescription();
            entity.technologies = project.getTechnologies();
            entity.problem = project.getProblem();
            entity.learning = project.getLearning();
            entity.features = project.getFeatures();
            entity.architecture = project.getArchitecture();
            entity.githubUrl = project.getGithubUrl();
            entity.demoUrl = project.getDemoUrl();
            entity.imageUrls = project.getImageUrls();
        }
        return toDomain(entity);
    }

    @Override
    public void deleteById(Long id) {
        internalRepository.deleteById(id);
    }

    private Project toDomain(ProjectEntity entity) {
        if (entity == null)
            return null;
        return new Project(entity.id, entity.title, entity.description, entity.technologies,
                entity.problem, entity.learning, entity.features,
                entity.architecture, entity.githubUrl, entity.demoUrl, entity.imageUrls,
                entity.version);
    }

    private ProjectEntity toEntity(Project project) {
        ProjectEntity entity = new ProjectEntity();
        entity.id = project.getId();
        entity.title = project.getTitle();
        entity.description = project.getDescription();
        entity.technologies = project.getTechnologies();
        entity.problem = project.getProblem();
        entity.learning = project.getLearning();
        entity.features = project.getFeatures();
        entity.architecture = project.getArchitecture();
        entity.githubUrl = project.getGithubUrl();
        entity.demoUrl = project.getDemoUrl();
        entity.imageUrls = project.getImageUrls();
        entity.version = project.getVersion();
        return entity;
    }
}
