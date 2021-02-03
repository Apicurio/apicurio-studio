package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/issues")
public interface IssuesResource {
  /**
   * List issues assigned to the authenticated user across all visible repositories including owned repositories, member
   * repositories, and organization repositories. You can use the `filter` query parameter to fetch issues that are not
   * necessarily assigned to you. See the [Parameters table](https://developer.github.com/v3/issues/#parameters) for more
   * information.
   *
   *
   * **Note**: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request. For this
   * reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by
   * the `pull_request` key. Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull
   * request id, use the "[List pull requests](https://developer.github.com/v3/pulls/#list-pull-requests)" endpoint.
   */
  @GET
  @Produces("application/json")
  Response issues_list(@QueryParam("filter") String filter, @QueryParam("state") String state,
      @QueryParam("labels") String labels, @QueryParam("sort") String sort,
      @QueryParam("direction") String direction, @QueryParam("since") String since,
      @QueryParam("collab") Boolean collab, @QueryParam("orgs") Boolean orgs,
      @QueryParam("owned") Boolean owned, @QueryParam("pulls") Boolean pulls,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);
}
