package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/networks")
public interface NetworksResource {
  /**
   *
   */
  @Path("/{owner}/{repo}/events")
  @GET
  @Produces("application/json")
  Response activity_list_public_events_for_repo_network(@PathParam("owner") String owner,
      @PathParam("repo") String repo, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);
}
