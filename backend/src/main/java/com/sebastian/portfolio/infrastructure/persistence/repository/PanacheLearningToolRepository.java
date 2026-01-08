package com.sebastian.portfolio.infrastructure.persistence.repository;

import com.sebastian.portfolio.domain.model.LearningTool;
import com.sebastian.portfolio.domain.port.out.LearningToolOutputPort;
import com.sebastian.portfolio.infrastructure.persistence.entity.LearningToolEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@ApplicationScoped
public class PanacheLearningToolRepository implements LearningToolOutputPort {

    @ApplicationScoped
    public static class PanacheInternalRepository implements PanacheRepository<LearningToolEntity> {
    }

    private final PanacheInternalRepository internalRepository;

    public PanacheLearningToolRepository(PanacheInternalRepository internalRepository) {
        this.internalRepository = internalRepository;
    }

    @Override
    public List<LearningTool> findAll() {
        return internalRepository.listAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public Optional<LearningTool> findById(Long id) {
        return internalRepository.findByIdOptional(id).map(this::toDomain);
    }

    @Override
    public LearningTool save(LearningTool tool) {
        LearningToolEntity entity = toEntity(tool);
        internalRepository.persist(entity);
        return toDomain(entity);
    }

    @Override
    public LearningTool update(LearningTool tool) {
        LearningToolEntity entity = internalRepository.findById(tool.getId());
        if (entity != null) {
            entity.name = tool.getName();
            entity.category = tool.getCategory();
            entity.status = tool.getStatus();
            entity.progress = tool.getProgress();
        }
        return toDomain(entity);
    }

    @Override
    public void deleteById(Long id) {
        internalRepository.deleteById(id);
    }

    private LearningTool toDomain(LearningToolEntity entity) {
        if (entity == null)
            return null;
        return new LearningTool(entity.id, entity.name, entity.category, entity.status, entity.progress);
    }

    private LearningToolEntity toEntity(LearningTool tool) {
        LearningToolEntity entity = new LearningToolEntity();
        entity.id = tool.getId();
        entity.name = tool.getName();
        entity.category = tool.getCategory();
        entity.status = tool.getStatus();
        entity.progress = tool.getProgress();
        return entity;
    }
}
