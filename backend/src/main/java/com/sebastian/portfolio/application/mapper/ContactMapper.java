package com.sebastian.portfolio.application.mapper;

import com.sebastian.portfolio.application.dto.ContactDTO;
import com.sebastian.portfolio.domain.model.ContactMessage;
import jakarta.enterprise.context.ApplicationScoped;

/**
 * MAPPER (Application Layer)
 * Se encarga de la traducción entre el Modelo de Dominio y los DTOs.
 */
@ApplicationScoped
public class ContactMapper {
    public ContactDTO toDTO(ContactMessage message) {
        return new ContactDTO(message.getId(), message.getName(), message.getEmail(),
                message.getMessage(), message.getCreatedAt());
    }

    public ContactMessage toDomain(ContactDTO dto) {
        return new ContactMessage(dto.id(), dto.name(), dto.email(), dto.message(), dto.createdAt());
    }
}
