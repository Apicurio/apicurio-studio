package io.apicurio.studio.rest.v1;

import java.util.List;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import io.apicurio.studio.rest.v1.beans.ConfigurationProperty;
import io.apicurio.studio.rest.v1.beans.UpdateConfigurationProperty;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/apis/studio/v1/admin")
public interface AdminResource {
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
   * Sets a configuration property using a name and value.  If the configuration property is
   * already set, it will be overwritten.  Only editable configuration properties can be 
   * configured using the REST API.
   *
   * This operation may fail for one of the following reasons:
   *
   * * No property with the given name exists to be set (HTTP error `404`)
   * * A server error occurred (HTTP error `500`)
   *
   */
  @Path("/config/properties")
  @POST
  @Consumes("application/json")
  void setConfigProperty(ConfigurationProperty data);

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
   * Deletes the value of a single configuration property.  This will return the property to
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
  void deleteConfigProperty(@PathParam("propertyName") String propertyName);
}
