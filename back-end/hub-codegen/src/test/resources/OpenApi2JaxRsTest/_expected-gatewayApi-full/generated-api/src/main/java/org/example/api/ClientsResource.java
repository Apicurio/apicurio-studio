package org.example.api;

import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import org.example.api.beans.Client;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/clients")
public interface ClientsResource {
  /**
   * Register a Client and make it immediately available on the gateway.
   */
  @PUT
  void registerAClient(Client body);
}
