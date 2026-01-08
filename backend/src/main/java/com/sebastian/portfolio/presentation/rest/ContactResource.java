package com.sebastian.portfolio.presentation.rest;

import com.sebastian.portfolio.application.dto.ContactDTO;
import com.sebastian.portfolio.domain.port.in.ContactUseCase;
import jakarta.annotation.security.RolesAllowed;
import jakarta.annotation.security.PermitAll;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;

@Path("/contact")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
@SecurityRequirement(name = "jwt")
public class ContactResource {
    private final ContactUseCase contactService;

    public ContactResource(ContactUseCase contactService) {
        this.contactService = contactService;
    }

    @POST
    @PermitAll
    public Response sendMessage(ContactDTO contactDTO) {
        System.out.println("Recibido mensaje de: " + contactDTO.email());
        return Response.status(Response.Status.CREATED)
                .entity(contactService.sendMessage(contactDTO))
                .build();
    }

    @GET
    @RolesAllowed("ADMIN")
    public List<ContactDTO> getAllMessages() {
        return contactService.getAllMessages();
    }
}
