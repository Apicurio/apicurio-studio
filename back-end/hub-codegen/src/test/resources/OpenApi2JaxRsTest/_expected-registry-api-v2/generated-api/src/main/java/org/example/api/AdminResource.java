package org.example.api;

import io.apicurio.registry.types.RuleType;
import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import org.example.api.beans.LogConfiguration;
import org.example.api.beans.NamedLogConfiguration;
import org.example.api.beans.Rule;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/v2/admin")
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
   * Returns the configured logger configuration for the provided logger name, if no logger configuration is persisted it will return the current default log configuration in the system.
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
}
