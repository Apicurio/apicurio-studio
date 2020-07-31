package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/emojis")
public interface EmojisResource {
  /**
   * Lists all the emojis available to use on GitHub.
   */
  @GET
  @Produces("application/json")
  Response emojis_get();
}
