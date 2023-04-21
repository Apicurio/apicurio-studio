package io.apicurio.hub.api.rest.impl;

import io.apicurio.hub.api.beans.DeviceSession;
import io.apicurio.hub.api.metrics.IApiMetrics;
import io.apicurio.hub.api.rest.IDeviceSessionsResource;
import io.apicurio.hub.api.security.IDeviceSessionsProvider;
import io.apicurio.hub.api.security.ISecurityContext;
import io.apicurio.hub.core.exceptions.ServerError;
import io.apicurio.studio.shared.beans.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.enterprise.context.ApplicationScoped;
import javax.inject.Inject;
import java.util.Collection;

@ApplicationScoped
public class DeviceSessionsResource implements IDeviceSessionsResource {
    private static Logger logger = LoggerFactory.getLogger(DeviceSessionsResource.class);

    @Inject
    private ISecurityContext security;
    @Inject
    private IApiMetrics metrics;
    @Inject
    private IDeviceSessionsProvider deviceSessionsProvider;
    @Override
    public Collection<DeviceSession> listDeviceSessions() throws ServerError {
        metrics.apiCall("/device-sessions", "GET");
        logger.debug("Design sessions resource");
        User user = this.security.getCurrentUser();
        logger.debug(user.getLogin());
        return deviceSessionsProvider.listDeviceSessions();
    }
}
