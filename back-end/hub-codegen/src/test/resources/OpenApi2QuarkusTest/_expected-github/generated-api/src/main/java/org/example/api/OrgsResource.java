package org.example.api;

import java.io.InputStream;
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
@Path("/orgs")
public interface OrgsResource {
  /**
   * Lists repositories for the specified organization.
   */
  @Path("/{org}/repos")
  @GET
  @Produces("application/json")
  Response repos_list_for_org(@PathParam("org") String org, @QueryParam("type") String type,
      @QueryParam("sort") String sort, @QueryParam("direction") String direction,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Creates a new repository in the specified organization. The authenticated user must be a member of the organization.
   *
   * **OAuth scope requirements**
   *
   * When using [OAuth](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/), authorizations must include:
   *
   * *   `public_repo` scope or `repo` scope to create a public repository
   * *   `repo` scope to create a private repository
   */
  @Path("/{org}/repos")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response repos_create_in_org(@PathParam("org") String org, InputStream data);

  /**
   * Lists the most recent migrations.
   */
  @Path("/{org}/migrations")
  @GET
  @Produces("application/json")
  Response migrations_list_for_org(@PathParam("org") String org,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Initiates the generation of a migration archive.
   */
  @Path("/{org}/migrations")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response migrations_start_for_org(@PathParam("org") String org, InputStream data);

  /**
   * Unlocks a repository that was locked for migration. You should unlock each migrated repository and [delete them](https://developer.github.com/v3/repos/#delete-a-repository) when the migration is complete and you no longer need the source data.
   */
  @Path("/{org}/migrations/{migration_id}/repos/{repo_name}/lock")
  @DELETE
  void migrations_unlock_repo_for_org(@PathParam("org") String org,
      @PathParam("migration_id") Integer migrationId, @PathParam("repo_name") String repoName);

  /**
   * List all the repositories for this organization migration.
   */
  @Path("/{org}/migrations/{migration_id}/repositories")
  @GET
  @Produces("application/json")
  Response migrations_list_repos_for_org(@PathParam("org") String org,
      @PathParam("migration_id") Integer migrationId, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Fetches the URL to a migration archive.
   */
  @Path("/{org}/migrations/{migration_id}/archive")
  @GET
  void migrations_download_archive_for_org(@PathParam("org") String org,
      @PathParam("migration_id") Integer migrationId);

  /**
   * Deletes a previous migration archive. Migration archives are automatically deleted after seven days.
   */
  @Path("/{org}/migrations/{migration_id}/archive")
  @DELETE
  void migrations_delete_archive_for_org(@PathParam("org") String org,
      @PathParam("migration_id") Integer migrationId);

  /**
   * Fetches the status of a migration.
   *
   * The `state` of a migration can be one of the following values:
   *
   * *   `pending`, which means the migration hasn't started yet.
   * *   `exporting`, which means the migration is in progress.
   * *   `exported`, which means the migration finished successfully.
   * *   `failed`, which means the migration failed.
   */
  @Path("/{org}/migrations/{migration_id}")
  @GET
  @Produces("application/json")
  Response migrations_get_status_for_org(@PathParam("org") String org,
      @PathParam("migration_id") Integer migrationId);

  /**
   * Shows which group of GitHub users can interact with this organization and when the restriction expires. If there are no restrictions, you will see an empty response.
   */
  @Path("/{org}/interaction-limits")
  @GET
  @Produces("application/json")
  Response interactions_get_restrictions_for_org(@PathParam("org") String org);

  /**
   * Temporarily restricts interactions to certain GitHub users in any public repository in the given organization. You must be an organization owner to set these restrictions.
   */
  @Path("/{org}/interaction-limits")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response interactions_set_restrictions_for_org(@PathParam("org") String org, InputStream data);

  /**
   * Removes all interaction restrictions from public repositories in the given organization. You must be an organization owner to remove restrictions.
   */
  @Path("/{org}/interaction-limits")
  @DELETE
  void interactions_remove_restrictions_for_org(@PathParam("org") String org);

  /**
   *
   */
  @Path("/{org}/events")
  @GET
  @Produces("application/json")
  Response activity_list_public_org_events(@PathParam("org") String org,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Lists the projects in an organization. Returns a `404 Not Found` status if projects are disabled in the organization. If you do not have sufficient privileges to perform this action, a `401 Unauthorized` or `410 Gone` status is returned.
   */
  @Path("/{org}/projects")
  @GET
  @Produces("application/json")
  Response projects_list_for_org(@PathParam("org") String org, @QueryParam("state") String state,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Creates an organization project board. Returns a `404 Not Found` status if projects are disabled in the organization. If you do not have sufficient privileges to perform this action, a `401 Unauthorized` or `410 Gone` status is returned.
   */
  @Path("/{org}/projects")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response projects_create_for_org(@PathParam("org") String org, InputStream data);

  /**
   * **Note:** You can also specify a team or organization with `team_id` and `org_id` using the route `DELETE /organizations/:org_id/team/:team_id/discussions/:discussion_number/reactions/:reaction_id`.
   *
   * Delete a reaction to a [team discussion](https://developer.github.com/v3/teams/discussions/). OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   */
  @Path("/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions/{reaction_id}")
  @DELETE
  void reactions_delete_for_team_discussion(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug,
      @PathParam("discussion_number") Integer discussionNumber,
      @PathParam("reaction_id") Integer reactionId);

  /**
   * **Note:** You can also specify a team or organization with `team_id` and `org_id` using the route `DELETE /organizations/:org_id/team/:team_id/discussions/:discussion_number/comments/:comment_number/reactions/:reaction_id`.
   *
   * Delete a reaction to a [team discussion comment](https://developer.github.com/v3/teams/discussion_comments/). OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   */
  @Path("/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions/{reaction_id}")
  @DELETE
  void reactions_delete_for_team_discussion_comment(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug,
      @PathParam("discussion_number") Integer discussionNumber,
      @PathParam("comment_number") Integer commentNumber,
      @PathParam("reaction_id") Integer reactionId);

  /**
   * List the reactions to a [team discussion comment](https://developer.github.com/v3/teams/discussion_comments/). OAuth access tokens require the `read:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/discussions/:discussion_number/comments/:comment_number/reactions`.
   */
  @Path("/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions")
  @GET
  @Produces("application/json")
  Response reactions_list_for_team_discussion_comment_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug,
      @PathParam("discussion_number") Integer discussionNumber,
      @PathParam("comment_number") Integer commentNumber, @QueryParam("content") String content,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Create a reaction to a [team discussion comment](https://developer.github.com/v3/teams/discussion_comments/). OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/). A response with a `Status: 200 OK` means that you already added the reaction type to this team discussion comment.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `POST /organizations/:org_id/team/:team_id/discussions/:discussion_number/comments/:comment_number/reactions`.
   */
  @Path("/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}/reactions")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response reactions_create_for_team_discussion_comment_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug,
      @PathParam("discussion_number") Integer discussionNumber,
      @PathParam("comment_number") Integer commentNumber, InputStream data);

  /**
   * List the reactions to a [team discussion](https://developer.github.com/v3/teams/discussions/). OAuth access tokens require the `read:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/:org_id/team/:team_id/discussions/:discussion_number/reactions`.
   */
  @Path("/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions")
  @GET
  @Produces("application/json")
  Response reactions_list_for_team_discussion_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug,
      @PathParam("discussion_number") Integer discussionNumber,
      @QueryParam("content") String content, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Create a reaction to a [team discussion](https://developer.github.com/v3/teams/discussions/). OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/). A response with a `Status: 200 OK` means that you already added the reaction type to this team discussion.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `POST /organizations/:org_id/team/:team_id/discussions/:discussion_number/reactions`.
   */
  @Path("/{org}/teams/{team_slug}/discussions/{discussion_number}/reactions")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response reactions_create_for_team_discussion_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug,
      @PathParam("discussion_number") Integer discussionNumber, InputStream data);

  /**
   * Listing and deleting credential authorizations is available to organizations with GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products).
   *
   * An authenticated organization owner with the `read:org` scope can list all credential authorizations for an organization that uses SAML single sign-on (SSO). The credentials are either personal access tokens or SSH keys that organization members have authorized for the organization. For more information, see [About authentication with SAML single sign-on](https://help.github.com/en/articles/about-authentication-with-saml-single-sign-on).
   */
  @Path("/{org}/credential-authorizations")
  @GET
  @Produces("application/json")
  Response orgs_list_saml_sso_authorizations(@PathParam("org") String org);

  /**
   * List all teams associated with an invitation. In order to see invitations in an organization, the authenticated user must be an organization owner.
   */
  @Path("/{org}/invitations/{invitation_id}/teams")
  @GET
  @Produces("application/json")
  Response orgs_list_invitation_teams(@PathParam("org") String org,
      @PathParam("invitation_id") Integer invitationId, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * When an organization member is converted to an outside collaborator, they'll only have access to the repositories that their current team membership allows. The user will no longer be a member of the organization. For more information, see "[Converting an organization member to an outside collaborator](https://help.github.com/articles/converting-an-organization-member-to-an-outside-collaborator/)".
   */
  @Path("/{org}/outside_collaborators/{username}")
  @PUT
  void orgs_convert_member_to_outside_collaborator(@PathParam("org") String org,
      @PathParam("username") String username);

  /**
   * Removing a user from this list will remove them from all the organization's repositories.
   */
  @Path("/{org}/outside_collaborators/{username}")
  @DELETE
  void orgs_remove_outside_collaborator(@PathParam("org") String org,
      @PathParam("username") String username);

  /**
   * In order to get a user's membership with an organization, the authenticated user must be an organization member.
   */
  @Path("/{org}/memberships/{username}")
  @GET
  @Produces("application/json")
  Response orgs_get_membership_for_user(@PathParam("org") String org,
      @PathParam("username") String username);

  /**
   * Only authenticated organization owners can add a member to the organization or update the member's role.
   *
   * *   If the authenticated user is _adding_ a member to the organization, the invited user will receive an email inviting them to the organization. The user's [membership status](https://developer.github.com/v3/orgs/members/#get-organization-membership-for-a-user) will be `pending` until they accept the invitation.
   *     
   * *   Authenticated users can _update_ a user's membership by passing the `role` parameter. If the authenticated user changes a member's role to `admin`, the affected user will receive an email notifying them that they've been made an organization owner. If the authenticated user changes an owner's role to `member`, no email will be sent.
   *
   * **Rate limits**
   *
   * To prevent abuse, the authenticated user is limited to 50 organization invitations per 24 hour period. If the organization is more than one month old or on a paid plan, the limit is 500 invitations per 24 hour period.
   */
  @Path("/{org}/memberships/{username}")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response orgs_set_membership_for_user(@PathParam("org") String org,
      @PathParam("username") String username, InputStream data);

  /**
   * In order to remove a user's membership with an organization, the authenticated user must be an organization owner.
   *
   * If the specified user is an active member of the organization, this will remove them from the organization. If the specified user has been invited to the organization, this will cancel their invitation. The specified user will receive an email notification in both cases.
   */
  @Path("/{org}/memberships/{username}")
  @DELETE
  void orgs_remove_membership_for_user(@PathParam("org") String org,
      @PathParam("username") String username);

  /**
   *
   */
  @Path("/{org}/hooks/{hook_id}")
  @GET
  @Produces("application/json")
  Response orgs_get_webhook(@PathParam("org") String org, @PathParam("hook_id") Integer hookId);

  /**
   *
   */
  @Path("/{org}/hooks/{hook_id}")
  @DELETE
  void orgs_delete_webhook(@PathParam("org") String org, @PathParam("hook_id") Integer hookId);

  /**
   *
   */
  @Path("/{org}/hooks/{hook_id}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response orgs_update_webhook(@PathParam("org") String org, @PathParam("hook_id") Integer hookId,
      InputStream data);

  /**
   * To see many of the organization response values, you need to be an authenticated organization owner with the `admin:org` scope. When the value of `two_factor_requirement_enabled` is `true`, the organization requires all members, billing managers, and outside collaborators to enable [two-factor authentication](https://help.github.com/articles/securing-your-account-with-two-factor-authentication-2fa/).
   *
   * GitHub Apps with the `Organization plan` permission can use this endpoint to retrieve information about an organization's GitHub plan. See "[Authenticating with GitHub Apps](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/)" for details. For an example response, see "[Response with GitHub plan information](https://developer.github.com/v3/orgs/#response-with-github-plan-information)."
   */
  @Path("/{org}")
  @GET
  @Produces("application/json")
  Response orgs_get(@PathParam("org") String org);

  /**
   * **Parameter Deprecation Notice:** GitHub will replace and discontinue `members_allowed_repository_creation_type` in favor of more granular permissions. The new input parameters are `members_can_create_public_repositories`, `members_can_create_private_repositories` for all organizations and `members_can_create_internal_repositories` for organizations associated with an enterprise account using GitHub Enterprise Cloud or GitHub Enterprise Server 2.20+. For more information, see the [blog post](https://developer.github.com/changes/2019-12-03-internal-visibility-changes).
   *
   * Enables an authenticated organization owner with the `admin:org` scope to update the organization's profile and member privileges.
   */
  @Path("/{org}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response orgs_update(@PathParam("org") String org, InputStream data);

  /**
   * This will trigger a [ping event](https://developer.github.com/webhooks/#ping-event) to be sent to the hook.
   */
  @Path("/{org}/hooks/{hook_id}/pings")
  @POST
  void orgs_ping_webhook(@PathParam("org") String org, @PathParam("hook_id") Integer hookId);

  /**
   * Check if a user is, publicly or privately, a member of the organization.
   */
  @Path("/{org}/members/{username}")
  @GET
  void orgs_check_membership_for_user(@PathParam("org") String org,
      @PathParam("username") String username);

  /**
   * Removing a user from this list will remove them from all teams and they will no longer have any access to the organization's repositories.
   */
  @Path("/{org}/members/{username}")
  @DELETE
  void orgs_remove_member(@PathParam("org") String org, @PathParam("username") String username);

  /**
   * Lists all GitHub Apps in an organization. The installation count includes all GitHub Apps installed on repositories in the organization. You must be an organization owner with `admin:read` scope to use this endpoint.
   */
  @Path("/{org}/installations")
  @GET
  @Produces("application/json")
  Response orgs_list_app_installations(@PathParam("org") String org,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{org}/public_members/{username}")
  @GET
  void orgs_check_public_membership_for_user(@PathParam("org") String org,
      @PathParam("username") String username);

  /**
   * The user can publicize their own membership. (A user cannot publicize the membership for another user.)
   *
   * Note that you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
   */
  @Path("/{org}/public_members/{username}")
  @PUT
  void orgs_set_public_membership_for_authenticated_user(@PathParam("org") String org,
      @PathParam("username") String username);

  /**
   *
   */
  @Path("/{org}/public_members/{username}")
  @DELETE
  void orgs_remove_public_membership_for_authenticated_user(@PathParam("org") String org,
      @PathParam("username") String username);

  /**
   * List all users who are outside collaborators of an organization.
   */
  @Path("/{org}/outside_collaborators")
  @GET
  @Produces("application/json")
  Response orgs_list_outside_collaborators(@PathParam("org") String org,
      @QueryParam("filter") String filter, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * The return hash contains a `role` field which refers to the Organization Invitation role and will be one of the following values: `direct_member`, `admin`, `billing_manager`, `hiring_manager`, or `reinstate`. If the invitee is not a GitHub member, the `login` field in the return hash will be `null`.
   */
  @Path("/{org}/invitations")
  @GET
  @Produces("application/json")
  Response orgs_list_pending_invitations(@PathParam("org") String org,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Invite people to an organization by using their GitHub user ID or their email address. In order to create invitations in an organization, the authenticated user must be an organization owner.
   *
   * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
   */
  @Path("/{org}/invitations")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response orgs_create_invitation(@PathParam("org") String org, InputStream data);

  /**
   *
   */
  @Path("/{org}/hooks")
  @GET
  @Produces("application/json")
  Response orgs_list_webhooks(@PathParam("org") String org, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Here's how you can create a hook that posts payloads in JSON format:
   */
  @Path("/{org}/hooks")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response orgs_create_webhook(@PathParam("org") String org, InputStream data);

  /**
   * List the users blocked by an organization.
   */
  @Path("/{org}/blocks")
  @GET
  @Produces("application/json")
  Response orgs_list_blocked_users(@PathParam("org") String org);

  /**
   *
   */
  @Path("/{org}/blocks/{username}")
  @GET
  void orgs_check_blocked_user(@PathParam("org") String org,
      @PathParam("username") String username);

  /**
   *
   */
  @Path("/{org}/blocks/{username}")
  @PUT
  void orgs_block_user(@PathParam("org") String org, @PathParam("username") String username);

  /**
   *
   */
  @Path("/{org}/blocks/{username}")
  @DELETE
  void orgs_unblock_user(@PathParam("org") String org, @PathParam("username") String username);

  /**
   * List all users who are members of an organization. If the authenticated user is also a member of this organization then both concealed and public members will be returned.
   */
  @Path("/{org}/members")
  @GET
  @Produces("application/json")
  Response orgs_list_members(@PathParam("org") String org, @QueryParam("filter") String filter,
      @QueryParam("role") String role, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Listing and deleting credential authorizations is available to organizations with GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products).
   *
   * An authenticated organization owner with the `admin:org` scope can remove a credential authorization for an organization that uses SAML SSO. Once you remove someone's credential authorization, they will need to create a new personal access token or SSH key and authorize it for the organization they want to access.
   */
  @Path("/{org}/credential-authorizations/{credential_id}")
  @DELETE
  void orgs_remove_saml_sso_authorization(@PathParam("org") String org,
      @PathParam("credential_id") Integer credentialId);

  /**
   * Members of an organization can choose to have their membership publicized or not.
   */
  @Path("/{org}/public_members")
  @GET
  @Produces("application/json")
  Response orgs_list_public_members(@PathParam("org") String org,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * **Warning:** The self-hosted runners API for organizations is currently in public beta and subject to change.
   *
   * Gets a specific self-hosted runner for an organization. You must authenticate using an access token with the `admin:org` scope to use this endpoint.
   */
  @Path("/{org}/actions/runners/{runner_id}")
  @GET
  @Produces("application/json")
  Response actions_get_self_hosted_runner_for_org(@PathParam("org") String org,
      @PathParam("runner_id") Integer runnerId);

  /**
   * **Warning:** The self-hosted runners API for organizations is currently in public beta and subject to change.
   *
   * Forces the removal of a self-hosted runner from an organization. You can use this endpoint to completely remove the runner when the machine you were using no longer exists. You must authenticate using an access token with the `admin:org` scope to use this endpoint.
   */
  @Path("/{org}/actions/runners/{runner_id}")
  @DELETE
  void actions_delete_self_hosted_runner_from_org(@PathParam("org") String org,
      @PathParam("runner_id") Integer runnerId);

  /**
   * **Warning:** The self-hosted runners API for organizations is currently in public beta and subject to change.
   *
   * Lists all self-hosted runners for an organization. You must authenticate using an access token with the `admin:org` scope to use this endpoint.
   */
  @Path("/{org}/actions/runners")
  @GET
  @Produces("application/json")
  Response actions_list_self_hosted_runners_for_org(@PathParam("org") String org,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Gets a single organization secret without revealing its encrypted value. You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
   */
  @Path("/{org}/actions/secrets/{secret_name}")
  @GET
  @Produces("application/json")
  Response actions_get_org_secret(@PathParam("org") String org,
      @PathParam("secret_name") String secretName);

  /**
   * Creates or updates an organization secret with an encrypted value. Encrypt your secret using
   * [LibSodium](https://libsodium.gitbook.io/doc/bindings_for_other_languages). You must authenticate using an access
   * token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to
   * use this endpoint.
   *
   * #### Example encrypting a secret using Node.js
   *
   * Encrypt your secret using the [tweetsodium](https://github.com/github/tweetsodium) library.
   *
   * ```
   * const sodium = require('tweetsodium');
   *
   * const key = "base64-encoded-public-key";
   * const value = "plain-text-secret";
   *
   * // Convert the message and key to Uint8Array's (Buffer implements that interface)
   * const messageBytes = Buffer.from(value);
   * const keyBytes = Buffer.from(key, 'base64');
   *
   * // Encrypt using LibSodium.
   * const encryptedBytes = sodium.seal(messageBytes, keyBytes);
   *
   * // Base64 the encrypted secret
   * const encrypted = Buffer.from(encryptedBytes).toString('base64');
   *
   * console.log(encrypted);
   * ```
   *
   *
   * #### Example encrypting a secret using Python
   *
   * Encrypt your secret using [pynacl](https://pynacl.readthedocs.io/en/stable/public/#nacl-public-sealedbox) with Python 3.
   *
   * ```
   * from base64 import b64encode
   * from nacl import encoding, public
   *
   * def encrypt(public_key: str, secret_value: str) -> str:
   *   """Encrypt a Unicode string using the public key."""
   *   public_key = public.PublicKey(public_key.encode("utf-8"), encoding.Base64Encoder())
   *   sealed_box = public.SealedBox(public_key)
   *   encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))
   *   return b64encode(encrypted).decode("utf-8")
   * ```
   *
   * #### Example encrypting a secret using C#
   *
   * Encrypt your secret using the [Sodium.Core](https://www.nuget.org/packages/Sodium.Core/) package.
   *
   * ```
   * var secretValue = System.Text.Encoding.UTF8.GetBytes("mySecret");
   * var publicKey = Convert.FromBase64String("2Sg8iYjAxxmI2LvUXpJjkYrMxURPc8r+dB7TJyvvcCU=");
   *
   * var sealedPublicKeyBox = Sodium.SealedPublicKeyBox.Create(secretValue, publicKey);
   *
   * Console.WriteLine(Convert.ToBase64String(sealedPublicKeyBox));
   * ```
   *
   * #### Example encrypting a secret using Ruby
   *
   * Encrypt your secret using the [rbnacl](https://github.com/RubyCrypto/rbnacl) gem.
   *
   * ```ruby
   * require "rbnacl"
   * require "base64"
   *
   * key = Base64.decode64("+ZYvJDZMHUfBkJdyq5Zm9SKqeuBQ4sj+6sfjlH4CgG0=")
   * public_key = RbNaCl::PublicKey.new(key)
   *
   * box = RbNaCl::Boxes::Sealed.from_public_key(public_key)
   * encrypted_secret = box.encrypt("my_secret")
   *
   * # Print the base64 encoded secret
   * puts Base64.strict_encode64(encrypted_secret)
   * ```
   */
  @Path("/{org}/actions/secrets/{secret_name}")
  @PUT
  @Consumes("application/json")
  void actions_create_or_update_org_secret(@PathParam("org") String org,
      @PathParam("secret_name") String secretName, InputStream data);

  /**
   * Deletes a secret in an organization using the secret name. You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
   */
  @Path("/{org}/actions/secrets/{secret_name}")
  @DELETE
  void actions_delete_org_secret(@PathParam("org") String org,
      @PathParam("secret_name") String secretName);

  /**
   * Lists all secrets available in an organization without revealing their encrypted values. You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
   */
  @Path("/{org}/actions/secrets")
  @GET
  @Produces("application/json")
  Response actions_list_org_secrets(@PathParam("org") String org,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * **Warning:** The self-hosted runners API for organizations is currently in public beta and subject to change.
   *
   *
   * Returns a token that you can pass to the `config` script. The token expires after one hour. You must authenticate
   * using an access token with the `admin:org` scope to use this endpoint.
   *
   * #### Example using registration token
   *
   * Configure your self-hosted runner, replacing `TOKEN` with the registration token provided by this endpoint.
   *
   * ```
   * ./config.sh --url https://github.com/octo-org --token TOKEN
   * ```
   */
  @Path("/{org}/actions/runners/registration-token")
  @POST
  @Produces("application/json")
  Response actions_create_registration_token_for_org(@PathParam("org") String org);

  /**
   * Adds a repository to an organization secret when the `visibility` for repository access is set to `selected`. The visibility is set when you [Create or update an organization secret](https://developer.github.com/v3/actions/secrets/#create-or-update-an-organization-secret). You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
   */
  @Path("/{org}/actions/secrets/{secret_name}/repositories/{repository_id}")
  @PUT
  void actions_add_selected_repo_to_org_secret(@PathParam("org") String org,
      @PathParam("secret_name") String secretName,
      @PathParam("repository_id") Integer repositoryId);

  /**
   * Removes a repository from an organization secret when the `visibility` for repository access is set to `selected`. The visibility is set when you [Create or update an organization secret](https://developer.github.com/v3/actions/secrets/#create-or-update-an-organization-secret). You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
   */
  @Path("/{org}/actions/secrets/{secret_name}/repositories/{repository_id}")
  @DELETE
  void actions_remove_selected_repo_from_org_secret(@PathParam("org") String org,
      @PathParam("secret_name") String secretName,
      @PathParam("repository_id") Integer repositoryId);

  /**
   * **Warning:** The self-hosted runners API for organizations is currently in public beta and subject to change.
   *
   * Lists binaries for the runner application that you can download and run. You must authenticate using an access token with the `admin:org` scope to use this endpoint.
   */
  @Path("/{org}/actions/runners/downloads")
  @GET
  @Produces("application/json")
  Response actions_list_runner_applications_for_org(@PathParam("org") String org);

  /**
   * **Warning:** The self-hosted runners API for organizations is currently in public beta and subject to change.
   *
   *
   * Returns a token that you can pass to the `config` script to remove a self-hosted runner from an organization. The
   * token expires after one hour. You must authenticate using an access token with the `admin:org` scope to use this
   * endpoint.
   *
   * #### Example using remove token
   *
   * To remove your self-hosted runner from an organization, replace `TOKEN` with the remove token provided by this
   * endpoint.
   *
   * ```
   * ./config.sh remove --token TOKEN
   * ```
   */
  @Path("/{org}/actions/runners/remove-token")
  @POST
  @Produces("application/json")
  Response actions_create_remove_token_for_org(@PathParam("org") String org);

  /**
   * Lists all repositories that have been selected when the `visibility` for repository access to a secret is set to `selected`. You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
   */
  @Path("/{org}/actions/secrets/{secret_name}/repositories")
  @GET
  @Produces("application/json")
  Response actions_list_selected_repos_for_org_secret(@PathParam("org") String org,
      @PathParam("secret_name") String secretName);

  /**
   * Replaces all repositories for an organization secret when the `visibility` for repository access is set to `selected`. The visibility is set when you [Create or update an organization secret](https://developer.github.com/v3/actions/secrets/#create-or-update-an-organization-secret). You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
   */
  @Path("/{org}/actions/secrets/{secret_name}/repositories")
  @PUT
  @Consumes("application/json")
  void actions_set_selected_repos_for_org_secret(@PathParam("org") String org,
      @PathParam("secret_name") String secretName, InputStream data);

  /**
   * Gets your public key, which you need to encrypt secrets. You need to encrypt a secret before you can create or update secrets. You must authenticate using an access token with the `admin:org` scope to use this endpoint. GitHub Apps must have the `secrets` organization permission to use this endpoint.
   */
  @Path("/{org}/actions/secrets/public-key")
  @GET
  @Produces("application/json")
  Response actions_get_org_public_key(@PathParam("org") String org);

  /**
   * Checks whether a team has `admin`, `push`, `maintain`, `triage`, or `pull` permission for a repository. Repositories inherited through a parent team will also be checked.
   *
   * You can also get information about the specified repository, including what permissions the team grants on it, by passing the following custom [media type](https://developer.github.com/v3/media/) via the `application/vnd.github.v3.repository+json` accept header.
   *
   * If a team doesn't have permission for the repository, you will receive a `404 Not Found` response status.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/{org_id}/team/{team_id}/repos/{owner}/{repo}`.
   */
  @Path("/{org}/teams/{team_slug}/repos/{owner}/{repo}")
  @GET
  @Produces("application/vnd.github.v3.repository+json")
  Response teams_check_permissions_for_repo_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * To add a repository to a team or update the team's permission on a repository, the authenticated user must have admin access to the repository, and must be able to see the team. The repository must be owned by the organization, or a direct fork of a repository owned by the organization. You will get a `422 Unprocessable Entity` status if you attempt to add a repository to a team that is not owned by the organization. Note that, if you choose not to pass any parameters, you'll need to set `Content-Length` to zero when calling out to this endpoint. For more information, see "[HTTP verbs](https://developer.github.com/v3/#http-verbs)."
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PUT /organizations/{org_id}/team/{team_id}/repos/{owner}/{repo}`.
   *
   * For more information about the permission levels, see "[Repository permission levels for an organization](https://help.github.com/en/github/setting-up-and-managing-organizations-and-teams/repository-permission-levels-for-an-organization#permission-levels-for-repositories-owned-by-an-organization)".
   */
  @Path("/{org}/teams/{team_slug}/repos/{owner}/{repo}")
  @PUT
  @Consumes("application/json")
  void teams_add_or_update_repo_permissions_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @PathParam("owner") String owner,
      @PathParam("repo") String repo, InputStream data);

  /**
   * If the authenticated user is an organization owner or a team maintainer, they can remove any repositories from the team. To remove a repository from a team as an organization member, the authenticated user must have admin access to the repository and must be able to see the team. This does not delete the repository, it just removes it from the team.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `DELETE /organizations/{org_id}/team/{team_id}/repos/{owner}/{repo}`.
   */
  @Path("/{org}/teams/{team_slug}/repos/{owner}/{repo}")
  @DELETE
  void teams_remove_repo_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @PathParam("owner") String owner,
      @PathParam("repo") String repo);

  /**
   * Team members will include the members of child teams.
   *
   * To list members in a team, the team must be visible to the authenticated user.
   */
  @Path("/{org}/teams/{team_slug}/members")
  @GET
  @Produces("application/json")
  Response teams_list_members_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @QueryParam("role") String role,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * List all comments on a team discussion. OAuth access tokens require the `read:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/{org_id}/team/{team_id}/discussions/{discussion_number}/comments`.
   */
  @Path("/{org}/teams/{team_slug}/discussions/{discussion_number}/comments")
  @GET
  @Produces("application/json")
  Response teams_list_discussion_comments_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug,
      @PathParam("discussion_number") Integer discussionNumber,
      @QueryParam("direction") String direction, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Creates a new comment on a team discussion. OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   *
   * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `POST /organizations/{org_id}/team/{team_id}/discussions/{discussion_number}/comments`.
   */
  @Path("/{org}/teams/{team_slug}/discussions/{discussion_number}/comments")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response teams_create_discussion_comment_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug,
      @PathParam("discussion_number") Integer discussionNumber, InputStream data);

  /**
   * List all discussions on a team's page. OAuth access tokens require the `read:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/{org_id}/team/{team_id}/discussions`.
   */
  @Path("/{org}/teams/{team_slug}/discussions")
  @GET
  @Produces("application/json")
  Response teams_list_discussions_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @QueryParam("direction") String direction,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Creates a new discussion post on a team's page. OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   *
   * This endpoint triggers [notifications](https://help.github.com/articles/about-notifications/). Creating content too quickly using this endpoint may result in abuse rate limiting. See "[Abuse rate limits](https://developer.github.com/v3/#abuse-rate-limits)" and "[Dealing with abuse rate limits](https://developer.github.com/v3/guides/best-practices-for-integrators/#dealing-with-abuse-rate-limits)" for details.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `POST /organizations/{org_id}/team/{team_id}/discussions`.
   */
  @Path("/{org}/teams/{team_slug}/discussions")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response teams_create_discussion_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, InputStream data);

  /**
   * Get a specific discussion on a team's page. OAuth access tokens require the `read:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/{org_id}/team/{team_id}/discussions/{discussion_number}`.
   */
  @Path("/{org}/teams/{team_slug}/discussions/{discussion_number}")
  @GET
  @Produces("application/json")
  Response teams_get_discussion_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug,
      @PathParam("discussion_number") Integer discussionNumber);

  /**
   * Delete a discussion from a team's page. OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `DELETE /organizations/{org_id}/team/{team_id}/discussions/{discussion_number}`.
   */
  @Path("/{org}/teams/{team_slug}/discussions/{discussion_number}")
  @DELETE
  void teams_delete_discussion_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug,
      @PathParam("discussion_number") Integer discussionNumber);

  /**
   * Edits the title and body text of a discussion post. Only the parameters you provide are updated. OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PATCH /organizations/{org_id}/team/{team_id}/discussions/{discussion_number}`.
   */
  @Path("/{org}/teams/{team_slug}/discussions/{discussion_number}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response teams_update_discussion_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug,
      @PathParam("discussion_number") Integer discussionNumber, InputStream data);

  /**
   * Lists the organization projects for a team.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/{org_id}/team/{team_id}/projects`.
   */
  @Path("/{org}/teams/{team_slug}/projects")
  @GET
  @Produces("application/json")
  Response teams_list_projects_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Checks whether a team has `read`, `write`, or `admin` permissions for an organization project. The response includes projects inherited from a parent team.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/{org_id}/team/{team_id}/projects/{project_id}`.
   */
  @Path("/{org}/teams/{team_slug}/projects/{project_id}")
  @GET
  @Produces("application/json")
  Response teams_check_permissions_for_project_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @PathParam("project_id") Integer projectId);

  /**
   * Adds an organization project to a team. To add a project to a team or update the team's permission on a project, the authenticated user must have `admin` permissions for the project. The project and team must be part of the same organization.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PUT /organizations/{org_id}/team/{team_id}/projects/{project_id}`.
   */
  @Path("/{org}/teams/{team_slug}/projects/{project_id}")
  @PUT
  @Consumes("application/json")
  void teams_add_or_update_project_permissions_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @PathParam("project_id") Integer projectId,
      InputStream data);

  /**
   * Removes an organization project from a team. An organization owner or a team maintainer can remove any project from the team. To remove a project from a team as an organization member, the authenticated user must have `read` access to both the team and project, or `admin` access to the team or project. This endpoint removes the project from the team, but does not delete the project.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `DELETE /organizations/{org_id}/team/{team_id}/projects/{project_id}`.
   */
  @Path("/{org}/teams/{team_slug}/projects/{project_id}")
  @DELETE
  void teams_remove_project_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @PathParam("project_id") Integer projectId);

  /**
   * Get a specific comment on a team discussion. OAuth access tokens require the `read:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/{org_id}/team/{team_id}/discussions/{discussion_number}/comments/{comment_number}`.
   */
  @Path("/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}")
  @GET
  @Produces("application/json")
  Response teams_get_discussion_comment_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug,
      @PathParam("discussion_number") Integer discussionNumber,
      @PathParam("comment_number") Integer commentNumber);

  /**
   * Deletes a comment on a team discussion. OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `DELETE /organizations/{org_id}/team/{team_id}/discussions/{discussion_number}/comments/{comment_number}`.
   */
  @Path("/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}")
  @DELETE
  void teams_delete_discussion_comment_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug,
      @PathParam("discussion_number") Integer discussionNumber,
      @PathParam("comment_number") Integer commentNumber);

  /**
   * Edits the body text of a discussion comment. OAuth access tokens require the `write:discussion` [scope](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/).
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PATCH /organizations/{org_id}/team/{team_id}/discussions/{discussion_number}/comments/{comment_number}`.
   */
  @Path("/{org}/teams/{team_slug}/discussions/{discussion_number}/comments/{comment_number}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response teams_update_discussion_comment_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug,
      @PathParam("discussion_number") Integer discussionNumber,
      @PathParam("comment_number") Integer commentNumber, InputStream data);

  /**
   * Lists a team's repositories visible to the authenticated user.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/{org_id}/team/{team_id}/repos`.
   */
  @Path("/{org}/teams/{team_slug}/repos")
  @GET
  @Produces("application/json")
  Response teams_list_repos_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Team synchronization is available for organizations using GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * List IdP groups available in an organization. You can limit your page results using the `per_page` parameter. GitHub generates a url-encoded `page` token using a cursor value for where the next page begins. For more information on cursor pagination, see "[Offset and Cursor Pagination explained](https://dev.to/jackmarchant/offset-and-cursor-pagination-explained-b89)."
   *
   * The `per_page` parameter provides pagination for a list of IdP groups the authenticated user can access in an organization. For example, if the user `octocat` wants to see two groups per page in `octo-org` via cURL, it would look like this:
   */
  @Path("/{org}/team-sync/groups")
  @GET
  @Produces("application/json")
  Response teams_list_idp_groups_for_org(@PathParam("org") String org,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   * Team members will include the members of child teams.
   *
   * To get a user's membership with a team, the team must be visible to the authenticated user.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/{org_id}/team/{team_id}/memberships/{username}`.
   *
   * **Note:** The `role` for organization owners returns as `maintainer`. For more information about `maintainer` roles, see [Create a team](https://developer.github.com/v3/teams/#create-a-team).
   */
  @Path("/{org}/teams/{team_slug}/memberships/{username}")
  @GET
  @Produces("application/json")
  Response teams_get_membership_for_user_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @PathParam("username") String username);

  /**
   * Team synchronization is available for organizations using GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Adds an organization member to a team. An authenticated organization owner or team maintainer can add organization members to a team.
   *
   * **Note:** When you have team synchronization set up for a team with your organization's identity provider (IdP), you will see an error if you attempt to use the API for making changes to the team's membership. If you have access to manage group membership in your IdP, you can manage GitHub team membership through your identity provider, which automatically adds and removes team members in an organization. For more information, see "[Synchronizing teams between your identity provider and GitHub](https://help.github.com/articles/synchronizing-teams-between-your-identity-provider-and-github/)."
   *
   * An organization owner can add someone who is not part of the team's organization to a team. When an organization owner adds someone to a team who is not an organization member, this endpoint will send an invitation to the person via email. This newly-created membership will be in the "pending" state until the person accepts the invitation, at which point the membership will transition to the "active" state and the user will be added as a member of the team.
   *
   * If the user is already a member of the team, this endpoint will update the role of the team member's role. To update the membership of a team member, the authenticated user must be an organization owner or a team maintainer.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PUT /organizations/{org_id}/team/{team_id}/memberships/{username}`.
   */
  @Path("/{org}/teams/{team_slug}/memberships/{username}")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Response teams_add_or_update_membership_for_user_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @PathParam("username") String username,
      InputStream data);

  /**
   * Team synchronization is available for organizations using GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * To remove a membership between a user and a team, the authenticated user must have 'admin' permissions to the team or be an owner of the organization that the team is associated with. Removing team membership does not delete the user, it just removes their membership from the team.
   *
   * **Note:** When you have team synchronization set up for a team with your organization's identity provider (IdP), you will see an error if you attempt to use the API for making changes to the team's membership. If you have access to manage group membership in your IdP, you can manage GitHub team membership through your identity provider, which automatically adds and removes team members in an organization. For more information, see "[Synchronizing teams between your identity provider and GitHub](https://help.github.com/articles/synchronizing-teams-between-your-identity-provider-and-github/)."
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `DELETE /organizations/{org_id}/team/{team_id}/memberships/{username}`.
   */
  @Path("/{org}/teams/{team_slug}/memberships/{username}")
  @DELETE
  void teams_remove_membership_for_user_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @PathParam("username") String username);

  /**
   * The return hash contains a `role` field which refers to the Organization Invitation role and will be one of the following values: `direct_member`, `admin`, `billing_manager`, `hiring_manager`, or `reinstate`. If the invitee is not a GitHub member, the `login` field in the return hash will be `null`.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/{org_id}/team/{team_id}/invitations`.
   */
  @Path("/{org}/teams/{team_slug}/invitations")
  @GET
  @Produces("application/json")
  Response teams_list_pending_invitations_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Gets a team using the team's `slug`. GitHub generates the `slug` from the team `name`.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/{org_id}/team/{team_id}`.
   */
  @Path("/{org}/teams/{team_slug}")
  @GET
  @Produces("application/json")
  Response teams_get_by_name(@PathParam("org") String org, @PathParam("team_slug") String teamSlug);

  /**
   * To delete a team, the authenticated user must be an organization owner or team maintainer.
   *
   * If you are an organization owner, deleting a parent team will delete all of its child teams as well.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `DELETE /organizations/{org_id}/team/{team_id}`.
   */
  @Path("/{org}/teams/{team_slug}")
  @DELETE
  void teams_delete_in_org(@PathParam("org") String org, @PathParam("team_slug") String teamSlug);

  /**
   * To edit a team, the authenticated user must either be an organization owner or a team maintainer.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PATCH /organizations/{org_id}/team/{team_id}`.
   */
  @Path("/{org}/teams/{team_slug}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response teams_update_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, InputStream data);

  /**
   * Lists all teams in an organization that are visible to the authenticated user.
   */
  @Path("/{org}/teams")
  @GET
  @Produces("application/json")
  Response teams_list(@PathParam("org") String org, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * To create a team, the authenticated user must be a member or owner of `{org}`. By default, organization members can create teams. Organization owners can limit team creation to organization owners. For more information, see "[Setting team creation permissions](https://help.github.com/en/articles/setting-team-creation-permissions-in-your-organization)."
   *
   * When you create a new team, you automatically become a team maintainer without explicitly adding yourself to the optional array of `maintainers`. For more information, see "[About teams](https://help.github.com/en/github/setting-up-and-managing-organizations-and-teams/about-teams)".
   */
  @Path("/{org}/teams")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response teams_create(@PathParam("org") String org, InputStream data);

  /**
   * Lists the child teams of the team specified by `{team_slug}`.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/{org_id}/team/{team_id}/teams`.
   */
  @Path("/{org}/teams/{team_slug}/teams")
  @GET
  @Produces("application/json")
  Response teams_list_child_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Team synchronization is available for organizations using GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * List IdP groups connected to a team on GitHub.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `GET /organizations/{org_id}/team/{team_id}/team-sync/group-mappings`.
   */
  @Path("/{org}/teams/{team_slug}/team-sync/group-mappings")
  @GET
  @Produces("application/json")
  Response teams_list_idp_groups_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug);

  /**
   * Team synchronization is available for organizations using GitHub Enterprise Cloud. For more information, see [GitHub's products](https://help.github.com/github/getting-started-with-github/githubs-products) in the GitHub Help documentation.
   *
   * Creates, updates, or removes a connection between a team and an IdP group. When adding groups to a team, you must include all new and existing groups to avoid replacing existing groups with the new ones. Specifying an empty `groups` array will remove all connections for a team.
   *
   * **Note:** You can also specify a team by `org_id` and `team_id` using the route `PATCH /organizations/{org_id}/team/{team_id}/team-sync/group-mappings`.
   */
  @Path("/{org}/teams/{team_slug}/team-sync/group-mappings")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response teams_create_or_update_idp_group_connections_in_org(@PathParam("org") String org,
      @PathParam("team_slug") String teamSlug, InputStream data);

  /**
   * List issues in an organization assigned to the authenticated user.
   *
   * **Note**: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request. For this
   * reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by
   * the `pull_request` key. Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull
   * request id, use the "[List pull requests](https://developer.github.com/v3/pulls/#list-pull-requests)" endpoint.
   */
  @Path("/{org}/issues")
  @GET
  @Produces("application/json")
  Response issues_list_for_org(@PathParam("org") String org, @QueryParam("filter") String filter,
      @QueryParam("state") String state, @QueryParam("labels") String labels,
      @QueryParam("sort") String sort, @QueryParam("direction") String direction,
      @QueryParam("since") String since, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * Enables an authenticated GitHub App to find the organization's installation information.
   *
   * You must use a [JWT](https://developer.github.com/apps/building-github-apps/authenticating-with-github-apps/#authenticating-as-a-github-app) to access this endpoint.
   */
  @Path("/{org}/installation")
  @GET
  @Produces("application/json")
  Response apps_get_org_installation(@PathParam("org") String org);

  /**
   * **Warning:** The Billing API is currently in public beta and subject to change.
   *
   * Gets the free and paid storage usued for GitHub Packages in gigabytes.
   *
   * Paid minutes only apply to packages stored for private repositories. For more information, see "[Managing billing for GitHub Packages](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-billing-for-github-packages)."
   *
   * Access tokens must have the `read:org` scope.
   */
  @Path("/{org}/settings/billing/packages")
  @GET
  @Produces("application/json")
  Response billing_get_github_packages_billing_org(@PathParam("org") String org);

  /**
   * **Warning:** The Billing API is currently in public beta and subject to change.
   *
   * Gets the estimated paid and estimated total storage used for GitHub Actions and Github Packages.
   *
   * Paid minutes only apply to packages stored for private repositories. For more information, see "[Managing billing for GitHub Packages](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-billing-for-github-packages)."
   *
   * Access tokens must have the `read:org` scope.
   */
  @Path("/{org}/settings/billing/shared-storage")
  @GET
  @Produces("application/json")
  Response billing_get_shared_storage_billing_org(@PathParam("org") String org);

  /**
   * **Warning:** The Billing API is currently in public beta and subject to change.
   *
   * Gets the summary of the free and paid GitHub Actions minutes used.
   *
   * Paid minutes only apply to workflows in private repositories that use GitHub-hosted runners. Minutes used is listed for each GitHub-hosted runner operating system. Any job re-runs are also included in the usage. The usage does not include the multiplier for macOS and Windows runners and is not rounded up to the nearest whole minute. For more information, see "[Managing billing for GitHub Actions](https://help.github.com/github/setting-up-and-managing-billing-and-payments-on-github/managing-billing-for-github-actions)".
   *
   * Access tokens must have the `read:org` scope.
   */
  @Path("/{org}/settings/billing/actions")
  @GET
  @Produces("application/json")
  Response billing_get_github_actions_billing_org(@PathParam("org") String org);
}
