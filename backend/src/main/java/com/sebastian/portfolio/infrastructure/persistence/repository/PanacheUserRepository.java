package com.sebastian.portfolio.infrastructure.persistence.repository;

import com.sebastian.portfolio.infrastructure.persistence.entity.UserEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.Optional;

@ApplicationScoped
public class PanacheUserRepository implements PanacheRepository<UserEntity> {
    public Optional<UserEntity> findByUsername(String username) {
        return find("username", username).firstResultOptional();
    }
}
