package org.example.api;

import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/installation")
public interface InstallationResource {
  /**
   * List repositories that an app installation can access.
   *
   * You must use an [installation access token](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-an-installation) to access this endpoint.
   */
  @Path("/repositories")
  @GET
  @Produces("application/json")
  Response apps_list_repos_accessible_to_installation(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Revokes the installation token you're using to authenticate as an installation and access this endpoint.
   *
   * Once an installation token is revoked, the token is invalidated and cannot be used. Other endpoints that require the revoked installation token must have a new installation token to work. You can create a new token using the "[Create an installation access token for an app](https://developer.github.com/v3/apps/#create-an-installation-access-token-for-an-app)" endpoint.
   *
   * You must use an [installation access token](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-an-installation) to access this endpoint.
   */
  @Path("/token")
  @DELETE
  void apps_revoke_installation_access_token();
}
