package com.sebastian.portfolio.presentation.rest;

import com.sebastian.portfolio.application.dto.LoginDTO;
import com.sebastian.portfolio.infrastructure.persistence.repository.PanacheUserRepository;
import com.sebastian.portfolio.infrastructure.security.TokenService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {
    private final PanacheUserRepository userRepository;
    private final TokenService tokenService;

    public AuthResource(PanacheUserRepository userRepository, TokenService tokenService) {
        this.userRepository = userRepository;
        this.tokenService = tokenService;
    }

    @POST
    @Path("/login")
    public Response login(LoginDTO loginDTO) {
        System.out.println("Intento de login para usuario: " + loginDTO.username());

        return userRepository.findByUsername(loginDTO.username())
                .map(user -> {
                    if (user.password.equals(loginDTO.password())) {
                        System.out.println("Login exitoso para: " + loginDTO.username());
                        String token = tokenService.generateToken(user.username, user.role);
                        return Response.ok(Map.of("token", token)).build();
                    } else {
                        System.out.println("Contraseña incorrecta para: " + loginDTO.username());
                        return Response.status(Response.Status.UNAUTHORIZED).build();
                    }
                })
                .orElseGet(() -> {
                    System.out.println("Usuario no encontrado: " + loginDTO.username());
                    return Response.status(Response.Status.UNAUTHORIZED).build();
                });
    }
}
