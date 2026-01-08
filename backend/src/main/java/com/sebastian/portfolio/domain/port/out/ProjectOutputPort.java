package com.sebastian.portfolio.domain.port.out;

import com.sebastian.portfolio.domain.model.Project;
import java.util.List;
import java.util.Optional;

public interface ProjectOutputPort {
    List<Project> findAll();

    Optional<Project> findById(Long id);

    Project save(Project project);

    Project update(Project project);

    void deleteById(Long id);
}
