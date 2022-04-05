package io.apicurio.registry.rest.v2;

import io.apicurio.registry.rest.v2.beans.ConfigurationProperty;
import io.apicurio.registry.rest.v2.beans.LogConfiguration;
import io.apicurio.registry.rest.v2.beans.NamedLogConfiguration;
import io.apicurio.registry.rest.v2.beans.RoleMapping;
import io.apicurio.registry.rest.v2.beans.Rule;
import io.apicurio.registry.rest.v2.beans.UpdateConfigurationProperty;
import io.apicurio.registry.rest.v2.beans.UpdateRole;
import io.apicurio.registry.types.RuleType;
import java.io.InputStream;
import java.util.List;
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

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/apis/registry/v2/admin")
public interface AdminResource {
  /**
   * Gets a list of all the currently configured global rules (if any).
   *
   * This operation can fail for the following reasons:
   *
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/rules")
  @GET
  @Produces("application/json")
  List<RuleType> listGlobalRules();

  /**
   * Adds a rule to the list of globally configured rules.
   *
   * This operation can fail for the following reasons:
   *
   * * The rule type is unknown (HTTP error `400`)
   * * The rule already exists (HTTP error `409`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/rules")
  @POST
  @Consumes("application/json")
  void createGlobalRule(Rule data);

  /**
   * Deletes all globally configured rules.
   *
   * This operation can fail for the following reasons:
   *
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/rules")
  @DELETE
  void deleteAllGlobalRules();

  /**
   * Returns information about the named globally configured rule.
   *
   * This operation can fail for the following reasons:
   *
   * * Invalid rule name/type (HTTP error `400`)
   * * No rule with name/type `rule` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/rules/{rule}")
  @GET
  @Produces("application/json")
  Rule getGlobalRuleConfig(@PathParam("rule") RuleType rule);

  /**
   * Updates the configuration for a globally configured rule.
   *
   * This operation can fail for the following reasons:
   *
   * * Invalid rule name/type (HTTP error `400`)
   * * No rule with name/type `rule` exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/rules/{rule}")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  Rule updateGlobalRuleConfig(@PathParam("rule") RuleType rule, Rule data);

  /**
   * Deletes a single global rule.  If this is the only rule configured, this is the same
   * as deleting **all** rules.
   *
   * This operation can fail for the following reasons:
   *
   * * Invalid rule name/type (HTTP error `400`)
   * * No rule with name/type `rule` exists (HTTP error `404`)
   * * Rule cannot be deleted (HTTP error `409`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/rules/{rule}")
  @DELETE
  void deleteGlobalRule(@PathParam("rule") RuleType rule);

  /**
   * List all of the configured logging levels.  These override the default
   * logging configuration.
   */
  @Path("/loggers")
  @GET
  @Produces("application/json")
  List<NamedLogConfiguration> listLogConfigurations();

  /**
   * Returns the configured logger configuration for the provided logger name. If no logger configuration is persisted, this returns the current default log configuration in the system.
   */
  @Path("/loggers/{logger}")
  @GET
  @Produces("application/json")
  NamedLogConfiguration getLogConfiguration(@PathParam("logger") String logger);

  /**
   * Configures the logger referenced by the provided logger name with the given configuration.
   */
  @Path("/loggers/{logger}")
  @PUT
  @Produces("application/json")
  @Consumes("application/json")
  NamedLogConfiguration setLogConfiguration(@PathParam("logger") String logger,
      LogConfiguration data);

  /**
   * Removes the configured logger configuration (if any) for the given logger.
   */
  @Path("/loggers/{logger}")
  @DELETE
  @Produces("application/json")
  NamedLogConfiguration removeLogConfiguration(@PathParam("logger") String logger);

  /**
   * Exports registry data as a `.zip` archive.
   */
  @Path("/export")
  @GET
  @Produces("application/zip")
  Response exportData(@QueryParam("forBrowser") Boolean forBrowser);

  /**
   * Imports registry data that was previously exported using the `/admin/export` operation.
   */
  @Path("/import")
  @POST
  @Consumes("application/zip")
  void importData(@HeaderParam("X-Registry-Preserve-GlobalId") Boolean xRegistryPreserveGlobalId,
      @HeaderParam("X-Registry-Preserve-ContentId") Boolean xRegistryPreserveContentId,
      InputStream data);

  /**
   * Gets the details of a single role mapping (by `principalId`).
   *
   * This operation can fail for the following reasons:
   *
   * * No role mapping for the principalId exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/roleMappings/{principalId}")
  @GET
  @Produces("application/json")
  RoleMapping getRoleMapping(@PathParam("principalId") String principalId);

  /**
   * Updates a single role mapping for one user/principal.
   *
   * This operation can fail for the following reasons:
   *
   * * No role mapping for the principalId exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/roleMappings/{principalId}")
  @PUT
  @Consumes("application/json")
  void updateRoleMapping(@PathParam("principalId") String principalId, UpdateRole data);

  /**
   * Deletes a single role mapping, effectively denying access to a user/principal.
   *
   * This operation can fail for the following reasons:
   *
   * * No role mapping for the principalId exists (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/roleMappings/{principalId}")
  @DELETE
  void deleteRoleMapping(@PathParam("principalId") String principalId);

  /**
   * Gets a list of all role mappings configured in the registry (if any).
   *
   * This operation can fail for the following reasons:
   *
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/roleMappings")
  @GET
  @Produces("application/json")
  List<RoleMapping> listRoleMappings();

  /**
   * Creates a new mapping between a user/principal and a role.
   *
   * This operation can fail for the following reasons:
   *
   * * A server error occurred (HTTP error `500`)
   *
   *
   */
  @Path("/roleMappings")
  @POST
  @Consumes("application/json")
  void createRoleMapping(RoleMapping data);

  /**
   * Returns a list of all configuration properties that have been set.  The list is not paged.
   *
   * This operation may fail for one of the following reasons:
   *
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/config/properties")
  @GET
  @Produces("application/json")
  List<ConfigurationProperty> listConfigProperties();

  /**
   * Returns the value of a single configuration property.
   *
   * This operation may fail for one of the following reasons:
   *
   * * Property not found or not configured (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/config/properties/{propertyName}")
  @GET
  @Produces("application/json")
  ConfigurationProperty getConfigProperty(@PathParam("propertyName") String propertyName);

  /**
   * Updates the value of a single configuration property.
   *
   * This operation may fail for one of the following reasons:
   *
   * * Property not found or not configured (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/config/properties/{propertyName}")
  @PUT
  @Consumes("application/json")
  void updateConfigProperty(@PathParam("propertyName") String propertyName,
      UpdateConfigurationProperty data);

  /**
   * Resets the value of a single configuration property.  This will return the property to
   * its default value (see external documentation for supported properties and their default
   * values).
   *
   * This operation may fail for one of the following reasons:
   *
   * * Property not found or not configured (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/config/properties/{propertyName}")
  @DELETE
  void resetConfigProperty(@PathParam("propertyName") String propertyName);
}
