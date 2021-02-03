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
@Path("/users")
public interface UsersResource {
  /**
   * Lists public repositories for the specified user.
   */
  @Path("/{username}/repos")
  @GET
  @Produces("application/json")
  Response repos_list_for_user(@PathParam("username") String username,
      @QueryParam("type") String type, @QueryParam("sort") String sort,
      @QueryParam("direction") String direction, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{username}/events/public")
  @GET
  @Produces("application/json")
  Response activity_list_public_events_for_user(@PathParam("username") String username,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * This is the user's organization dashboard. You must be authenticated as the user to view this.
   */
  @Path("/{username}/events/orgs/{org}")
  @GET
  @Produces("application/json")
  Response activity_list_org_events_for_authenticated_user(@PathParam("username") String username,
      @PathParam("org") String org, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * These are events that you've received by watching repos and following users. If you are authenticated as the given user, you will see private events. Otherwise, you'll only see public events.
   */
  @Path("/{username}/received_events")
  @GET
  @Produces("application/json")
  Response activity_list_received_events_for_user(@PathParam("username") String username,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Lists repositories a user has starred.
   *
   * You can also find out _when_ stars were created by passing the following custom [media type](https://developer.github.com/v3/media/) via the `Accept` header:
   */
  @Path("/{username}/starred")
  @GET
  @Produces({"application/json", "application/vnd.github.v3.star+json"})
  Response activity_list_repos_starred_by_user(@PathParam("username") String username,
      @QueryParam("sort") String sort, @QueryParam("direction") String direction,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Lists repositories a user is watching.
   */
  @Path("/{username}/subscriptions")
  @GET
  @Produces("application/json")
  Response activity_list_repos_watched_by_user(@PathParam("username") String username,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * If you are authenticated as the given user, you will see your private events. Otherwise, you'll only see public events.
   */
  @Path("/{username}/events")
  @GET
  @Produces("application/json")
  Response activity_list_events_for_authenticated_user(@PathParam("username") String username,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{username}/received_events/public")
  @GET
  @Produces("application/json")
  Response activity_list_received_public_events_for_user(@PathParam("username") String username,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{username}/projects")
  @GET
  @Produces("application/json")
  Response projects_list_for_user(@PathParam("username") String username,
      @QueryParam("state") String state, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * List [public organization memberships](https://help.github.com/articles/publicizing-or-concealing-organization-membership) for the specified user.
   *
   * This method only lists _public_ memberships, regardless of authentication. If you need to fetch all of the organization memberships (public and private) for the authenticated user, use the [List organizations for the authenticated user](https://developer.github.com/v3/orgs/#list-organizations-for-the-authenticated-user) API instead.
   */
  @Path("/{username}/orgs")
  @GET
  @Produces("application/json")
  Response orgs_list_for_user(@PathParam("username") String username,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Lists the people who the specified user follows.
   */
  @Path("/{username}/following")
  @GET
  @Produces("application/json")
  Response users_list_following_for_user(@PathParam("username") String username,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Provides publicly available information about someone with a GitHub account.
   *
   * GitHub Apps with the `Plan` user permission can use this endpoint to retrieve information about a user's GitHub plan. The GitHub App must be authenticated as a user. See "[Identifying and authorizing users for GitHub Apps](https://developer.github.com/apps/building-github-apps/identifying-and-authorizing-users-for-github-apps/)" for details about authentication. For an example response, see "[Response with GitHub plan information](https://developer.github.com/v3/users/#response-with-github-plan-information)."
   *
   * The `email` key in the following response is the publicly visible email address from your GitHub [profile page](https://github.com/settings/profile). When setting up your profile, you can select a primary email address to be “public” which provides an email entry for this endpoint. If you do not set a public email address for `email`, then it will have a value of `null`. You only see publicly visible email addresses when authenticated with GitHub. For more information, see [Authentication](https://developer.github.com/v3/#authentication).
   *
   * The Emails API enables you to list all of your email addresses, and toggle a primary email to be visible publicly. For more information, see "[Emails API](https://developer.github.com/v3/users/emails/)".
   */
  @Path("/{username}")
  @GET
  @Produces("application/json")
  Response users_get_by_username(@PathParam("username") String username);

  /**
   * Lists the GPG keys for a user. This information is accessible by anyone.
   */
  @Path("/{username}/gpg_keys")
  @GET
  @Produces("application/json")
  Response users_list_gpg_keys_for_user(@PathParam("username") String username,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{username}/following/{target_user}")
  @GET
  void users_check_following_for_user(@PathParam("username") String username,
      @PathParam("target_user") String targetUser);

  /**
   * Lists all users, in the order that they signed up on GitHub. This list includes personal user accounts and organization accounts.
   *
   * Note: Pagination is powered exclusively by the `since` parameter. Use the [Link header](https://developer.github.com/v3/#link-header) to get the URL for the next page of users.
   */
  @GET
  @Produces("application/json")
  Response users_list(@QueryParam("since") String since, @QueryParam("per_page") Integer perPage);

  /**
   * Provides hovercard information when authenticated through basic auth or OAuth with the `repo` scope. You can find out more about someone in relation to their pull requests, issues, repositories, and organizations.
   *
   * The `subject_type` and `subject_id` parameters provide context for the person's hovercard, which returns more information than without the parameters. For example, if you wanted to find out more about `octocat` who owns the `Spoon-Knife` repository via cURL, it would look like this:
   *
   * ```shell
   *  curl -u username:token
   *   https://api.github.com/users/octocat/hovercard?subject_type=repository&subject_id=1300192
   * ```
   */
  @Path("/{username}/hovercard")
  @GET
  @Produces("application/json")
  Response users_get_context_for_user(@PathParam("username") String username,
      @QueryParam("subject_type") String subjectType, @QueryParam("subject_id") String subjectId);

  /**
   * Lists the _verified_ public SSH keys for a user. This is accessible by anyone.
   */
  @Path("/{username}/keys")
  @GET
  @Produces("application/json")
  Response users_list_public_keys_for_user(@PathParam("username") String username,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Lists the people following the specified user.
   */
  @Path("/{username}/followers")
  @GET
  @Produces("application/json")
  Response users_list_followers_for_user(@PathParam("username") String username,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Enables an authenticated GitHub App to find the user’s installation information.
   *
   * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
   */
  @Path("/{username}/installation")
  @GET
  @Produces("application/json")
  Response apps_get_user_installation(@PathParam("username") String username);

  /**
   * Lists public gists for the specified user:
   */
  @Path("/{username}/gists")
  @GET
  @Produces("application/json")
  Response gists_list_for_user(@PathParam("username") String username,
      @QueryParam("since") String since, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * **Warning:** The Billing API is currently in public beta and subject to change.
   *
   * Gets the estimated paid and estimated total storage used for GitHub Actions and Github Packages.
   *
   * Paid minutes only apply to packages stored for private repositories. For more information, see "[Managing billing for GitHub Packages](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-billing-for-github-packages)."
   *
   * Access tokens must have the `user` scope.
   */
  @Path("/{username}/settings/billing/shared-storage")
  @GET
  @Produces("application/json")
  Response billing_get_shared_storage_billing_user(@PathParam("username") String username);

  /**
   * **Warning:** The Billing API is currently in public beta and subject to change.
   *
   * Gets the free and paid storage used for GitHub Packages in gigabytes.
   *
   * Paid minutes only apply to packages stored for private repositories. For more information, see "[Managing billing for GitHub Packages](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-billing-for-github-packages)."
   *
   * Access tokens must have the `user` scope.
   */
  @Path("/{username}/settings/billing/packages")
  @GET
  @Produces("application/json")
  Response billing_get_github_packages_billing_user(@PathParam("username") String username);

  /**
   * **Warning:** The Billing API is currently in public beta and subject to change.
   *
   * Gets the summary of the free and paid GitHub Actions minutes used.
   *
   * Paid minutes only apply to workflows in private repositories that use GitHub-hosted runners. Minutes used is listed for each GitHub-hosted runner operating system. Any job re-runs are also included in the usage. The usage does not include the multiplier for macOS and Windows runners and is not rounded up to the nearest whole minute. For more information, see "[Managing billing for GitHub Actions](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-billing-for-github-actions)".
   *
   * Access tokens must have the `user` scope.
   */
  @Path("/{username}/settings/billing/actions")
  @GET
  @Produces("application/json")
  Response billing_get_github_actions_billing_user(@PathParam("username") String username);
}
