package com.sebastian.portfolio.domain.port.out;

import com.sebastian.portfolio.domain.model.ContactMessage;
import java.util.List;

public interface ContactOutputPort {
    ContactMessage save(ContactMessage message);

    List<ContactMessage> findAll();
}
