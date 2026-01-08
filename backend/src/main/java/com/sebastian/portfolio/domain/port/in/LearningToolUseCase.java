package com.sebastian.portfolio.domain.port.in;

import com.sebastian.portfolio.application.dto.LearningToolDTO;
import java.util.List;

public interface LearningToolUseCase {
    List<LearningToolDTO> getAllTools();

    LearningToolDTO getToolById(Long id);

    LearningToolDTO createTool(LearningToolDTO toolDTO);

    LearningToolDTO updateTool(Long id, LearningToolDTO toolDTO);

    void deleteTool(Long id);
}
