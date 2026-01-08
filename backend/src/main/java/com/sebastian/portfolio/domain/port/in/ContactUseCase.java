package com.sebastian.portfolio.domain.port.in;

import com.sebastian.portfolio.application.dto.ContactDTO;
import java.util.List;

public interface ContactUseCase {
    ContactDTO sendMessage(ContactDTO contactDTO);

    List<ContactDTO> getAllMessages();
}
