package io.apicurio.studio.rest.v1;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

import io.apicurio.studio.rest.v1.beans.ArtifactResults;
import io.apicurio.studio.rest.v1.beans.ArtifactSortBy;
import io.apicurio.studio.rest.v1.beans.NewArtifact;
import io.apicurio.studio.rest.v1.beans.SortOrder;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/apis/studio/v1/artifacts")
public interface ArtifactsResource {
  /**
   * Lists all of the artifacts visible to the authenticated user.
   *
   * This operation may fail for one of the following reasons:
   *
   * * A server error occurred (HTTP error `500`)
   *
   */
  @GET
  @Produces("application/json")
  ArtifactResults listArtifacts(@QueryParam("limit") Integer limit,
      @QueryParam("offset") Integer offset, @QueryParam("order") SortOrder order,
      @QueryParam("orderby") ArtifactSortBy orderby);

  /**
   * Creates a new artifact.
   *
   * This operation may fail for one of the following reasons:
   *
   * * The provided artifact QName was invalid (HTTP error `400`)
   * * An artifact with the provided QName already exists (HTTP error `409`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @POST
  @Consumes("application/json")
  void createArtifact(NewArtifact data);
}
