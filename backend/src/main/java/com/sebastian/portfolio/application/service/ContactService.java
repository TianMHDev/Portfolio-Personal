package com.sebastian.portfolio.application.service;

import com.sebastian.portfolio.domain.port.in.ContactUseCase;
import com.sebastian.portfolio.domain.port.out.ContactOutputPort;
import com.sebastian.portfolio.application.dto.ContactDTO;
import com.sebastian.portfolio.application.mapper.ContactMapper;
import com.sebastian.portfolio.domain.model.ContactMessage;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ContactService implements ContactUseCase {
    private final ContactOutputPort contactRepository;
    private final ContactMapper contactMapper;

    @ConfigProperty(name = "resend.api.key")
    String resendApiKey;

    public ContactService(ContactOutputPort contactRepository, ContactMapper contactMapper) {
        this.contactRepository = contactRepository;
        this.contactMapper = contactMapper;
    }

    @Override
    @Transactional
    public ContactDTO sendMessage(ContactDTO contactDTO) {
        ContactMessage message = contactMapper.toDomain(contactDTO);
        message.setCreatedAt(LocalDateTime.now());
        ContactDTO saved = contactMapper.toDTO(contactRepository.save(message));

        // Enviar email vía Resend API (HTTP POST) para evitar bloqueos SMTP
        sendEmailViaResend(saved);

        return saved;
    }

    private void sendEmailViaResend(ContactDTO contact) {
        try {
            HttpClient client = HttpClient.newHttpClient();

            String jsonBody = String.format(
                    "{\"from\": \"onboarding@resend.dev\", \"to\": \"sebastianmarriagahoyos@gmail.com\", \"subject\": \"🔔 Nuevo contacto: %s\", \"html\": \"<p><strong>De:</strong> %s (%s)</p><p><strong>Mensaje:</strong></p><div style='padding:10px; border-left:4px solid #bc13fe; background:#f4f4f4;'>%s</div>\"}",
                    contact.name(), contact.name(), contact.email(), contact.message().replace("\n", "<br/>"));

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.resend.com/emails"))
                    .header("Authorization", "Bearer " + resendApiKey)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> {
                        if (response.statusCode() == 200 || response.statusCode() == 201) {
                            System.out.println("[RESEND] 🟢 Email enviado con éxito.");
                        } else {
                            System.err.println("[RESEND] 🔴 Error API Resend: " + response.body());
                        }
                    });

        } catch (Exception e) {
            System.err.println("[RESEND] 🔴 Error crítico al conectar con la API: " + e.getMessage());
        }
    }

    @Override
    public List<ContactDTO> getAllMessages() {
        return contactRepository.findAll().stream()
                .map(contactMapper::toDTO)
                .collect(Collectors.toList());
    }
}
