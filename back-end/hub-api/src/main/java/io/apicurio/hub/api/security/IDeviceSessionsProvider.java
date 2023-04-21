package io.apicurio.hub.api.security;

import io.apicurio.hub.api.beans.DeviceSession;

import java.io.IOException;
import java.util.Collection;

public interface IDeviceSessionsProvider {

    Collection<DeviceSession> listDeviceSessions() throws IOException;
}
