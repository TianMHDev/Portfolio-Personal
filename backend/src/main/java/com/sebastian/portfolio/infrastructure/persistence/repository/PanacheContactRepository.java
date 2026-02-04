package com.sebastian.portfolio.infrastructure.persistence.repository;

import com.sebastian.portfolio.domain.model.ContactMessage;
import com.sebastian.portfolio.domain.port.out.ContactOutputPort;
import com.sebastian.portfolio.infrastructure.persistence.entity.ContactMessageEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.List;
import java.util.stream.Collectors;

/**
 * ADAPTADOR DE SALIDA (Infrastructure Layer)
 * Implementa el puerto de salida ContactOutputPort.
 * Se encarga de la comunicación técnica con la base de datos usando Hibernate
 * Panache.
 */
@ApplicationScoped
public class PanacheContactRepository implements ContactOutputPort {

    /**
     * Repositorio interno de Panache que gestiona directamente las Entidades JPA.
     */
    @ApplicationScoped
    public static class PanacheInternalRepository implements PanacheRepository<ContactMessageEntity> {
    }

    private final PanacheInternalRepository internalRepository;

    public PanacheContactRepository(PanacheInternalRepository internalRepository) {
        this.internalRepository = internalRepository;
    }

    @Override
    public ContactMessage save(ContactMessage message) {
        // Conversión manual de Modelo de Dominio -> Entidad JPA para desacoplar las
        // capas
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
        return internalRepository.listAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    /**
     * Mapeo de Entidad JPA (Infraestructura) a Modelo de Dominio.
     */
    private ContactMessage toDomain(ContactMessageEntity entity) {
        return new ContactMessage(entity.id, entity.name, entity.email, entity.message, entity.createdAt);
    }
}
