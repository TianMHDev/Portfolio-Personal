package com.sebastian.portfolio.infrastructure.persistence.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "learning_tools")
public class LearningToolEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String name;

    public String category;
    public String status;
    public Integer progress;
}
