package com.sebastian.portfolio.presentation.rest;

import com.sebastian.portfolio.application.dto.LearningToolDTO;
import com.sebastian.portfolio.domain.port.in.LearningToolUseCase;
import jakarta.annotation.security.RolesAllowed;
import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;

@Path("/learning-tools")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@SecurityRequirement(name = "jwt")
public class LearningToolResource {
    private final LearningToolUseCase learningToolService;

    public LearningToolResource(LearningToolUseCase learningToolService) {
        this.learningToolService = learningToolService;
    }

    @GET
    @PermitAll
    public List<LearningToolDTO> getAll() {
        return learningToolService.getAllTools();
    }

    @GET
    @Path("/{id}")
    @PermitAll
    public LearningToolDTO getById(@PathParam("id") Long id) {
        return learningToolService.getToolById(id);
    }

    @POST
    @RolesAllowed("ADMIN")
    public Response create(LearningToolDTO toolDTO) {
        return Response.status(Response.Status.CREATED)
                .entity(learningToolService.createTool(toolDTO))
                .build();
    }

    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public LearningToolDTO update(@PathParam("id") Long id, LearningToolDTO toolDTO) {
        return learningToolService.updateTool(id, toolDTO);
    }

    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response delete(@PathParam("id") Long id) {
        learningToolService.deleteTool(id);
        return Response.noContent().build();
    }
}
