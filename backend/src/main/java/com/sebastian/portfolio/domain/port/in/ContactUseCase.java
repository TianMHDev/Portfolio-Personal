package com.sebastian.portfolio.domain.port.in;

import com.sebastian.portfolio.application.dto.ContactDTO;
import java.util.List;

/**
 * PUERTO DE ENTRADA (Domain Layer)
 * Define las acciones que el mundo exterior puede realizar en nuestra
 * aplicación.
 * Es la interfaz que implementará el servicio de aplicación.
 */
public interface ContactUseCase {
    /**
     * Define la operación de enviar un mensaje.
     */
    ContactDTO sendMessage(ContactDTO contactDTO);

    /**
     * Define la operación de obtener todos los mensajes.
     */
    List<ContactDTO> getAllMessages();
}
