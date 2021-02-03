package org.example.api;

import java.io.InputStream;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/app")
public interface AppResource {
  /**
   * **Note:** Suspending a GitHub App installation is currently in beta and subject to change. Before you can suspend a GitHub App, the app owner must enable suspending installations for the app by opting-in to the beta. For more information, see "[Suspending a GitHub App installation](https://developer.github.com/apps/managing-github-apps/suspending-a-github-app-installation/)."
   *
   * Suspends a GitHub App on a user, organization, or business account, which blocks the app from accessing the account's resources. When a GitHub App is suspended, the app's access to the GitHub API or webhook events is blocked for that account.
   *
   * To suspend a GitHub App, you must be an account owner or have admin permissions in the repository or organization where the app is installed.
   *
   * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
   */
  @Path("/installations/{installation_id}/suspended")
  @PUT
  void apps_suspend_installation(@PathParam("installation_id") Integer installationId);

  /**
   * **Note:** Suspending a GitHub App installation is currently in beta and subject to change. Before you can suspend a GitHub App, the app owner must enable suspending installations for the app by opting-in to the beta. For more information, see "[Suspending a GitHub App installation](https://developer.github.com/apps/managing-github-apps/suspending-a-github-app-installation/)."
   *
   * Removes a GitHub App installation suspension.
   *
   * To unsuspend a GitHub App, you must be an account owner or have admin permissions in the repository or organization where the app is installed and suspended.
   *
   * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
   */
  @Path("/installations/{installation_id}/suspended")
  @DELETE
  void apps_unsuspend_installation(@PathParam("installation_id") Integer installationId);

  /**
   * Creates an installation access token that enables a GitHub App to make authenticated API requests for the app's installation on an organization or individual account. Installation tokens expire one hour from the time you create them. Using an expired token produces a status code of `401 - Unauthorized`, and requires creating a new installation token. By default the installation token has access to all repositories that the installation can access. To restrict the access to specific repositories, you can provide the `repository_ids` when creating the token. When you omit `repository_ids`, the response does not contain the `repositories` key.
   *
   * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
   */
  @Path("/installations/{installation_id}/access_tokens")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response apps_create_installation_access_token(
      @PathParam("installation_id") Integer installationId, InputStream data);

  /**
   * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
   *
   * The permissions the installation has are included under the `permissions` key.
   */
  @Path("/installations")
  @GET
  @Produces("application/json")
  Response apps_list_installations(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page, @QueryParam("since") String since,
      @QueryParam("outdated") String outdated);

  /**
   * Use this endpoint to complete the handshake necessary when implementing the [GitHub App Manifest flow](https://developer.github.com/apps/building-github-apps/creating-github-apps-from-a-manifest/). When you create a GitHub App with the manifest flow, you receive a temporary `code` used to retrieve the GitHub App's `id`, `pem` (private key), and `webhook_secret`.
   */
  @Path("-manifests/{code}/conversions")
  @POST
  @Produces("application/json")
  Response apps_create_from_manifest(@PathParam("code") String code);

  /**
   * Returns the GitHub App associated with the authentication credentials used. To see how many app installations are associated with this GitHub App, see the `installations_count` in the response. For more details about your app's installations, see the "[List installations for the authenticated app](https://developer.github.com/v3/apps/#list-installations-for-the-authenticated-app)" endpoint.
   *
   * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
   */
  @GET
  @Produces("application/json")
  Response apps_get_authenticated();

  /**
   * Enables an authenticated GitHub App to find an installation's information using the installation id. The installation's account type (`target_type`) will be either an organization or a user account, depending which account the repository belongs to.
   *
   * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
   */
  @Path("/installations/{installation_id}")
  @GET
  @Produces("application/json")
  Response apps_get_installation(@PathParam("installation_id") Integer installationId);

  /**
   * Uninstalls a GitHub App on a user, organization, or business account. If you prefer to temporarily suspend an app's access to your account's resources, then we recommend the "[Suspend an app installation](https://developer.github.com/v3/apps/#suspend-an-app-installation)" endpoint.
   *
   * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
   */
  @Path("/installations/{installation_id}")
  @DELETE
  void apps_delete_installation(@PathParam("installation_id") Integer installationId);
}
