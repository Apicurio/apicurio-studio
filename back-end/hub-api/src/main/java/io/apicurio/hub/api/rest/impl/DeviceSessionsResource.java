package io.apicurio.hub.api.rest.impl;

import io.apicurio.hub.api.beans.DeviceSession;
import io.apicurio.hub.api.metrics.IApiMetrics;
import io.apicurio.hub.api.rest.IDeviceSessionsResource;
import io.apicurio.hub.api.security.IDeviceSessionsProvider;
import io.apicurio.hub.api.security.KeycloakDeviceSessionsProvider;
import io.apicurio.hub.api.security.MockDeviceSessionsProvider;
import io.apicurio.hub.core.exceptions.ServerError;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.io.IOException;
import java.util.Collection;

@ApplicationScoped
public class DeviceSessionsResource implements IDeviceSessionsResource {
    private static Logger logger = LoggerFactory.getLogger(DeviceSessionsResource.class);

    @Inject
    private IApiMetrics metrics;
    @Inject
    private KeycloakDeviceSessionsProvider keycloakProvider;
    @Inject
    private MockDeviceSessionsProvider mockProvider;
    @Override
    public Collection<DeviceSession> listDeviceSessions(boolean mock) throws ServerError {
        metrics.apiCall("/device-sessions", "GET");
        logger.debug("Design sessions resource");
        try {
            return provider(mock).listDeviceSessions();
        } catch (IOException e) {
            logger.error("Failed when get device sessions", e);
            throw new ServerError(e);
        }
    }

    private IDeviceSessionsProvider provider(boolean mock) {
        return mock ? mockProvider : keycloakProvider;
    }
}
