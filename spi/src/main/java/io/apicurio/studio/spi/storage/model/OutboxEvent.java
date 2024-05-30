package io.apicurio.studio.spi.storage.model;

import com.fasterxml.jackson.databind.JsonNode;

public interface OutboxEvent {
    String getId();
    String getAggregateId();
    String getAggregateType();
    JsonNode getPayload();
    String getType();
}
