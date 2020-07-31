package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/rate_limit")
public interface RateResource {
  /**
   * **Note:** Accessing this endpoint does not count against your REST API rate limit.
   *
   * **Note:** The `rate` object is deprecated. If you're writing new API client code or updating existing code, you should use the `core` object instead of the `rate` object. The `core` object contains the same information that is present in the `rate` object.
   */
  @GET
  @Produces("application/json")
  Response rate_limit_get();
}
