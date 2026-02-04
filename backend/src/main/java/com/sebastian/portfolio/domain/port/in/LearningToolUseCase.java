package com.sebastian.portfolio.domain.port.in;

import com.sebastian.portfolio.application.dto.LearningToolDTO;
import java.util.List;

/**
 * PUERTO DE ENTRADA (Domain Layer)
 * Define las acciones que el mundo exterior puede realizar en nuestra
 * aplicación.
 * Es la interfaz que implementará el servicio de aplicación.
 */
public interface LearningToolUseCase {
    List<LearningToolDTO> getAllTools();

    LearningToolDTO getToolById(Long id);

    LearningToolDTO createTool(LearningToolDTO toolDTO);

    LearningToolDTO updateTool(Long id, LearningToolDTO toolDTO);

    void deleteTool(Long id);
}
