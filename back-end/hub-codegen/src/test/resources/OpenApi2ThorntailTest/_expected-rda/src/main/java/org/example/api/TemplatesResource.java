package org.example.api;

import java.lang.String;
import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Request;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/templates")
public interface TemplatesResource {
  @Path("es/metadata")
  @GET
  @Produces("application/json")
  Response generatedMethod1();

  /**
   * Publish a new metadata document for a template
   */
  @Path("es/metadata")
  @POST
  @Consumes("application/json")
  void generatedMethod2(Request data);

  /**
   * Search template metadata and return a list of matching template metadata
   */
  @Path("es/metadata/search")
  @GET
  @Produces("application/json")
  Response thisIsTheSearchEndpointUseAGETRequestAlongWithParametersToSearchForMetadataOnTemplates(
      @QueryParam("tag") String tag, @QueryParam("free-text") String freeText,
      @QueryParam("author") String author);

  /**
   * Get the metadata for a single template by id
   */
  @Path("es/metadata/{id}")
  @GET
  @Produces("application/json")
  Response generatedMethod3();

  /**
   * Update the metadata for a single template by id
   */
  @Path("es/metadata/{id}")
  @PUT
  @Consumes("application/json")
  void generatedMethod4(Request data);

  /**
   * Delete the metadata for a single template by id
   */
  @Path("es/metadata/{id}")
  @DELETE
  void generatedMethod5();

  @Path("es/metadata/keywords")
  @GET
  @Produces("application/json")
  List<String> generatedMethod6();

  @Path("es/metadata/keywords/hints")
  @GET
  @Produces("application/json")
  List<String> generatedMethod7();
}
