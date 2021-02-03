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
@Path("/projects")
public interface ProjectsResource {
  /**
   *
   */
  @Path("/columns/{column_id}/moves")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response projects_move_column(@PathParam("column_id") Integer columnId, InputStream data);

  /**
   *
   */
  @Path("/columns/cards/{card_id}")
  @GET
  @Produces("application/json")
  Response projects_get_card(@PathParam("card_id") Integer cardId);

  /**
   *
   */
  @Path("/columns/cards/{card_id}")
  @DELETE
  void projects_delete_card(@PathParam("card_id") Integer cardId);

  /**
   *
   */
  @Path("/columns/cards/{card_id}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response projects_update_card(@PathParam("card_id") Integer cardId, InputStream data);

  /**
   *
   */
  @Path("/columns/{column_id}")
  @GET
  @Produces("application/json")
  Response projects_get_column(@PathParam("column_id") Integer columnId);

  /**
   *
   */
  @Path("/columns/{column_id}")
  @DELETE
  void projects_delete_column(@PathParam("column_id") Integer columnId);

  /**
   *
   */
  @Path("/columns/{column_id}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response projects_update_column(@PathParam("column_id") Integer columnId, InputStream data);

  /**
   * Gets a project by its `id`. Returns a `404 Not Found` status if projects are disabled. If you do not have sufficient privileges to perform this action, a `401 Unauthorized` or `410 Gone` status is returned.
   */
  @Path("/{project_id}")
  @GET
  @Produces("application/json")
  Response projects_get(@PathParam("project_id") Integer projectId);

  /**
   * Deletes a project board. Returns a `404 Not Found` status if projects are disabled.
   */
  @Path("/{project_id}")
  @DELETE
  void projects_delete(@PathParam("project_id") Integer projectId);

  /**
   * Updates a project board's information. Returns a `404 Not Found` status if projects are disabled. If you do not have sufficient privileges to perform this action, a `401 Unauthorized` or `410 Gone` status is returned.
   */
  @Path("/{project_id}")
  @PATCH
  @Produces("application/json")
  @Consumes("application/json")
  Response projects_update(@PathParam("project_id") Integer projectId, InputStream data);

  /**
   *
   */
  @Path("/{project_id}/columns")
  @GET
  @Produces("application/json")
  Response projects_list_columns(@PathParam("project_id") Integer projectId,
      @QueryParam("per_page") Integer perPage, @QueryParam("page") Integer page);

  /**
   *
   */
  @Path("/{project_id}/columns")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response projects_create_column(@PathParam("project_id") Integer projectId, InputStream data);

  /**
   *
   */
  @Path("/columns/{column_id}/cards")
  @GET
  @Produces("application/json")
  Response projects_list_cards(@PathParam("column_id") Integer columnId,
      @QueryParam("archived_state") String archivedState, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);

  /**
   * **Note**: GitHub's REST API v3 considers every pull request an issue, but not every issue is a pull request. For this reason, "Issues" endpoints may return both issues and pull requests in the response. You can identify pull requests by the `pull_request` key.
   *
   * Be aware that the `id` of a pull request returned from "Issues" endpoints will be an _issue id_. To find out the pull request id, use the "[List pull requests](https://developer.github.com/v3/pulls/#list-pull-requests)" endpoint.
   */
  @Path("/columns/{column_id}/cards")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response projects_create_card(@PathParam("column_id") Integer columnId, InputStream data);

  /**
   * Adds a collaborator to an organization project and sets their permission level. You must be an organization owner or a project `admin` to add a collaborator.
   */
  @Path("/{project_id}/collaborators/{username}")
  @PUT
  @Consumes("application/json")
  void projects_add_collaborator(@PathParam("project_id") Integer projectId,
      @PathParam("username") String username, InputStream data);

  /**
   * Removes a collaborator from an organization project. You must be an organization owner or a project `admin` to remove a collaborator.
   */
  @Path("/{project_id}/collaborators/{username}")
  @DELETE
  void projects_remove_collaborator(@PathParam("project_id") Integer projectId,
      @PathParam("username") String username);

  /**
   * Returns the collaborator's permission level for an organization project. Possible values for the `permission` key: `admin`, `write`, `read`, `none`. You must be an organization owner or a project `admin` to review a user's permission level.
   */
  @Path("/{project_id}/collaborators/{username}/permission")
  @GET
  @Produces("application/json")
  Response projects_get_permission_for_user(@PathParam("project_id") Integer projectId,
      @PathParam("username") String username);

  /**
   *
   */
  @Path("/columns/cards/{card_id}/moves")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  Response projects_move_card(@PathParam("card_id") Integer cardId, InputStream data);

  /**
   * Lists the collaborators for an organization project. For a project, the list of collaborators includes outside collaborators, organization members that are direct collaborators, organization members with access through team memberships, organization members with access through default organization permissions, and organization owners. You must be an organization owner or a project `admin` to list collaborators.
   */
  @Path("/{project_id}/collaborators")
  @GET
  @Produces("application/json")
  Response projects_list_collaborators(@PathParam("project_id") Integer projectId,
      @QueryParam("affiliation") String affiliation, @QueryParam("per_page") Integer perPage,
      @QueryParam("page") Integer page);
}
