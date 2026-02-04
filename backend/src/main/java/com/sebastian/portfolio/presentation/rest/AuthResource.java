package com.sebastian.portfolio.presentation.rest;

import com.sebastian.portfolio.application.dto.LoginDTO;
import com.sebastian.portfolio.infrastructure.persistence.repository.PanacheUserRepository;
import com.sebastian.portfolio.infrastructure.security.TokenService;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.Map;

/**
 * ADAPTADOR DE ENTRADA - SEGURIDAD (Presentation Layer)
 * Gestiona la autenticación de usuarios.
 * En un sistema real, compararía el hash de la contraseña, aquí se simplifica
 * para la demo.
 */
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

    /**
     * Endpoint de Login.
     * 1. Busca al usuario en la base de datos.
     * 2. Valida credenciales.
     * 3. Genera y retorna un JWT si los datos son correctos.
     */
    @POST
    @Path("/login")
    public Response login(LoginDTO loginDTO) {
        System.out.println("Intento de login para usuario: " + loginDTO.username());

        return userRepository.findByUsername(loginDTO.username())
                .map(user -> {
                    // Validamos contraseña (simplificado: comparación directa de string)
                    if (user.password.equals(loginDTO.password())) {
                        System.out.println("Login exitoso para: " + loginDTO.username());
                        // Delegamos al TokenService la creación del JWT
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
