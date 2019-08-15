package io.openapi.simple;

import java.io.InputStream;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/apis")
public interface Apis {
  /**
   * Publish an API and make it immediately available on the gateway.
   */
  @PUT
  void publishAnAPI(InputStream body);
}
