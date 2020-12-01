package io.apicurio.hub.core.integrations;

/**
 * @author Fabian Martinez
 */
public interface EventSink {

    String name();

    boolean isConfigured();

    void handle(ApicurioEventType type, byte[] data);

}

