package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/widgets")
public interface WidgetsResource {
  @Path("/{widgetId}")
  @GET
  @Produces("application/json")
  Response getWidgets(@PathParam("widgetId") String widgetId);
}
