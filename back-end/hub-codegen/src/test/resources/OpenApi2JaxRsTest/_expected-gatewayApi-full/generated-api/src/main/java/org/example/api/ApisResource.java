package org.example.api;

import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import org.example.api.beans.API;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/apis")
public interface ApisResource {
  /**
   * Publish an API and make it immediately available on the gateway.
   */
  @PUT
  void publishAnAPI(API body);
}
