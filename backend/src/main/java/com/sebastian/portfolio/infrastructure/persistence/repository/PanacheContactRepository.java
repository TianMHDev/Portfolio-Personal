package com.sebastian.portfolio.infrastructure.persistence.repository;

import com.sebastian.portfolio.domain.model.ContactMessage;
import com.sebastian.portfolio.domain.port.out.ContactOutputPort;
import com.sebastian.portfolio.infrastructure.persistence.entity.ContactMessageEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class PanacheContactRepository implements ContactOutputPort {

    @ApplicationScoped
    public static class PanacheInternalRepository implements PanacheRepository<ContactMessageEntity> {
    }

    private final PanacheInternalRepository internalRepository;

    public PanacheContactRepository(PanacheInternalRepository internalRepository) {
        this.internalRepository = internalRepository;
    }

    @Override
    public ContactMessage save(ContactMessage message) {
        ContactMessageEntity entity = new ContactMessageEntity();
        entity.name = message.getName();
        entity.email = message.getEmail();
        entity.message = message.getMessage();
        entity.createdAt = message.getCreatedAt();
        internalRepository.persist(entity);
        message.setId(entity.id);
        return message;
    }

    @Override
    public List<ContactMessage> findAll() {
        return internalRepository.listAll().stream().map(this::toDomain).collect(Collectors.toList());
    }

    private ContactMessage toDomain(ContactMessageEntity entity) {
        return new ContactMessage(entity.id, entity.name, entity.email, entity.message, entity.createdAt);
    }
}
