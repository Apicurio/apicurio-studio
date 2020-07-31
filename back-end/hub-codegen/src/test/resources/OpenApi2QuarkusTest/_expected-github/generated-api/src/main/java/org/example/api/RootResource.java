package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/")
public interface RootResource {
  /**
   * Get Hypermedia links to resources accessible in GitHub's REST API
   */
  @GET
  @Produces("application/json")
  Response meta_root();
}
