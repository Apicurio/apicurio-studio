package io.apicurio.studio.spi.storage.model;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.UUID;

public class DesignCreatedEvent implements OutboxEvent {

    private static final ObjectMapper mapper = new ObjectMapper();

    private final String id;
    private final String aggregateId;

    private final JsonNode order;

    private DesignCreatedEvent(String id, String aggregateId, JsonNode order) {
        this.id = id;
        this.aggregateId = aggregateId;
        this.order = order;
    }

    public static DesignCreatedEvent of(DesignMetadataDto designMetadataDto) {
        String id = UUID.randomUUID().toString();
        //TODO here we have to define the internal structure of the event, maybe use cloudevents?
        ObjectNode asJson = mapper.createObjectNode()
                .put("id", id)
                .put("designId", designMetadataDto.getId())
                .put("name", designMetadataDto.getName())
                .put("description", designMetadataDto.getDescription());

        return new DesignCreatedEvent(id, designMetadataDto.getId(), asJson);
    }

    @Override
    public String getId() {
        return this.id;
    }

    @Override
    public String getAggregateId() {
        return aggregateId;
    }

    @Override
    public String getAggregateType() {
        return "DESIGN";
    }

    @Override
    public String getType() {
        return "DESIGN_CREATED";
    }

    @Override
    public JsonNode getPayload() {
        return order;
    }
}
