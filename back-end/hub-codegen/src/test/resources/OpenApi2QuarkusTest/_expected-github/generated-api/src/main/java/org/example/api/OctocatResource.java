package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/octocat")
public interface OctocatResource {
  /**
   * Get the octocat as ASCII art
   */
  @GET
  @Produces("application/octocat-stream")
  String meta_get_octocat(@QueryParam("s") String s);
}
