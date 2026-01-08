package com.sebastian.portfolio.domain.port.out;

import com.sebastian.portfolio.domain.model.LearningTool;
import java.util.List;
import java.util.Optional;

public interface LearningToolOutputPort {
    List<LearningTool> findAll();

    Optional<LearningTool> findById(Long id);

    LearningTool save(LearningTool tool);

    LearningTool update(LearningTool tool);

    void deleteById(Long id);
}
