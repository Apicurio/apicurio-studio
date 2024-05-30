package io.apicurio.studio.event;

import io.apicurio.studio.spi.storage.StudioStorage;
import io.apicurio.studio.spi.storage.model.OutboxEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;

@ApplicationScoped
public class EventSender {

    @Inject
    StudioStorage storage;

    public void onExportedEvent(@Observes OutboxEvent event) {
        OutboxEvent createdEvent = storage.createEvent(event);

        //Since log-based CDC is expected to be used, the events in the table can be immediately removed.
        storage.deleteEvent(createdEvent.getId());
    }
}
