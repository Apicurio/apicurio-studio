package io.apicurio.hub.api.security;

import io.apicurio.hub.api.beans.DeviceSession;

import javax.enterprise.context.ApplicationScoped;
import java.util.Collection;

public class KeycloakDeviceSessionsProvider implements IDeviceSessionsProvider {
    @Override
    public Collection<DeviceSession> listDeviceSessions() {
        return null;
    }
}
