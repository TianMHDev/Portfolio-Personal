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

            String htmlContent = String.format(
                    "<div style='background-color: #050a10; padding: 40px; font-family: sans-serif; color: #ffffff; border: 1px solid #1a2233;'>"
                            +
                            "  <div style='max-width: 600px; margin: 0 auto;'>" +
                            "    <div style='border-bottom: 2px solid #00f3ff; padding-bottom: 10px; margin-bottom: 30px;'>"
                            +
                            "      <h1 style='color: #00f3ff; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; margin: 0;'>SYSTEM_NOTIFICATION</h1>"
                            +
                            "      <p style='color: #bc13fe; font-size: 10px; margin: 5px 0 0 0; font-family: monospace;'>[ INCOMING_DATA_PACKET ]</p>"
                            +
                            "    </div>" +
                            "    <div style='background: #0a111c; border-left: 4px solid #00f3ff; padding: 25px; margin-bottom: 20px; box-shadow: 0 0 20px rgba(0, 243, 255, 0.05);'>"
                            +
                            "      <p style='margin: 0 0 10px 0; font-size: 12px; color: #8892b0; text-transform: uppercase;'>IDENTIDAD_USER</p>"
                            +
                            "      <h2 style='margin: 0; font-size: 20px; color: #e0f7fa;'>%s</h2>" +
                            "      <p style='margin: 5px 0 0 0; font-size: 14px; color: #00f3ff;'>%s</p>" +
                            "    </div>" +
                            "    <div style='background: #0a111c; border-left: 4px solid #bc13fe; padding: 25px; min-height: 100px;'>"
                            +
                            "      <p style='margin: 0 0 10px 0; font-size: 12px; color: #8892b0; text-transform: uppercase;'>MENSAJE_CIFRADO</p>"
                            +
                            "      <div style='color: #e0f7fa; line-height: 1.6; font-size: 15px;'>%s</div>" +
                            "    </div>" +
                            "    <div style='margin-top: 30px; text-align: center; border-top: 1px solid #1a2233; padding-top: 20px;'>"
                            +
                            "      <p style='font-size: 10px; color: #4b5563; font-family: monospace;'>© 2026 TIAN_MARRIAGA | BACKEND_DEVELOPER | SYSTEM_V1.5.0</p>"
                            +
                            "    </div>" +
                            "  </div>" +
                            "</div>",
                    contact.name(), contact.email(), contact.message().replace("\n", "<br/>"));

            String jsonBody = String.format(
                    "{\"from\": \"onboarding@resend.dev\", \"to\": \"hado6529@gmail.com\", \"subject\": \"🚀 NUEVO_CONTACTO: %s\", \"html\": \"%s\"}",
                    contact.name(), htmlContent.replace("\"", "\\\""));

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
