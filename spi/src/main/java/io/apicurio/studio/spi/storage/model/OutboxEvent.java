package io.apicurio.studio.spi.storage.model;

import com.fasterxml.jackson.databind.JsonNode;

public abstract class OutboxEvent {

    private final String id;
    private final String aggregateId;

    protected OutboxEvent(String id, String aggregateId) {
        this.id = id;
        this.aggregateId = aggregateId;
    }

    public String getId() {
        return this.id;
    }

    public String getAggregateId() {
        return aggregateId;
    }

    public String getAggregateType() {
        return "STUDIO";
    }

    public abstract JsonNode getPayload();

    public abstract String getType();
}
