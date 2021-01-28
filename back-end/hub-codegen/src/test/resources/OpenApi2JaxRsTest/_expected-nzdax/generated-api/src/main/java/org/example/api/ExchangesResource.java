package org.example.api;

import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import org.example.api.beans.Exchange;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/exchanges")
public interface ExchangesResource {
  /**
   * List all support exchanges by this server
   */
  @GET
  @Produces("application/json")
  List<Exchange> list();
}
