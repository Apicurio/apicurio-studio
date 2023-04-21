package io.apicurio.hub.api.rest;

import io.apicurio.hub.api.beans.DeviceSession;
import io.apicurio.hub.core.beans.ApiTemplateKind;
import io.apicurio.hub.core.exceptions.ServerError;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import java.util.Collection;

@Path("device-sessions")
public interface IDeviceSessionsResource {

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    Collection<DeviceSession> listDeviceSessions(@QueryParam("mock") boolean mock) throws ServerError;
}
