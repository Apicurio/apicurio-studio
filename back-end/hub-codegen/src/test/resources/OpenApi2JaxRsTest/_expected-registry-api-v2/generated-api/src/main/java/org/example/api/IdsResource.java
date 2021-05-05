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
@Path("/v2/ids")
public interface IdsResource {
  /**
   * Gets the content for an artifact version in the registry using the unique content
   * identifier for that content.  This content ID may be shared by multiple artifact
   * versions in the case where the artifact versions are identical.
   *
   * This operation may fail for one of the following reasons:
   *
   * * No content with this `contentId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/contentIds/{contentId}/")
  @GET
  @Produces({"application/json", "application/x-protobuf", "application/x-protobuffer"})
  Response getContentById(@PathParam("contentId") int contentId);

  /**
   * Gets the content for an artifact version in the registry using its globally unique
   * identifier.
   *
   * This operation may fail for one of the following reasons:
   *
   * * No artifact version with this `globalId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/globalIds/{globalId}")
  @GET
  @Produces({"application/json", "application/x-protobuf", "application/x-protobuffer"})
  Response getContentByGlobalId(@PathParam("globalId") int globalId);

  /**
   * Gets the content for an artifact version in the registry using the unique content
   * identifier for that content.  This content ID may be shared by multiple artifact
   * versions in the case where the artifact versions are identical.
   *
   * This operation may fail for one of the following reasons:
   *
   * * No content with this `contentId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/contentHashes/{contentHash}/")
  @GET
  @Produces("*/*")
  Response getContentByHash(@PathParam("contentHash") int contentHash,
      @QueryParam("canonical") Boolean canonical);
}
