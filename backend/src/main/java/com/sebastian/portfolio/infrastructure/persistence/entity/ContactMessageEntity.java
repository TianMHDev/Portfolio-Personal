package com.sebastian.portfolio.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * ENTIDAD JPA (Infrastructure Layer)
 * Representa la tabla de la base de datos. Es específica de la tecnología
 * (Hibernate/JPA).
 */
@Entity
@Table(name = "contact_messages")
public class ContactMessageEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String name;

    @Column(nullable = false)
    public String email;

    @Column(columnDefinition = "TEXT", nullable = false)
    public String message;

    @Column(nullable = false)
    public LocalDateTime createdAt;
}
