package org.example.api;

import java.util.List;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/gitignore")
public interface GitignoreResource {
  /**
   * The API also allows fetching the source of a single template.
   * Use the raw [media type](https://developer.github.com/v3/media/) to get the raw contents.
   */
  @Path("/templates/{name}")
  @GET
  @Produces("application/json")
  Response gitignore_get_template(@PathParam("name") String name);

  /**
   * List all templates available to pass as an option when [creating a repository](https://developer.github.com/v3/repos/#create-a-repository-for-the-authenticated-user).
   */
  @Path("/templates")
  @GET
  @Produces("application/json")
  List<String> gitignore_get_all_templates();
}
