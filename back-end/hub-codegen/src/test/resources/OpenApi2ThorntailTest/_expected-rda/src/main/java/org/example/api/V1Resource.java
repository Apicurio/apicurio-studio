package org.example.api;

import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import org.example.api.beans.TemplateMetadata;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/v1")
public interface V1Resource {
  @Path("templates/metadata")
  @GET
  @Produces("application/json")
  List<TemplateMetadata> generatedMethod1();

  /**
   * Publish a new metadata document for a template
   */
  @Path("templates/metadata")
  @POST
  @Consumes("application/json")
  void generatedMethod2(TemplateMetadata data);

  /**
   * Search template metadata and return a list of matching template metadata
   */
  @Path("templates/metadata/search")
  @GET
  @Produces("application/json")
  List<TemplateMetadata> thisIsTheSearchEndpointUseAGETRequestAlongWithParametersToSearchForMetadataOnTemplates(
      @QueryParam("tag") String tag, @QueryParam("free-text") String freeText,
      @QueryParam("author") String author);

  /**
   * Get the metadata for a single template by id
   */
  @Path("templates/metadata/{id}")
  @GET
  @Produces("application/json")
  TemplateMetadata generatedMethod3();

  /**
   * Update the metadata for a single template by id
   */
  @Path("templates/metadata/{id}")
  @PUT
  @Consumes("application/json")
  void generatedMethod4(TemplateMetadata data);

  /**
   * Delete the metadata for a single template by id
   */
  @Path("templates/metadata/{id}")
  @DELETE
  void generatedMethod5();

  @Path("templates/metadata/keywords")
  @GET
  @Produces("application/json")
  List<String> generatedMethod6();

  @Path("templates/metadata/keywords/hints")
  @GET
  @Produces("application/json")
  List<String> generatedMethod7();
}
