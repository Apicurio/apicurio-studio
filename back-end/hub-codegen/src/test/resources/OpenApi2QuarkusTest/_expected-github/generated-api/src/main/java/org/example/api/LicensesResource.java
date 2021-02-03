package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/licenses")
public interface LicensesResource {
  /**
   *
   */
  @Path("/{license}")
  @GET
  @Produces("application/json")
  Response licenses_get(@PathParam("license") String license);

  /**
   *
   */
  @GET
  @Produces("application/json")
  Response licenses_get_all_commonly_used(@QueryParam("featured") Boolean featured,
      @QueryParam("per_page") Integer perPage);
}
