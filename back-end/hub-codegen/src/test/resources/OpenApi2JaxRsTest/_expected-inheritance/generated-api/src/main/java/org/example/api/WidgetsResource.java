package org.example.api;

import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/widgets")
public interface WidgetsResource {
  @Path("/{widgetId}")
  @GET
  @Produces("application/json")
  List<String> getWidgets(@PathParam("widgetId") String widgetId);
}
