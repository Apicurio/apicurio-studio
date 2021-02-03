package org.example.api;

import java.io.InputStream;
import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.PATCH;
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
@Path("/user")
public interface UserResource {
  /**
   * When authenticating as a user, this endpoint will list all currently open repository invitations for that user.
   */
  @Path("/repository_invitations")
  @GET
  @Produces("application/json")
  Response repos_list_invitations_for_authenticated_user(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/repository_invitations/{invitation_id}")
  @DELETE
  void repos_decline_invitation(@PathParam("invitation_id") Integer invitationId);

  /**
   *
   */
  @Path("/repository_invitations/{invitation_id}")
  @PATCH
  void repos_accept_invitation(@PathParam("invitation_id") Integer invitationId);

  /**
   * Lists repositories that the authenticated user has explicit permission (`:read`, `:write`, or `:admin`) to access.
   *
   * The authenticated user has explicit permission to access repositories they own, repositories where they are a collaborator, and repositories that they can access through an organization membership.
   */
  @Path("/repos")
  @GET
  @Produces("application/json")
  Response repos_list_for_authenticated_user(@QueryParam("visibility") String visibility,
      @QueryParam("affiliation") String affiliation, @QueryParam("type") String type,
      @QueryParam("sort") String sort, @QueryParam("direction") String direction,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page,
      @QueryParam("since") String since, @QueryParam("before") String before);

  /**
   * Creates a new repository for the authenticated user.
   *
   * **OAuth scope requirements**
   *
   * When using [OAuth](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/), authorizations must include:
   *
   * *   `public_repo` scope or `repo` scope to create a public repository
   * *   `repo` scope to create a private repository
   */
  @Path("/repos")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_create_for_authenticated_user(InputStream data);

  /**
   * Fetches a single user migration. The response includes the `state` of the migration, which can be one of the following values:
   *
   * *   `pending` - the migration hasn't started yet.
   * *   `exporting` - the migration is in progress.
   * *   `exported` - the migration finished successfully.
   * *   `failed` - the migration failed.
   *
   * Once the migration has been `exported` you can [download the migration archive](https://developer.github.com/v3/migrations/users/#download-a-user-migration-archive).
   */
  @Path("/migrations/{migration_id}")
  @GET
  @Produces("application/json")
  Response migrations_get_status_for_authenticated_user(
      @PathParam("migration_id") Integer migrationId, @QueryParam("exclude") List<String> exclude);

  /**
   * Unlocks a repository. You can lock repositories when you [start a user migration](https://developer.github.com/v3/migrations/users/#start-a-user-migration). Once the migration is complete you can unlock each repository to begin using it again or [delete the repository](https://developer.github.com/v3/repos/#delete-a-repository) if you no longer need the source data. Returns a status of `404 Not Found` if the repository is not locked.
   */
  @Path("/migrations/{migration_id}/repos/{repo_name}/lock")
  @DELETE
  void migrations_unlock_repo_for_authenticated_user(@PathParam("migration_id") Integer migrationId,
      @PathParam("repo_name") String repoName);

  /**
   * Lists all the repositories for this user migration.
   */
  @Path("/migrations/{migration_id}/repositories")
  @GET
  @Produces("application/json")
  Response migrations_list_repos_for_user(@PathParam("migration_id") Integer migrationId,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Lists all migrations a user has started.
   */
  @Path("/migrations")
  @GET
  @Produces("application/json")
  Response migrations_list_for_authenticated_user(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Initiates the generation of a user migration archive.
   */
  @Path("/migrations")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response migrations_start_for_authenticated_user(InputStream data);

  /**
   * Fetches the URL to download the migration archive as a `tar.gz` file. Depending on the resources your repository uses, the migration archive can contain JSON files with data for these objects:
   *
   * *   attachments
   * *   bases
   * *   commit\_comments
   * *   issue\_comments
   * *   issue\_events
   * *   issues
   * *   milestones
   * *   organizations
   * *   projects
   * *   protected\_branches
   * *   pull\_request\_reviews
   * *   pull\_requests
   * *   releases
   * *   repositories
   * *   review\_comments
   * *   schema
   * *   users
   *
   * The archive will also contain an `attachments` directory that includes all attachment files uploaded to GitHub.com and a `repositories` directory that contains the repository's Git data.
   */
  @Path("/migrations/{migration_id}/archive")
  @GET
  void migrations_get_archive_for_authenticated_user(
      @PathParam("migration_id") Integer migrationId);

  /**
   * Deletes a previous migration archive. Downloadable migration archives are automatically deleted after seven days. Migration metadata, which is returned in the [List user migrations](https://developer.github.com/v3/migrations/users/#list-user-migrations) and [Get a user migration status](https://developer.github.com/v3/migrations/users/#get-a-user-migration-status) endpoints, will continue to be available even after an archive is deleted.
   */
  @Path("/migrations/{migration_id}/archive")
  @DELETE
  void migrations_delete_archive_for_authenticated_user(
      @PathParam("migration_id") Integer migrationId);

  /**
   *
   */
  @Path("/starred/{owner}/{repo}")
  @GET
  void activity_check_repo_is_starred_by_authenticated_user(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Note that you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
   */
  @Path("/starred/{owner}/{repo}")
  @PUT
  void activity_star_repo_for_authenticated_user(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   *
   */
  @Path("/starred/{owner}/{repo}")
  @DELETE
  void activity_unstar_repo_for_authenticated_user(@PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Lists repositories the authenticated user is watching.
   */
  @Path("/subscriptions")
  @GET
  @Produces("application/json")
  Response activity_list_watched_repos_for_authenticated_user(
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Lists repositories the authenticated user has starred.
   *
   * You can also find out _when_ stars were created by passing the following custom [media type](https://developer.github.com/v3/media/) via the `Accept` header:
   */
  @Path("/starred")
  @GET
  @Produces({"application/json", "application/vnd.github.v3.star+json"})
  Response activity_list_repos_starred_by_authenticated_user(@QueryParam("sort") String sort,
      @QueryParam("direction") String direction, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/projects")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response projects_create_for_authenticated_user(InputStream data);

  /**
   *
   */
  @Path("/memberships/orgs")
  @GET
  @Produces("application/json")
  Response orgs_list_memberships_for_authenticated_user(@QueryParam("state") String state,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/memberships/orgs/{org}")
  @GET
  @Produces("application/json")
  Response orgs_get_membership_for_authenticated_user(@PathParam("org") String org);

  /**
   *
   */
  @Path("/memberships/orgs/{org}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response orgs_update_membership_for_authenticated_user(@PathParam("org") String org,
      InputStream data);

  /**
   * List organizations for the authenticated user.
   *
   * **OAuth scope requirements**
   *
   * This only lists organizations that your authorization allows you to operate on in some way (e.g., you can list teams with `read:org` scope, you can publicize your organization membership with `user` scope, etc.). Therefore, this API requires at least `user` or `read:org` scope. OAuth requests with insufficient scope receive a `403 Forbidden` response.
   */
  @Path("/orgs")
  @GET
  @Produces("application/json")
  Response orgs_list_for_authenticated_user(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Lists the people following the authenticated user.
   */
  @Path("/followers")
  @GET
  @Produces("application/json")
  Response users_list_followers_for_authenticated_user(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Lists the people who the authenticated user follows.
   */
  @Path("/following")
  @GET
  @Produces("application/json")
  Response users_list_followed_by_authenticated(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Lists the current user's GPG keys. Requires that you are authenticated via Basic Auth or via OAuth with at least `read:gpg_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   */
  @Path("/gpg_keys")
  @GET
  @Produces("application/json")
  Response users_list_gpg_keys_for_authenticated(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Adds a GPG key to the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth, or OAuth with at least `write:gpg_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   */
  @Path("/gpg_keys")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response users_create_gpg_key_for_authenticated(InputStream data);

  /**
   * View extended details for a single public SSH key. Requires that you are authenticated via Basic Auth or via OAuth with at least `read:public_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   */
  @Path("/keys/{key_id}")
  @GET
  @Produces("application/json")
  Response users_get_public_ssh_key_for_authenticated(@PathParam("key_id") Integer keyId);

  /**
   * Removes a public SSH key from the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth or via OAuth with at least `admin:public_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   */
  @Path("/keys/{key_id}")
  @DELETE
  void users_delete_public_ssh_key_for_authenticated(@PathParam("key_id") Integer keyId);

  /**
   * View extended details for a single GPG key. Requires that you are authenticated via Basic Auth or via OAuth with at least `read:gpg_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   */
  @Path("/gpg_keys/{gpg_key_id}")
  @GET
  @Produces("application/json")
  Response users_get_gpg_key_for_authenticated(@PathParam("gpg_key_id") Integer gpgKeyId);

  /**
   * Removes a GPG key from the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth or via OAuth with at least `admin:gpg_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   */
  @Path("/gpg_keys/{gpg_key_id}")
  @DELETE
  void users_delete_gpg_key_for_authenticated(@PathParam("gpg_key_id") Integer gpgKeyId);

  /**
   * Lists all of your email addresses, and specifies which one is visible to the public. This endpoint is accessible with the `user:email` scope.
   */
  @Path("/emails")
  @GET
  @Produces("application/json")
  Response users_list_emails_for_authenticated(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * This endpoint is accessible with the `user` scope.
   */
  @Path("/emails")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response users_add_email_for_authenticated(InputStream data);

  /**
   * This endpoint is accessible with the `user` scope.
   */
  @Path("/emails")
  @DELETE
  @Consumes("application/json")
  void users_delete_email_for_authenticated(InputStream data);

  /**
   *
   */
  @Path("/following/{username}")
  @GET
  void users_check_person_is_followed_by_authenticated(@PathParam("username") String username);

  /**
   * Note that you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
   *
   * Following a user requires the user to be logged in and authenticated with basic auth or OAuth with the `user:follow` scope.
   */
  @Path("/following/{username}")
  @PUT
  void users_follow(@PathParam("username") String username);

  /**
   * Unfollowing a user requires the user to be logged in and authenticated with basic auth or OAuth with the `user:follow` scope.
   */
  @Path("/following/{username}")
  @DELETE
  void users_unfollow(@PathParam("username") String username);

  /**
   * If the user is blocked:
   *
   * If the user is not blocked:
   */
  @Path("/blocks/{username}")
  @GET
  void users_check_blocked(@PathParam("username") String username);

  /**
   *
   */
  @Path("/blocks/{username}")
  @PUT
  void users_block(@PathParam("username") String username);

  /**
   *
   */
  @Path("/blocks/{username}")
  @DELETE
  void users_unblock(@PathParam("username") String username);

  /**
   * Lists your publicly visible email address, which you can set with the [Set primary email visibility for the authenticated user](https://developer.github.com/v3/users/emails/#set-primary-email-visibility-for-the-authenticated-user) endpoint. This endpoint is accessible with the `user:email` scope.
   */
  @Path("/public_emails")
  @GET
  @Produces("application/json")
  Response users_list_public_emails_for_authenticated(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * List the users you've blocked on your personal account.
   */
  @Path("/blocks")
  @GET
  @Produces("application/json")
  Response users_list_blocked_by_authenticated();

  /**
   * Lists the public SSH keys for the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth or via OAuth with at least `read:public_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   */
  @Path("/keys")
  @GET
  @Produces("application/json")
  Response users_list_public_ssh_keys_for_authenticated(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Adds a public SSH key to the authenticated user's GitHub account. Requires that you are authenticated via Basic Auth, or OAuth with at least `write:public_key` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   */
  @Path("/keys")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response users_create_public_ssh_key_for_authenticated(InputStream data);

  /**
   * If the authenticated user is authenticated through basic authentication or OAuth with the `user` scope, then the response lists public and private profile information.
   *
   * If the authenticated user is authenticated through OAuth without the `user` scope, then the response lists only public profile information.
   */
  @GET
  @Produces("application/json")
  Response users_get_authenticated();

  /**
   * **Note:** If your email is set to private and you send an `email` parameter as part of this request to update your profile, your privacy settings are still enforced: the email address will not be displayed on your public profile or via the API.
   */
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response users_update_authenticated(InputStream data);

  /**
   * Sets the visibility for your primary email addresses.
   */
  @Path("/email/visibility")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response users_set_primary_email_visibility_for_authenticated(InputStream data);

  /**
   * List all of the teams across all of the organizations to which the authenticated user belongs. This method requires `user`, `repo`, or `read:org` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/) when authenticating via [OAuth](https://developer.github.com/apps/building-oauth-apps/).
   */
  @Path("/teams")
  @GET
  @Produces("application/json")
  Response teams_list_for_authenticated_user(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * List issues across owned and member repositories assigned to the authenticated user.
   *
   * **Note**: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request. For this
   * reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by
   * the `pull_request` key. Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull
   * request id, use the "[List pull requests](https://developer.github.com/v3/pulls/#list-pull-requests)" endpoint.
   */
  @Path("/issues")
  @GET
  @Produces("application/json")
  Response issues_list_for_authenticated_user(@QueryParam("filter") String filter,
      @QueryParam("state") String state, @QueryParam("labels") String labels,
      @QueryParam("sort") String sort, @QueryParam("direction") String direction,
      @QueryParam("since") String since, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Lists installations of your GitHub App that the authenticated user has explicit permission (`:read`, `:write`, or `:admin`) to access.
   *
   * You must use a [user-to-server OAuth access token](https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/#identifying-users-on-your-site), created for a user who has authorized your GitHub App, to access this endpoint.
   *
   * The authenticated user has explicit permission to access repositories they own, repositories where they are a collaborator, and repositories that they can access through an organization membership.
   *
   * You can find the permissions for the installation under the `permissions` key.
   */
  @Path("/installations")
  @GET
  @Produces("application/json")
  Response apps_list_installations_for_authenticated_user(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * List repositories that the authenticated user has explicit permission (`:read`, `:write`, or `:admin`) to access for an installation.
   *
   * The authenticated user has explicit permission to access repositories they own, repositories where they are a collaborator, and repositories that they can access through an organization membership.
   *
   * You must use a [user-to-server OAuth access token](https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/#identifying-users-on-your-site), created for a user who has authorized your GitHub App, to access this endpoint.
   *
   * The access the user has to each repository is included in the hash under the `permissions` key.
   */
  @Path("/installations/{installation_id}/repositories")
  @GET
  @Produces("application/json")
  Response apps_list_installation_repos_for_authenticated_user(
      @PathParam("installation_id") Integer installationId, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Lists the active subscriptions for the authenticated user. You must use a [user-to-server OAuth access token](https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/#identifying-users-on-your-site), created for a user who has authorized your GitHub App, to access this endpoint. . OAuth Apps must authenticate using an [OAuth token](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/).
   */
  @Path("/marketplace_purchases")
  @GET
  @Produces("application/json")
  Response apps_list_subscriptions_for_authenticated_user(@QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Add a single repository to an installation. The authenticated user must have admin access to the repository.
   *
   * You must use a personal access token (which you can create via the [command line](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) or the [OAuth Authorizations API](https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization)) or [Basic Authentication](https://developer.github.com/v3/auth/#basic-authentication) to access this endpoint.
   */
  @Path("/installations/{installation_id}/repositories/{repository_id}")
  @PUT
  void apps_add_repo_to_installation(@PathParam("installation_id") Integer installationId,
      @PathParam("repository_id") Integer repositoryId);

  /**
   * Remove a single repository from an installation. The authenticated user must have admin access to the repository.
   *
   * You must use a personal access token (which you can create via the [command line](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/) or the [OAuth Authorizations API](https://developer.github.com/v3/oauth_authorizations/#create-a-new-authorization)) or [Basic Authentication](https://developer.github.com/v3/auth/#basic-authentication) to access this endpoint.
   */
  @Path("/installations/{installation_id}/repositories/{repository_id}")
  @DELETE
  void apps_remove_repo_from_installation(@PathParam("installation_id") Integer installationId,
      @PathParam("repository_id") Integer repositoryId);

  /**
   * Lists the active subscriptions for the authenticated user. You must use a [user-to-server OAuth access token](https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/#identifying-users-on-your-site), created for a user who has authorized your GitHub App, to access this endpoint. . OAuth Apps must authenticate using an [OAuth token](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/).
   */
  @Path("/marketplace_purchases/stubbed")
  @GET
  @Produces("application/json")
  Response apps_list_subscriptions_for_authenticated_user_stubbed(
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);
}
