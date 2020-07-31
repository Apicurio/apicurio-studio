package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/feeds")
public interface FeedsResource {
  /**
   * GitHub provides several timeline resources in [Atom](http://en.wikipedia.org/wiki/Atom_(standard)) format. The Feeds API lists all the feeds available to the authenticated user:
   *
   * *   **Timeline**: The GitHub global public timeline
   * *   **User**: The public timeline for any user, using [URI template](https://developer.github.com/v3/#hypermedia)
   * *   **Current user public**: The public timeline for the authenticated user
   * *   **Current user**: The private timeline for the authenticated user
   * *   **Current user actor**: The private timeline for activity created by the authenticated user
   * *   **Current user organizations**: The private timeline for the organizations the authenticated user is a member of.
   * *   **Security advisories**: A collection of public announcements that provide information about security-related vulnerabilities in software on GitHub.
   *
   * **Note**: Private feeds are only returned when [authenticating via Basic Auth](https://developer.github.com/v3/#basic-authentication) since current feed URIs use the older, non revocable auth tokens.
   */
  @GET
  @Produces("application/json")
  Response activity_get_feeds();
}
