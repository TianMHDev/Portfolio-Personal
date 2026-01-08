package com.sebastian.portfolio.application.mapper;

import com.sebastian.portfolio.application.dto.LearningToolDTO;
import com.sebastian.portfolio.domain.model.LearningTool;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class LearningToolMapper {
    public LearningToolDTO toDTO(LearningTool tool) {
        return new LearningToolDTO(tool.getId(), tool.getName(), tool.getCategory(),
                tool.getStatus(), tool.getProgress());
    }

    public LearningTool toDomain(LearningToolDTO dto) {
        return new LearningTool(dto.id(), dto.name(), dto.category(), dto.status(), dto.progress());
    }
}
