package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/events")
public interface EventsResource {
  /**
   * We delay the public events feed by five minutes, which means the most recent event returned by the public events API actually occurred at least five minutes ago.
   */
  @GET
  @Produces("application/json")
  Response activity_list_public_events(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);
}
