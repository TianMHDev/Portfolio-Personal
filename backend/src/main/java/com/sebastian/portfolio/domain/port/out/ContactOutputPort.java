package com.sebastian.portfolio.domain.port.out;

import com.sebastian.portfolio.domain.model.ContactMessage;
import java.util.List;

/**
 * PUERTO DE SALIDA (Domain Layer)
 * Define las necesidades de la aplicación respecto a servicios externos (ej:
 * Base de Datos).
 * No sabe cómo se guardan los datos, solo qué se necesita guardar.
 */
public interface ContactOutputPort {
    /**
     * Guarda el mensaje de contacto.
     */
    ContactMessage save(ContactMessage message);

    /**
     * Recupera todos los mensajes de contacto.
     */
    List<ContactMessage> findAll();
}
