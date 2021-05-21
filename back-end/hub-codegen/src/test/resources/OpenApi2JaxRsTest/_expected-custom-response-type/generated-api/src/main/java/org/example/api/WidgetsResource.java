package org.example.api;

import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import org.example.api.beans.Widget;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/widgets")
public interface WidgetsResource {
  /**
   * Gets a list of all `Widget` entities.
   */
  @GET
  @Produces("application/json")
  List<Widget> getWidgets();

  /**
   * Creates a new instance of a `Widget`.
   */
  @POST
  @Consumes("application/json")
  void createWidget(Widget data);

  /**
   * Gets the details of a single instance of a `Widget`.
   */
  @Path("/{widgetId}")
  @GET
  @Produces("application/json")
  Response getWidget(@PathParam("widgetId") String widgetId);

  /**
   * Updates an existing `Widget`.
   */
  @Path("/{widgetId}")
  @PUT
  @Consumes("application/json")
  void updateWidget(@PathParam("widgetId") String widgetId, Widget data);

  /**
   * Deletes an existing `Widget`.
   */
  @Path("/{widgetId}")
  @DELETE
  void deleteWidget(@PathParam("widgetId") String widgetId);
}
