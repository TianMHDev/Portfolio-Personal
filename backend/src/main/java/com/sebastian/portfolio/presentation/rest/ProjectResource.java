package com.sebastian.portfolio.presentation.rest;

import com.sebastian.portfolio.application.dto.ProjectDTO;
import com.sebastian.portfolio.domain.port.in.ProjectUseCase;
import jakarta.annotation.security.RolesAllowed;
import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.eclipse.microprofile.openapi.annotations.enums.SecuritySchemeType;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.eclipse.microprofile.openapi.annotations.security.SecurityScheme;

/**
 * Recurso REST para la gestión de proyectos.
 * Define los endpoints para las operaciones CRUD del portafolio técnico.
 */
@Path("/projects")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@SecurityScheme(securitySchemeName = "jwt", type = SecuritySchemeType.HTTP, scheme = "bearer", bearerFormat = "JWT")
@SecurityRequirement(name = "jwt")
public class ProjectResource {
    private final ProjectUseCase projectService;

    public ProjectResource(ProjectUseCase projectService) {
        this.projectService = projectService;
    }

    /**
     * Obtiene la lista completa de proyectos.
     * Acceso: Público (PermitAll).
     */
    @GET
    @PermitAll
    public List<ProjectDTO> getAll() {
        return projectService.getAllProjects();
    }

    /**
     * Obtiene un proyecto específico por su ID.
     * Acceso: Público (PermitAll).
     */
    @GET
    @Path("/{id}")
    @PermitAll
    public ProjectDTO getById(@PathParam("id") Long id) {
        return projectService.getProjectById(id);
    }

    /**
     * Crea un nuevo proyecto en el sistema.
     * Acceso: Solo Administrador (ADMIN) con JWT.
     */
    @POST
    @RolesAllowed("ADMIN")
    public Response create(ProjectDTO projectDTO) {
        return Response.status(Response.Status.CREATED)
                .entity(projectService.createProject(projectDTO))
                .build();
    }

    /**
     * Actualiza un proyecto existente.
     * Acceso: Solo Administrador (ADMIN) con JWT.
     */
    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public ProjectDTO update(@PathParam("id") Long id, ProjectDTO projectDTO) {
        return projectService.updateProject(id, projectDTO);
    }

    /**
     * Elimina un proyecto del sistema.
     * Acceso: Solo Administrador (ADMIN) con JWT.
     */
    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response delete(@PathParam("id") Long id) {
        projectService.deleteProject(id);
        return Response.noContent().build();
    }
}
