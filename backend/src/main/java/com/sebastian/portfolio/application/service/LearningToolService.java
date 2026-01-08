package com.sebastian.portfolio.application.service;

import com.sebastian.portfolio.domain.port.in.LearningToolUseCase;
import com.sebastian.portfolio.domain.port.out.LearningToolOutputPort;
import com.sebastian.portfolio.application.dto.LearningToolDTO;
import com.sebastian.portfolio.application.mapper.LearningToolMapper;
import com.sebastian.portfolio.domain.model.LearningTool;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class LearningToolService implements LearningToolUseCase {
    private final LearningToolOutputPort learningToolRepository;
    private final LearningToolMapper learningToolMapper;

    public LearningToolService(LearningToolOutputPort learningToolRepository, LearningToolMapper learningToolMapper) {
        this.learningToolRepository = learningToolRepository;
        this.learningToolMapper = learningToolMapper;
    }

    @Override
    public List<LearningToolDTO> getAllTools() {
        return learningToolRepository.findAll().stream()
                .map(learningToolMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public LearningToolDTO getToolById(Long id) {
        return learningToolRepository.findById(id)
                .map(learningToolMapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Tool not found"));
    }

    @Override
    @Transactional
    public LearningToolDTO createTool(LearningToolDTO toolDTO) {
        LearningTool tool = learningToolMapper.toDomain(toolDTO);
        return learningToolMapper.toDTO(learningToolRepository.save(tool));
    }

    @Override
    @Transactional
    public LearningToolDTO updateTool(Long id, LearningToolDTO toolDTO) {
        LearningTool tool = learningToolMapper.toDomain(toolDTO);
        tool.setId(id);
        return learningToolMapper.toDTO(learningToolRepository.update(tool));
    }

    @Override
    @Transactional
    public void deleteTool(Long id) {
        learningToolRepository.deleteById(id);
    }
}
