package io.apicurio.studio.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.apicurio.common.apps.content.handle.ContentHandle;
import io.apicurio.studio.StudioAppException;
import io.apicurio.studio.rest.v1.beans.CreateDesignEvent;
import io.apicurio.studio.rest.v1.beans.DesignEvent;
import io.apicurio.studio.rest.v1.beans.DesignEventData;
import io.apicurio.studio.rest.v1.beans.DesignEventDataCreate;
import io.apicurio.studio.rest.v1.beans.DesignEventDataImport;
import io.apicurio.studio.rest.v1.beans.DesignEventDataRegister;
import io.apicurio.studio.rest.v1.beans.DesignEventDataUpdate;
import io.apicurio.studio.rest.v1.beans.DesignEventType;
import io.apicurio.studio.spi.storage.StudioStorage;
import io.apicurio.studio.spi.storage.model.DesignEventDto;

import java.util.Date;
import java.util.List;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import static io.apicurio.studio.common.SerDesObjectMapperHolder.getJSONMapper;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class DesignEventService {

    @Inject
    StudioStorage storage;

    ObjectMapper mapper = getJSONMapper();

    public DesignEvent createDesignEvent(@NotBlank String designId, @NotNull CreateDesignEvent createEvent) {
        var event = DesignEvent.builder()
                .designId(designId)
                .type(createEvent.getType())
                .data(createEvent.getData())
                .build();
        return convert(storage.createDesignEvent(convert(event)));
    }

    private DesignEventDto convert(DesignEvent event) {
        try {
            // TODO Validation
            var eventDto = DesignEventDto.builder()
                    .designId(event.getDesignId())
                    .type(event.getType().value());

            var content = switch (event.getType()) {
                case CREATE -> event.getData().getCreate();
                case IMPORT -> event.getData().getImport();
                case UPDATE -> event.getData().getUpdate();
                case REGISTER -> event.getData().getRegister();
            };

            var jsonContent = mapper.writeValueAsString(content);
            var rawContent = ContentHandle.create(jsonContent);

            eventDto.data(rawContent);
            return eventDto.build();

        } catch (JsonProcessingException e) {
            throw new StudioAppException("Could not serialize design event data", e);
        }
    }

    private DesignEvent convert(DesignEventDto eventDto) {
        try {
            var builder = DesignEvent.builder();

            var type = DesignEventType.fromValue(eventDto.getType());

            builder.designId(eventDto.getDesignId())
                    .on(Date.from(eventDto.getCreatedOn()))
                    .type(type);

            var dataBuilder = DesignEventData.builder();

            var rawContent = eventDto.getData().string();

            switch (type) {
                case CREATE -> dataBuilder.create(mapper.readValue(rawContent, DesignEventDataCreate.class));
                case IMPORT -> dataBuilder._import(mapper.readValue(rawContent, DesignEventDataImport.class));
                case UPDATE -> dataBuilder.update(mapper.readValue(rawContent, DesignEventDataUpdate.class));
                case REGISTER -> dataBuilder.register(mapper.readValue(rawContent, DesignEventDataRegister.class));
            }

            builder.data(dataBuilder.build());
            return builder.build();

        } catch (JsonProcessingException e) {
            throw new StudioAppException("Could not deserialize design event data", e);
        }
    }

    public List<DesignEvent> getAllDesignEvents(@NotBlank String designId) {
        return storage.getDesignEvents(designId).stream().map(this::convert).toList();
    }
}
