package io.openapi.simple;

import java.io.InputStream;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/clients")
public interface Clients {
  /**
   * Register a Client and make it immediately available on the gateway.
   */
  @PUT
  void registerAClient(InputStream body);
}
