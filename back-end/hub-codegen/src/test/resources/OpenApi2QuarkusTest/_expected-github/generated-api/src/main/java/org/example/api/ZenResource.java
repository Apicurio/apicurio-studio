package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/zen")
public interface ZenResource {
  /**
   * Get a random sentence from the Zen of GitHub
   */
  @GET
  @Produces("text/plain")
  String meta_get_zen();
}
