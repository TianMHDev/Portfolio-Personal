package com.sebastian.portfolio.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

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
