package io.apicurio.studio.rest.v1;

import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import io.apicurio.studio.rest.v1.beans.NewTeam;
import io.apicurio.studio.rest.v1.beans.NewTeamMember;
import io.apicurio.studio.rest.v1.beans.SortOrder;
import io.apicurio.studio.rest.v1.beans.Team;
import io.apicurio.studio.rest.v1.beans.TeamMemberResults;
import io.apicurio.studio.rest.v1.beans.TeamMemberSortBy;
import io.apicurio.studio.rest.v1.beans.TeamResults;
import io.apicurio.studio.rest.v1.beans.TeamSortBy;
import io.apicurio.studio.rest.v1.beans.UpdateTeam;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/apis/studio/v1/teams")
public interface TeamsResource {
  /**
   * Lists all of the teams visible to the authenticated user.
   *
   * This operation may fail for one of the following reasons:
   *
   * * A server error occurred (HTTP error `500`)
   *
   */
  @GET
  @Produces("application/json")
  TeamResults listTeams(@QueryParam("limit") Integer limit, @QueryParam("offset") Integer offset,
      @QueryParam("order") SortOrder order, @QueryParam("orderby") TeamSortBy orderby);

  /**
   * Creates a new team.
   *
   * This operation may fail for one of the following reasons:
   *
   * * The provided team name was invalid (HTTP error `400`)
   * * A team with the provided name already exists (HTTP error `409`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @POST
  @Consumes("application/json")
  void createTeam(NewTeam data);

  /**
   * Operation used to get information about a single team.
   */
  @Path("/{teamName}")
  @GET
  @Produces("application/json")
  Team getTeam(@PathParam("teamName") String teamName);

  /**
   * Operation to update the information about a team.
   */
  @Path("/{teamName}")
  @PUT
  @Consumes("application/json")
  void updateTeam(@PathParam("teamName") String teamName, UpdateTeam data);

  /**
   * Operation used to delete a team.
   */
  @Path("/{teamName}")
  @DELETE
  void deleteTeam(@PathParam("teamName") String teamName);

  /**
   * Operation to list the members of a single team.
   */
  @Path("/{teamName}/members")
  @GET
  @Produces("application/json")
  TeamMemberResults listMembers(@PathParam("teamName") String teamName,
      @QueryParam("limit") Integer limit, @QueryParam("offset") Integer offset,
      @QueryParam("order") SortOrder order, @QueryParam("orderby") TeamMemberSortBy orderby);

  /**
   * Operation used to add a member to a team.
   */
  @Path("/{teamName}/members")
  @POST
  @Consumes("application/json")
  void addTeamMember(@PathParam("teamName") String teamName, NewTeamMember data);

  /**
   * Operation to remove a member from a team.
   */
  @Path("/{teamName}/members/{principal}")
  @DELETE
  void deleteTeamMember(@PathParam("principal") String principal,
      @PathParam("teamName") String teamName);
}
