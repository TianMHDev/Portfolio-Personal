package com.sebastian.portfolio.infrastructure.persistence.entity;

import jakarta.persistence.*;
import java.util.List;

/**
 * Entidad JPA que representa la tabla 'projects' en la base de datos.
 * Define la estructura de persistencia para los proyectos del portafolio.
 */
@Entity
@Table(name = "projects")
public class ProjectEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false)
    public String title; // Título del proyecto

    @Column(columnDefinition = "TEXT")
    public String description; // Descripción detallada o solución

    // Colección de tecnologías (Stack) asociadas al proyecto
    @ElementCollection
    @CollectionTable(name = "project_technologies", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "technology")
    public List<String> technologies;

    @Column(columnDefinition = "TEXT")
    public String problem; // Problema que resuelve el proyecto

    @Column(columnDefinition = "TEXT")
    public String learning; // Aprendizaje obtenido

    // Características principales del proyecto
    @ElementCollection
    @CollectionTable(name = "project_features", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "feature")
    public List<String> features;

    public String architecture; // Categoría o Capa de Arquitectura (ej: Backend / Java)
    public String githubUrl; // Enlace al repositorio de código
    public String demoUrl; // Enlace al proyecto desplegado

    // Lista de URLs para las imágenes del carrusel (máximo 3 soportadas por UI)
    @ElementCollection
    @CollectionTable(name = "project_images", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "image_url")
    public List<String> imageUrls;

    public String version; // Versión actual del proyecto (ej: 1.1.0)
}
