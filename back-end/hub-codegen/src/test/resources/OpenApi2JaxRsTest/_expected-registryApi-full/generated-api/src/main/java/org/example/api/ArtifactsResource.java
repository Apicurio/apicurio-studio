package org.example.api;

import io.apicurio.registry.types.ArtifactType;
import io.apicurio.registry.types.RuleType;
import java.io.InputStream;
import java.util.List;
import java.util.concurrent.CompletionStage;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.HeaderParam;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;
import org.example.api.beans.ArtifactMetaData;
import org.example.api.beans.EditableMetaData;
import org.example.api.beans.Rule;
import org.example.api.beans.VersionMetaData;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/artifacts")
public interface ArtifactsResource {
  /**
   * Creates a new artifact by POSTing the artifact content.  The body of the request should
   * be the raw content of the artifact.  This will typically be in JSON format for *most*
   * of the supported types, but may be in another format for a few (e.g. Protobuff).
   *
   * The registry will attempt to figure out what kind of artifact is being added from the
   * following supported list:
   *
   * * Avro (AVRO)
   * * Protobuff (PROTOBUFF)
   * * JSON Schema (JSON)
   * * OpenAPI (OPENAPI)
   * * AsyncAPI (ASYNCAPI)
   *
   * Alternatively, the artifact type can be indicated by either explicitly specifying the 
   * type via the `X-Registry-ArtifactType` HTTP Request Header or by including a hint in the 
   * Request's `Content-Type`.  For example:
   *
   * ```
   * Content-Type: application/json; artifactType=AVRO
   * ```
   *
   * This operation may fail for one of the following reasons:
   *
   * * An invalid `ArtifactType` was indicated (HTTP error `400`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @POST
  @Produces("application/json")
  @Consumes({"application/json", "application/x-yaml"})
  CompletionStage<ArtifactMetaData> createArtifact(
      @HeaderParam("X-Registry-ArtifactType") ArtifactType xRegistryArtifactType,
      @HeaderParam("X-Registry-ArtifactId") String xRegistryArtifactId, InputStream data);

  /**
   * Returns the latest version of the artifact in its raw form.  The `Content-Type` of the
   * response will depend on what type of artifact it is.  In most cases this will be
   * `application/json` but for some types it may be different (e.g. *protobuff*).
   *
   * This operation may fail for one of the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{artifactId}")
  @GET
  @Produces({"application/json", "application/x-yaml"})
  Response getLatestArtifact(@PathParam("artifactId") String artifactId);

  /**
   * Updates an artifact by uploading new content.  The body of the request should
   * be the raw content of the artifact.  This will typically be in JSON format for *most*
   * of the supported types, but may be in another format for a few (e.g. Protobuff).
   *
   * The registry will attempt to figure out what kind of artifact is being added from the
   * following supported list:
   *
   * * Avro (AVRO)
   * * Protobuff (PROTOBUFF)
   * * JSON Schema (JSON)
   * * OpenAPI (OPENAPI)
   * * AsyncAPI (ASYNCAPI)
   *
   * Alternatively, the artifact type can be indicated by either explicitly specifying the 
   * type via the `X-Registry-ArtifactType` HTTP Request Header or by including a hint in the 
   * Request's `Content-Type`.  For example:
   *
   * ```
   * Content-Type: application/json; artifactType=AVRO
   * ```
   *
   * The update could fail for a number of reasons including:
   *
   * * No artifact with the `artifactId` exists (HTTP error `404`)
   * * The new content violates one of the rules configured for the artifact (HTTP error `400`)
   * * The provided Artifact Type is not recognized (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   * When successful, this creates a new version of the artifact, making it the most recent
   * (and therefore official) version of the artifact.
   */
  @Path("/{artifactId}")
  @PUT
  @Produces("application/json")
  @Consumes({"application/json", "application/x-yaml"})
  ArtifactMetaData updateArtifact(@PathParam("artifactId") String artifactId,
      @HeaderParam("X-Registry-ArtifactType") ArtifactType xRegistryArtifactType, InputStream data);

  /**
   * Deletes an artifact completely, resulting in all versions of the artifact also being
   * deleted.  This may fail for one of the following reasons:
   *
   * * No artifact with the `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{artifactId}")
  @DELETE
  void deleteArtifact(@PathParam("artifactId") String artifactId);

  /**
   * Gets the meta-data for an artifact in the registry.  The returned meta-data will include
   * both generated (read-only) and editable meta-data (such as name and description).
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{artifactId}/meta")
  @GET
  @Produces("application/json")
  ArtifactMetaData getArtifactMetaData(@PathParam("artifactId") String artifactId);

  /**
   * Updates the editable parts of the artifact's meta-data.  Not all meta-data fields can
   * be updated.  For example `createdOn` and `createdBy` are both read-only properties.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with the `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{artifactId}/meta")
  @PUT
  @Consumes("application/json")
  void updateArtifactMetaData(@PathParam("artifactId") String artifactId, EditableMetaData data);

  /**
   * Returns information about a single rule configured for an artifact.  This is useful
   * when you want to know what the current configuration settings are for a specific rule.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No rule with this name/type is configured for this artifact (HTTP error `404`)
   * * Invalid rule type (HTTP error `400`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{artifactId}/rules/{rule}")
  @GET
  @Produces("application/json")
  Rule getArtifactRuleConfig(@PathParam("rule") String rule,
      @PathParam("artifactId") String artifactId);

  /**
   * Updates the configuration of a single rule for the artifact.  The configuration data
   * is specific to each rule type, so the configuration of the **Compatibility** rule 
   * will be of a different format than the configuration of the **Validation** rule.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No rule with this name/type is configured for this artifact (HTTP error `404`)
   * * Invalid rule type (HTTP error `400`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{artifactId}/rules/{rule}")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Rule updateArtifactRuleConfig(@PathParam("rule") String rule,
      @PathParam("artifactId") String artifactId, Rule data);

  /**
   * Deletes a rule from the artifact.  This results in the rule no longer applying for
   * this artifact.  If this is the only rule configured for the artifact, then this is
   * the same as deleting **all** rules:  the globally configured rules will now apply to
   * this artifact.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No rule with this name/type is configured for this artifact (HTTP error `404`)
   * * Invalid rule type (HTTP error `400`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{artifactId}/rules/{rule}")
  @DELETE
  void deleteArtifactRule(@PathParam("rule") String rule,
      @PathParam("artifactId") String artifactId);

  /**
   * Returns a list of all version numbers for the artifact.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{artifactId}/versions")
  @GET
  @Produces("application/json")
  List<Integer> listArtifactVersions(@PathParam("artifactId") String artifactId);

  /**
   * Creates a new version of the artifact by uploading new content.  The configured rules for
   * the artifact will be applied, and if they all pass then the new content will be added
   * as the most recent version of the artifact.  If any of the rules fail then an error 
   * will be returned.
   *
   * The body of the request should be the raw content of the new artifact version.  This 
   * will typically be in JSON format for *most* of the supported types, but may be in another 
   * format for a few (e.g. Protobuff).
   *
   * The registry will attempt to figure out what kind of artifact is being added from the
   * following supported list:
   *
   * * Avro (AVRO)
   * * Protobuff (PROTOBUFF)
   * * JSON Schema (JSON)
   * * OpenAPI (OPENAPI)
   * * AsyncAPI (ASYNCAPI)
   *
   * Alternatively, the artifact type can be indicated by either explicitly specifying the 
   * type via the `X-Registry-ArtifactType` HTTP Request Header or by including a hint in the 
   * Request's `Content-Type`.
   *
   * For example:
   *
   * ```
   * Content-Type: application/json; artifactType=AVRO
   * ```
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{artifactId}/versions")
  @POST
  @Produces("application/json")
  @Consumes({"application/json", "application/x-yaml"})
  VersionMetaData createArtifactVersion(@PathParam("artifactId") String artifactId,
      @HeaderParam("X-Registry-ArtifactType") ArtifactType xRegistryArtifactType, InputStream data);

  /**
   * Retrieves a single version of the artifact content.  Both the `artifactId` and the
   * unique `version` number must be provided.  The `Content-Type` of the
   * response will depend on what type of artifact it is.  In most cases this will be
   * `application/json` but for some types it may be different (e.g. *protobuff*).
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No version with this `version` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{artifactId}/versions/{version}")
  @GET
  @Produces({"application/json", "application/x-yaml"})
  Response getArtifactVersion(@PathParam("version") Integer version,
      @PathParam("artifactId") String artifactId);

  /**
   * Deletes a single version of the artifact.  Both the `artifactId` and the unique `version`
   * are needed.  If this is the only version of the artifact, then this operation is the same
   * as deleting the entire artifact.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No version with this `version` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{artifactId}/versions/{version}")
  @DELETE
  void deleteArtifactVersion(@PathParam("version") Integer version,
      @PathParam("artifactId") String artifactId);

  /**
   * Retrieves the meta-data for a single version of the artifact.  The version meta-data
   * is a subset of the artifact meta-data - it is only the meta-data that is specific to
   * the version (and so doesn't include e.g. `modifiedOn`).
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No version with this `version` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{artifactId}/versions/{version}/meta")
  @GET
  @Produces("application/json")
  VersionMetaData getArtifactVersionMetaData(@PathParam("version") Integer version,
      @PathParam("artifactId") String artifactId);

  /**
   * Updates the user-editable portion of the artifact version's meta-data.  Only some of 
   * the meta-data fields are editable by the user.  For example the `description` is editable
   * but the `createdOn` is not.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No version with this `version` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{artifactId}/versions/{version}/meta")
  @PUT
  @Consumes("application/json")
  void updateArtifactVersionMetaData(@PathParam("version") Integer version,
      @PathParam("artifactId") String artifactId, EditableMetaData data);

  /**
   * Deletes the user-editable meta-data properties of the artifact version.  Any properties
   * that are not user-editable will be preserved.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No version with this `version` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{artifactId}/versions/{version}/meta")
  @DELETE
  void deleteArtifactVersionMetaData(@PathParam("version") Integer version,
      @PathParam("artifactId") String artifactId);

  /**
   * Returns a list of all rules configured for the artifact.  The set of rules determines
   * how the content of an artifact can evolve over time.  If no rules are configured for
   * an artifact, then the set of globally configured rules will be used.  If no global
   * rules are defined then there are no restrictions on content evolution.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{artifactId}/rules")
  @GET
  @Produces("application/json")
  List<RuleType> listArtifactRules(@PathParam("artifactId") String artifactId);

  /**
   * Adds a rule to the list of rules that get applied to the artifact when adding new
   * versions.  All configured rules must pass in order to successfully add a new artifact
   * version.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * Rule (named in the request body) is unknown (HTTP error `400`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{artifactId}/rules")
  @POST
  @Consumes("application/json")
  void createArtifactRule(@PathParam("artifactId") String artifactId, Rule data);

  /**
   * Deletes all of the rules configured for the artifact.  After this is done, the global
   * rules will once again apply to the artifact.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{artifactId}/rules")
  @DELETE
  void deleteArtifactRules(@PathParam("artifactId") String artifactId);
}
