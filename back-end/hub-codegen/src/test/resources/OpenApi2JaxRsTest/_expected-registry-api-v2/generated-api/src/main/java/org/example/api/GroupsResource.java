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
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Response;
import org.example.api.beans.ArtifactMetaData;
import org.example.api.beans.ArtifactSearchResults;
import org.example.api.beans.EditableMetaData;
import org.example.api.beans.IfExists;
import org.example.api.beans.Rule;
import org.example.api.beans.SortBy;
import org.example.api.beans.SortOrder;
import org.example.api.beans.UpdateState;
import org.example.api.beans.VersionMetaData;
import org.example.api.beans.VersionSearchResults;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/v2/groups")
public interface GroupsResource {
  /**
   * Returns the latest version of the artifact in its raw form.  The `Content-Type` of the
   * response depends on the artifact type.  In most cases, this is `application/json`, but 
   * for some types it may be different (for example, `PROTOBUF`).
   *
   * This operation may fail for one of the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{groupId}/artifacts/{artifactId}")
  @GET
  @Produces({"application/json", "application/graphql", "application/x-protobuf", "application/x-protobuffer"})
  Response getLatestArtifact(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId);

  /**
   * Updates an artifact by uploading new content.  The body of the request should
   * be the raw content of the artifact.  This is typically in JSON format for *most*
   * of the supported types, but may be in another format for a few (for example, `PROTOBUF`).
   * The type of the content should be compatible with the artifact's type (it would be
   * an error to update an `AVRO` artifact with new `OPENAPI` content, for example).
   *
   * The update could fail for a number of reasons including:
   *
   * * Provided content (request body) was empty (HTTP error `400`)
   * * No artifact with the `artifactId` exists (HTTP error `404`)
   * * The new content violates one of the rules configured for the artifact (HTTP error `409`)
   * * A server error occurred (HTTP error `500`)
   *
   * When successful, this creates a new version of the artifact, making it the most recent
   * (and therefore official) version of the artifact.
   */
  @Path("/{groupId}/artifacts/{artifactId}")
  @PUT
  @Produces("application/json")
  @Consumes("*/*")
  CompletionStage<ArtifactMetaData> updateArtifact(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, InputStream data);

  /**
   * Deletes an artifact completely, resulting in all versions of the artifact also being
   * deleted.  This may fail for one of the following reasons:
   *
   * * No artifact with the `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{groupId}/artifacts/{artifactId}")
  @DELETE
  void deleteArtifact(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId);

  /**
   * Gets the metadata for an artifact in the registry.  The returned metadata includes
   * both generated (read-only) and editable metadata (such as name and description).
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{groupId}/artifacts/{artifactId}/meta")
  @GET
  @Produces("application/json")
  ArtifactMetaData getArtifactMetaData(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId);

  /**
   * Updates the editable parts of the artifact's metadata.  Not all metadata fields can
   * be updated.  For example, `createdOn` and `createdBy` are both read-only properties.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with the `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{groupId}/artifacts/{artifactId}/meta")
  @PUT
  @Consumes("*/*")
  void updateArtifactMetaData(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, EditableMetaData data);

  /**
   * Gets the metadata for an artifact that matches the raw content.  Searches the registry
   * for a version of the given artifact matching the content provided in the body of the
   * POST.
   *
   * This operation can fail for the following reasons:
   *
   * * Provided content (request body) was empty (HTTP error `400`)
   * * No artifact with the `artifactId` exists (HTTP error `404`)
   * * No artifact version matching the provided content exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{groupId}/artifacts/{artifactId}/meta")
  @POST
  @Produces("application/json")
  @Consumes("application/json")
  VersionMetaData getArtifactVersionMetaDataByContent(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, @QueryParam("canonical") Boolean canonical,
      InputStream data);

  /**
   * Returns a list of all rules configured for the artifact.  The set of rules determines
   * how the content of an artifact can evolve over time.  If no rules are configured for
   * an artifact, the set of globally configured rules are used.  If no global rules 
   * are defined, there are no restrictions on content evolution.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{groupId}/artifacts/{artifactId}/rules")
  @GET
  @Produces("application/json")
  List<RuleType> listArtifactRules(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId);

  /**
   * Adds a rule to the list of rules that get applied to the artifact when adding new
   * versions.  All configured rules must pass to successfully add a new artifact version.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * Rule (named in the request body) is unknown (HTTP error `400`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{groupId}/artifacts/{artifactId}/rules")
  @POST
  @Consumes("application/json")
  void createArtifactRule(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, Rule data);

  /**
   * Deletes all of the rules configured for the artifact.  After this is done, the global
   * rules apply to the artifact again.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{groupId}/artifacts/{artifactId}/rules")
  @DELETE
  void deleteArtifactRules(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId);

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
  @Path("/{groupId}/artifacts/{artifactId}/rules/{rule}")
  @GET
  @Produces("application/json")
  Rule getArtifactRuleConfig(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, @PathParam("rule") RuleType rule);

  /**
   * Updates the configuration of a single rule for the artifact.  The configuration data
   * is specific to each rule type, so the configuration of the `COMPATIBILITY` rule 
   * is in a different format from the configuration of the `VALIDITY` rule.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No rule with this name/type is configured for this artifact (HTTP error `404`)
   * * Invalid rule type (HTTP error `400`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{groupId}/artifacts/{artifactId}/rules/{rule}")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Rule updateArtifactRuleConfig(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, @PathParam("rule") RuleType rule, Rule data);

  /**
   * Deletes a rule from the artifact.  This results in the rule no longer applying for
   * this artifact.  If this is the only rule configured for the artifact, this is the 
   * same as deleting **all** rules, and the globally configured rules now apply to
   * this artifact.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No rule with this name/type is configured for this artifact (HTTP error `404`)
   * * Invalid rule type (HTTP error `400`)
   * * A server error occurred (HTTP error `500`)
   */
  @Path("/{groupId}/artifacts/{artifactId}/rules/{rule}")
  @DELETE
  void deleteArtifactRule(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, @PathParam("rule") RuleType rule);

  /**
   * Updates the state of the artifact.  For example, you can use this to mark the latest
   * version of an artifact as `DEPRECATED`.  The operation changes the state of the latest 
   * version of the artifact.  If multiple versions exist, only the most recent is changed.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{groupId}/artifacts/{artifactId}/state")
  @PUT
  @Consumes("application/json")
  void updateArtifactState(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, UpdateState data);

  /**
   * Tests whether an update to the artifact's content *would* succeed for the provided content.
   * Ultimately, this applies any rules configured for the artifact against the given content
   * to determine whether the rules would pass or fail, but without actually updating the artifact
   * content.
   *
   * The body of the request should be the raw content of the artifact.  This is typically in 
   * JSON format for *most* of the supported types, but may be in another format for a few 
   * (for example, `PROTOBUF`).
   *
   * The update could fail for a number of reasons including:
   *
   * * Provided content (request body) was empty (HTTP error `400`)
   * * No artifact with the `artifactId` exists (HTTP error `404`)
   * * The new content violates one of the rules configured for the artifact (HTTP error `409`)
   * * The provided artifact type is not recognized (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   * When successful, this operation simply returns a *No Content* response.  This response
   * indicates that the content is valid against the configured content rules for the 
   * artifact (or the global rules if no artifact rules are enabled).
   */
  @Path("/{groupId}/artifacts/{artifactId}/test")
  @PUT
  @Consumes("*/*")
  void testUpdateArtifact(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, InputStream data);

  /**
   * Retrieves a single version of the artifact content.  Both the `artifactId` and the
   * unique `version` number must be provided.  The `Content-Type` of the response depends 
   * on the artifact type.  In most cases, this is `application/json`, but for some types 
   * it may be different (for example, `PROTOBUF`).
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No version with this `version` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{groupId}/artifacts/{artifactId}/versions/{version}")
  @GET
  @Produces({"application/json", "application/graphql", "application/x-protobuf", "application/x-protobuffer"})
  Response getArtifactVersion(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, @PathParam("version") String version);

  /**
   * Retrieves the metadata for a single version of the artifact.  The version metadata is 
   * a subset of the artifact metadata and only includes the metadata that is specific to
   * the version (for example, this doesn't include `modifiedOn`).
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No version with this `version` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{groupId}/artifacts/{artifactId}/versions/{version}/meta")
  @GET
  @Produces("application/json")
  VersionMetaData getArtifactVersionMetaData(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, @PathParam("version") String version);

  /**
   * Updates the user-editable portion of the artifact version's metadata.  Only some of 
   * the metadata fields are editable by the user.  For example, `description` is editable, 
   * but `createdOn` is not.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No version with this `version` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{groupId}/artifacts/{artifactId}/versions/{version}/meta")
  @PUT
  @Consumes("application/json")
  void updateArtifactVersionMetaData(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, @PathParam("version") String version,
      EditableMetaData data);

  /**
   * Deletes the user-editable metadata properties of the artifact version.  Any properties
   * that are not user-editable are preserved.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No version with this `version` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{groupId}/artifacts/{artifactId}/versions/{version}/meta")
  @DELETE
  void deleteArtifactVersionMetaData(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, @PathParam("version") String version);

  /**
   * Updates the state of a specific version of an artifact.  For example, you can use 
   * this operation to disable a specific version.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * No version with this `version` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{groupId}/artifacts/{artifactId}/versions/{version}/state")
  @PUT
  @Consumes("application/json")
  void updateArtifactVersionState(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, @PathParam("version") String version,
      UpdateState data);

  /**
   * Returns a list of all versions of the artifact.  The result set is paged.
   *
   * This operation can fail for the following reasons:
   *
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{groupId}/artifacts/{artifactId}/versions")
  @GET
  @Produces("application/json")
  VersionSearchResults listArtifactVersions(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId, @QueryParam("offset") Integer offset,
      @QueryParam("limit") Integer limit);

  /**
   * Creates a new version of the artifact by uploading new content.  The configured rules for
   * the artifact are applied, and if they all pass, the new content is added as the most recent 
   * version of the artifact.  If any of the rules fail, an error is returned.
   *
   * The body of the request should be the raw content of the new artifact version, and the type
   * of that content should match the artifact's type (for example if the artifact type is `AVRO`
   * then the content of the request should be an Apache Avro document).
   *
   * This operation can fail for the following reasons:
   *
   * * Provided content (request body) was empty (HTTP error `400`)
   * * No artifact with this `artifactId` exists (HTTP error `404`)
   * * The new content violates one of the rules configured for the artifact (HTTP error `409`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{groupId}/artifacts/{artifactId}/versions")
  @POST
  @Produces("application/json")
  @Consumes("*/*")
  CompletionStage<VersionMetaData> createArtifactVersion(@PathParam("groupId") String groupId,
      @PathParam("artifactId") String artifactId,
      @HeaderParam("X-Registry-Version") String xRegistryVersion, InputStream data);

  /**
   * Returns a list of all artifacts in the group.  This list is paged.
   */
  @Path("/{groupId}/artifacts")
  @GET
  @Produces("application/json")
  ArtifactSearchResults listArtifactsInGroup(@PathParam("groupId") String groupId,
      @QueryParam("limit") Integer limit, @QueryParam("offset") Integer offset,
      @QueryParam("order") SortOrder order, @QueryParam("orderby") SortBy orderby);

  /**
   * Creates a new artifact by posting the artifact content.  The body of the request should
   * be the raw content of the artifact.  This is typically in JSON format for *most* of the 
   * supported types, but may be in another format for a few (for example, `PROTOBUF`).
   *
   * The registry attempts to figure out what kind of artifact is being added from the
   * following supported list:
   *
   * * Avro (`AVRO`)
   * * Protobuf (`PROTOBUF`)
   * * Protobuf File Descriptor (`PROTOBUF_FD`)
   * * JSON Schema (`JSON`)
   * * Kafka Connect (`KCONNECT`)
   * * OpenAPI (`OPENAPI`)
   * * AsyncAPI (`ASYNCAPI`)
   * * GraphQL (`GRAPHQL`)
   * * Web Services Description Language (`WSDL`)
   * * XML Schema (`XSD`)
   *
   * Alternatively, you can specify the artifact type using the `X-Registry-ArtifactType` 
   * HTTP request header, or include a hint in the request's `Content-Type`.  For example:
   *
   * ```
   * Content-Type: application/json; artifactType=AVRO
   * ```
   *
   * An artifact is created using the content provided in the body of the request.  This
   * content is created under a unique artifact ID that can be provided in the request
   * using the `X-Registry-ArtifactId` request header.  If not provided in the request,
   * the server generates a unique ID for the artifact.  It is typically recommended
   * that callers provide the ID, because this is typically a meaningful identifier, 
   * and for most use cases should be supplied by the caller.
   *
   * If an artifact with the provided artifact ID already exists, the default behavior
   * is for the server to reject the content with a 409 error.  However, the caller can
   * supply the `ifExists` query parameter to alter this default behavior. The `ifExists`
   * query parameter can have one of the following values:
   *
   * * `FAIL` (*default*) - server rejects the content with a 409 error
   * * `UPDATE` - server updates the existing artifact and returns the new metadata
   * * `RETURN` - server does not create or add content to the server, but instead 
   * returns the metadata for the existing artifact
   * * `RETURN_OR_UPDATE` - server returns an existing **version** that matches the 
   * provided content if such a version exists, otherwise a new version is created
   *
   * This operation may fail for one of the following reasons:
   *
   * * An invalid `ArtifactType` was indicated (HTTP error `400`)
   * * No `ArtifactType` was indicated and the server could not determine one from the content (HTTP error `400`)
   * * Provided content (request body) was empty (HTTP error `400`)
   * * An artifact with the provided ID already exists (HTTP error `409`)
   * * The content violates one of the configured global rules (HTTP error `409`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/{groupId}/artifacts")
  @POST
  @Produces("application/json")
  @Consumes("*/*")
  CompletionStage<ArtifactMetaData> createArtifact(@PathParam("groupId") String groupId,
      @HeaderParam("X-Registry-ArtifactType") ArtifactType xRegistryArtifactType,
      @HeaderParam("X-Registry-ArtifactId") String xRegistryArtifactId,
      @HeaderParam("X-Registry-Version") String xRegistryVersion,
      @QueryParam("ifExists") IfExists ifExists, @QueryParam("canonical") Boolean canonical,
      InputStream data);

  /**
   * Deletes all of the artifacts that exist in a given group.
   */
  @Path("/{groupId}/artifacts")
  @DELETE
  void deleteArtifactsInGroup(@PathParam("groupId") String groupId);
}
