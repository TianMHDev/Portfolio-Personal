package com.sebastian.portfolio.infrastructure.security;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import java.util.HashSet;
import java.util.Arrays;

@ApplicationScoped
public class TokenService {
    public String generateToken(String username, String role) {
        System.out.println("Generando token para: " + username + " con rol: " + role);
        return Jwt.issuer("https://sebastian-portfolio.com")
                .upn(username)
                .groups(new HashSet<>(Arrays.asList(role)))
                .expiresIn(3600) // 1 hour
                .sign();
    }
}
