package com.sebastian.portfolio.presentation.rest;

import com.sebastian.portfolio.application.dto.ProfileDTO;
import com.sebastian.portfolio.infrastructure.persistence.entity.ProfileEntity;
import jakarta.annotation.security.RolesAllowed;
import jakarta.annotation.security.PermitAll;
import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

/**
 * Recurso REST para gestionar la información del perfil del portafolio.
 */
@Path("/profile")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ProfileResource {

    /**
     * Obtiene la información del perfil. Si no existe en BD, devuelve los datos
     * originales de constants.tsx.
     */
    @GET
    @PermitAll
    public ProfileDTO get() {
        ProfileEntity profile = ProfileEntity.findById(1L);
        if (profile == null) {
            // Datos originales exactos de constants.tsx
            return new ProfileDTO(
                    1L,
                    "SEBASTIAN MARRIAGA",
                    "BACKEND DEVELOPER JUNIOR",
                    "CÓDIGO SÓLIDO, INTERFACES FUNCIONALES, RESULTADOS REALES",
                    "Barranquilla, Colombia (Remoto / Híbrido)",
                    "ACTUALMENTE: APRENDIENDO QUARKUS",
                    "PERFIL_HÍBRIDO",
                    "Soy un Backend Developer Junior con una visión integral del desarrollo web. Mi fortaleza reside en la lógica del servidor, bases de datos y APIs, complementada con habilidades en Frontend (Angular/HTML/CSS).\n\nEsta versatilidad me permite construir soluciones completas, desde el \"motor\" hasta la interfaz, garantizando una comunicación fluida entre capas. Me defino por mi constancia, mentalidad de ingeniero y compromiso con la calidad.",
                    "Inglés Técnico (Básico/Pre-Intermedio) - Lectura y escritura técnica.",
                    "Quarkus",
                    "https://avatars.githubusercontent.com/u/211703811?s=400&u=e09c4e6ffe4a2964a5092000a06af0ae8da045d8&v=4");
        }
        return map(profile);
    }

    /**
     * Actualiza la información del perfil. Solo accesible por el ADMIN.
     */
    @PUT
    @RolesAllowed("ADMIN")
    @Transactional
    public ProfileDTO update(ProfileDTO dto) {
        ProfileEntity entity = ProfileEntity.findById(1L);
        if (entity == null) {
            entity = new ProfileEntity();
            entity.id = 1L;
        }
        entity.name = dto.name();
        entity.role = dto.role();
        entity.manifesto = dto.manifesto();
        entity.location = dto.location();
        entity.status = dto.status();
        entity.aboutTitle = dto.aboutTitle();
        entity.aboutDescription = dto.aboutDescription();
        entity.englishLevel = dto.englishLevel();
        entity.currentlyLearning = dto.currentlyLearning();
        entity.profileImage = dto.profileImage();

        entity.persist();
        return map(entity);
    }

    private ProfileDTO map(ProfileEntity e) {
        return new ProfileDTO(e.id, e.name, e.role, e.manifesto, e.location, e.status,
                e.aboutTitle, e.aboutDescription, e.englishLevel, e.currentlyLearning, e.profileImage);
    }
}
