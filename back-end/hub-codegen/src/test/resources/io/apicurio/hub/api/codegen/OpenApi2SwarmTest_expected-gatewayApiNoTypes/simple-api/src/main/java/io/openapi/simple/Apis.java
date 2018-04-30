package io.openapi.simple;

import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.core.Request;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/apis")
public interface Apis {
  /**
   * Publish an API and make it immediately available on the gateway.
   */
  @PUT
  void publishAnAPI(Request body);
}
