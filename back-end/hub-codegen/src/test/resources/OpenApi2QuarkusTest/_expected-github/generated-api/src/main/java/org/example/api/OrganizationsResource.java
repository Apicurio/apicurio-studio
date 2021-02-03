package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/organizations")
public interface OrganizationsResource {
  /**
   * Lists all organizations, in the order that they were created on GitHub.
   *
   * **Note:** Pagination is powered exclusively by the `since` parameter. Use the [Link header](https://developer.github.com/v3/#link-header) to get the URL for the next page of organizations.
   */
  @GET
  @Produces("application/json")
  Response orgs_list(@QueryParam("since") String since, @QueryParam("per_page") Integer perPage);
}
