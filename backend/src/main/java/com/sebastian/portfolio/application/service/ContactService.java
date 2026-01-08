package com.sebastian.portfolio.application.service;

import com.sebastian.portfolio.domain.port.in.ContactUseCase;
import com.sebastian.portfolio.domain.port.out.ContactOutputPort;
import com.sebastian.portfolio.application.dto.ContactDTO;
import com.sebastian.portfolio.application.mapper.ContactMapper;
import com.sebastian.portfolio.domain.model.ContactMessage;
import io.quarkus.mailer.Mail;
import io.quarkus.mailer.reactive.ReactiveMailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ContactService implements ContactUseCase {
    private final ContactOutputPort contactRepository;
    private final ContactMapper contactMapper;
    private final ReactiveMailer mailer;

    public ContactService(ContactOutputPort contactRepository, ContactMapper contactMapper, ReactiveMailer mailer) {
        this.contactRepository = contactRepository;
        this.contactMapper = contactMapper;
        this.mailer = mailer;
    }

    @Override
    @Transactional
    public ContactDTO sendMessage(ContactDTO contactDTO) {
        // Mapear DTO a Dominio y establecer fecha de creación
        ContactMessage message = contactMapper.toDomain(contactDTO);
        message.setCreatedAt(LocalDateTime.now());

        // Guardar mensaje en base de datos
        ContactDTO saved = contactMapper.toDTO(contactRepository.save(message));

        // Notificación por correo electrónico (Asíncrona)
        try {
            String adminEmail = "sebastianmarriagahoyos@gmail.com";
            String subject = "🔔 Portafolio: Nuevo mensaje de " + saved.name();

            String htmlContent = String.format(
                    "<div style='font-family: sans-serif; border: 2px solid #00f3ff; padding: 20px; background: #050a10; color: #fff;'>"
                            +
                            "<h1 style='color: #00f3ff; font-size: 20px;'>🚀 Portafolio: Nuevo Contacto</h1>" +
                            "<p style='margin: 10px 0;'><strong>Remitente:</strong> %s</p>" +
                            "<p style='margin: 10px 0;'><strong>Correo:</strong> %s</p>" +
                            "<div style='margin-top: 20px; padding: 15px; background: #0a111c; border-left: 4px solid #bc13fe; font-style: italic;'>"
                            +
                            "%s" +
                            "</div>" +
                            "</div>",
                    saved.name(), saved.email(), saved.message().replace("\n", "<br/>"));

            Mail mail = Mail.withHtml(adminEmail, subject, htmlContent)
                    .setFrom(adminEmail);

            mailer.send(mail).subscribe().with(
                    success -> System.out.println("[MAILER] 🟢 Notificación enviada correctamente."),
                    failure -> System.err.println("[MAILER] 🔴 Error de envío SMTP: " + failure.getMessage()));
        } catch (Exception e) {
            System.err.println("[MAILER] 🔴 Error crítico: " + e.getMessage());
        }

        return saved;
    }

    @Override
    public List<ContactDTO> getAllMessages() {
        return contactRepository.findAll().stream()
                .map(contactMapper::toDTO)
                .collect(Collectors.toList());
    }
}
