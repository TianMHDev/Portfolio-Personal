package com.sebastian.portfolio.infrastructure.security;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.HashSet;
import java.util.Arrays;

/**
 * SERVICIO DE INFRAESTRUCTURA - SEGURIDAD
 * Encargado de la generación de JSON Web Tokens (JWT).
 * Utiliza SmallRye JWT para construir el token firmado.
 */
@ApplicationScoped
public class TokenService {

    /**
     * Genera un token JWT para un usuario específico.
     * 
     * @param username El nombre de usuario (se guarda como 'upn')
     * @param role     El rol del usuario (se guarda como 'groups')
     * @return String con el token firmado
     */
    public String generateToken(String username, String role) {
        System.out.println("Generando token para: " + username + " con rol: " + role);
        return Jwt.issuer("https://sebastian-portfolio.com")
                .upn(username)
                .groups(new HashSet<>(Arrays.asList(role)))
                .expiresIn(3600) // El token expira en 1 hora
                .sign();
    }
}
