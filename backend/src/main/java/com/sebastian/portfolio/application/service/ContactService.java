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
                    "<div style='background-color: #02040a; padding: 20px; font-family: \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif; color: #ffffff;'>"
                            +
                            "  <table align='center' border='0' cellpadding='0' cellspacing='0' width='100%%' style='max-width: 600px; background-color: #050a10; border: 1px solid #1a2233; border-collapse: collapse;'>"
                            +
                            "    <tr>" +
                            "      <td style='padding: 30px 40px; border-bottom: 2px solid #00f3ff; background: linear-gradient(90deg, #050a10 0%%, #0a111c 100%%);'>"
                            +
                            "        <h1 style='color: #00f3ff; font-size: 18px; text-transform: uppercase; letter-spacing: 4px; margin: 0; font-weight: 900;'>SYSTEM_DECRYPT</h1>"
                            +
                            "        <div style='height: 2px; width: 40px; background-color: #bc13fe; margin-top: 8px;'></div>"
                            +
                            "      </td>" +
                            "    </tr>" +
                            "    <tr>" +
                            "      <td style='padding: 40px;'>" +
                            "        <p style='color: #8892b0; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 25px;'>[ CANAL_DE_ENTRADA_ACTIVO ]</p>"
                            +
                            "        <table width='100%%' style='margin-bottom: 30px;'>" +
                            "          <tr>" +
                            "            <td style='padding: 20px; background-color: #0a111c; border-left: 3px solid #00f3ff;'>"
                            +
                            "              <div style='color: #00f3ff; font-size: 10px; text-transform: uppercase; margin-bottom: 5px; font-weight: bold;'>ORIGEN_DATOS</div>"
                            +
                            "              <div style='font-size: 20px; color: #ffffff; font-weight: bold;'>%s</div>" +
                            "              <div style='font-size: 13px; color: #8892b0; margin-top: 4px;'>%s</div>" +
                            "            </td>" +
                            "          </tr>" +
                            "        </table>" +
                            "        <div style='color: #bc13fe; font-size: 10px; text-transform: uppercase; margin-bottom: 10px; font-weight: bold;'>CONTENIDO_DEL_PAQUETE</div>"
                            +
                            "        <div style='padding: 25px; background-color: #0d1624; border: 1px solid #1a2233; color: #e0f7fa; line-height: 1.8; font-size: 15px; border-radius: 4px;'>"
                            +
                            "          %s" +
                            "        </div>" +
                            "        <table width='100%%' style='margin-top: 30px;'>" +
                            "          <tr>" +
                            "            <td>" +
                            "              <div style='display: inline-block; padding: 8px 15px; background-color: rgba(0, 243, 255, 0.1); border: 1px solid #00f3ff; color: #00f3ff; font-size: 10px; font-weight: bold; border-radius: 2px;'>STATUS: ANALIZADO</div>"
                            +
                            "            </td>" +
                            "          </tr>" +
                            "        </table>" +
                            "      </td>" +
                            "    </tr>" +
                            "    <tr>" +
                            "      <td style='padding: 20px 40px; background-color: #02040a; border-top: 1px solid #1a2233; text-align: center;'>"
                            +
                            "        <p style='font-size: 10px; color: #4b5563; font-family: monospace; margin: 0;'>PROTOCOLO_DE_COMUNICACIÓN // V1.5.0 // TIAN_RESOURCES</p>"
                            +
                            "      </td>" +
                            "    </tr>" +
                            "  </table>" +
                            "</div>",
                    contact.name(), contact.email(), contact.message().replace("\n", "<br/>"));

            String jsonBody = String.format(
                    "{\"from\": \"onboarding@resend.dev\", \"to\": \"sebastianmarriagahoyos@gmail.com\", \"subject\": \"🚀 NUEVO_DATOS: %s\", \"html\": \"%s\"}",
                    contact.name(), htmlContent.replace("\"", "\\\"").replace("\n", " "));

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
