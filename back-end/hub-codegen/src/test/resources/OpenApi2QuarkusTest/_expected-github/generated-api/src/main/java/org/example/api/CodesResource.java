package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/codes_of_conduct")
public interface CodesResource {
  /**
   *
   */
  @Path("/{key}")
  @GET
  @Produces("application/json")
  Response codes_of_conduct_get_conduct_code(@PathParam("key") String key);

  /**
   *
   */
  @GET
  @Produces("application/json")
  Response codes_of_conduct_get_all_codes_of_conduct();
}
