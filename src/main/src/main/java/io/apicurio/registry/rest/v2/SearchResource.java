package io.apicurio.registry.rest.v2;

import io.apicurio.registry.rest.v2.beans.ArtifactSearchResults;
import io.apicurio.registry.rest.v2.beans.SortBy;
import io.apicurio.registry.rest.v2.beans.SortOrder;
import io.apicurio.registry.types.ArtifactType;
import java.io.InputStream;
import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/apis/registry/v2/search")
public interface SearchResource {
  /**
   * Returns a paginated list of all artifacts that match the provided filter criteria.
   *
   */
  @Path("/artifacts")
  @GET
  @Produces("application/json")
  ArtifactSearchResults searchArtifacts(@QueryParam("name") String name,
      @QueryParam("offset") Integer offset, @QueryParam("limit") Integer limit,
      @QueryParam("order") SortOrder order, @QueryParam("orderby") SortBy orderby,
      @QueryParam("labels") List<String> labels, @QueryParam("properties") List<String> properties,
      @QueryParam("description") String description, @QueryParam("group") String group,
      @QueryParam("globalId") int globalId, @QueryParam("contentId") int contentId);

  /**
   * Returns a paginated list of all artifacts with at least one version that matches the
   * posted content.
   *
   */
  @Path("/artifacts")
  @POST
  @Produces("application/json")
  @Consumes("*/*")
  ArtifactSearchResults searchArtifactsByContent(@QueryParam("canonical") Boolean canonical,
      @QueryParam("artifactType") ArtifactType artifactType, @QueryParam("offset") Integer offset,
      @QueryParam("limit") Integer limit, @QueryParam("order") SortOrder order,
      @QueryParam("orderby") SortBy orderby, InputStream data);
}
