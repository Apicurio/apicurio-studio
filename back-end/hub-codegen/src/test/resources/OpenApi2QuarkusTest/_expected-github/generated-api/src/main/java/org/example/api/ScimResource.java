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
@Path("/scim")
public interface ScimResource {
  /**
   *
   */
  @Path("/v2/organizations/{org}/Users/{scim_user_id}")
  @GET
  @Produces("application/scim+json")
  Response scim_get_provisioning_information_for_user(@PathParam("org") String org,
      @PathParam("scim_user_id") String scimUserId);

  /**
   * Replaces an existing provisioned user's information. You must provide all the information required for the user as if you were provisioning them for the first time. Any existing user information that you don't provide will be removed. If you want to only update a specific attribute, use the [Update an attribute for a SCIM user](https://developer.github.com/v3/scim/#update-an-attribute-for-a-scim-user) endpoint instead.
   *
   * You must at least provide the required values for the user: `userName`, `name`, and `emails`.
   *
   * **Warning:** Setting `active: false` removes the user from the organization, deletes the external identity, and deletes the associated `{scim_user_id}`.
   */
  @Path("/v2/organizations/{org}/Users/{scim_user_id}")
  @PUT
  @Produces("application/scim+json")
  @Consumes("application/json")
  Response scim_set_information_for_provisioned_user(@PathParam("org") String org,
      @PathParam("scim_user_id") String scimUserId, InputStream data);

  /**
   *
   */
  @Path("/v2/organizations/{org}/Users/{scim_user_id}")
  @DELETE
  void scim_delete_user_from_org(@PathParam("org") String org,
      @PathParam("scim_user_id") String scimUserId);

  /**
   * Allows you to change a provisioned user's individual attributes. To change a user's values, you must provide a specific `Operations` JSON format that contains at least one of the `add`, `remove`, or `replace` operations. For examples and more information on the SCIM operations format, see the [SCIM specification](https://tools.ietf.org/html/rfc7644#section-3.5.2).
   *
   * **Note:** Complicated SCIM `path` selectors that include filters are not supported. For example, a `path` selector defined as `"path": "emails[type eq \"work\"]"` will not work.
   *
   * **Warning:** If you set `active:false` using the `replace` operation (as shown in the JSON example below), it removes the user from the organization, deletes the external identity, and deletes the associated `:scim_user_id`.
   *
   * ```
   * {
   *   "Operations":[{
   *     "op":"replace",
   *     "value":{
   *       "active":false
   *     }
   *   }]
   * }
   * ```
   */
  @Path("/v2/organizations/{org}/Users/{scim_user_id}")
  @PATCH
  @Produces("application/scim+json")
  @Consumes("application/json")
  Response scim_update_attribute_for_user(@PathParam("org") String org,
      @PathParam("scim_user_id") String scimUserId, InputStream data);

  /**
   * Retrieves a paginated list of all provisioned organization members, including pending invitations. If you provide the `filter` parameter, the resources for all matching provisions members are returned.
   *
   * When a user with a SAML-provisioned external identity leaves (or is removed from) an organization, the account's metadata is immediately removed. However, the returned list of user accounts might not always match the organization or enterprise member list you see on GitHub. This can happen in certain cases where an external identity associated with an organization will not match an organization member:
   *   - When a user with a SCIM-provisioned external identity is removed from an organization, the account's metadata is preserved to allow the user to re-join the organization in the future.
   *   - When inviting a user to join an organization, you can expect to see their external identity in the results before they accept the invitation, or if the invitation is cancelled (or never accepted).
   *   - When a user is invited over SCIM, an external identity is created that matches with the invitee's email address. However, this identity is only linked to a user account when the user accepts the invitation by going through SAML SSO.
   *
   * The returned list of external identities can include an entry for a `null` user. These are unlinked SAML identities that are created when a user goes through the following Single Sign-On (SSO) process but does not sign in to their GitHub account after completing SSO:
   *
   * 1. The user is granted access by the IdP and is not a member of the GitHub organization.
   *
   * 1. The user attempts to access the GitHub organization and initiates the SAML SSO process, and is not currently signed in to their GitHub account.
   *
   * 1. After successfully authenticating with the SAML SSO IdP, the `null` external identity entry is created and the user is prompted to sign in to their GitHub account:
   *    - If the user signs in, their GitHub account is linked to this entry.
   *    - If the user does not sign in (or does not create a new account when prompted), they are not added to the GitHub organization, and the external identity `null` entry remains in place.
   */
  @Path("/v2/organizations/{org}/Users")
  @GET
  @Produces("application/scim+json")
  Response scim_list_provisioned_identities(@PathParam("org") String org,
      @QueryParam("startIndex") Integer startIndex, @QueryParam("count") Integer count,
      @QueryParam("filter") String filter);

  /**
   * Provision organization membership for a user, and send an activation email to the email address.
   */
  @Path("/v2/organizations/{org}/Users")
  @POST
  @Produces("application/scim+json")
  @Consumes("application/json")
  Response scim_provision_and_invite_user(@PathParam("org") String org, InputStream data);
}
