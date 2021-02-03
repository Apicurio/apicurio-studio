package org.example.api;

import java.io.InputStream;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/markdown")
public interface MarkdownResource {
  /**
   *
   */
  @POST
  @Consumes("application/json")
  void markdown_render(InputStream data);

  /**
   * You must send Markdown as plain text (using a `Content-Type` header of `text/plain` or `text/x-markdown`) to this endpoint, rather than using JSON format. In raw mode, [GitHub Flavored Markdown](https://github.github.com/gfm/) is not supported and Markdown will be rendered in plain format like a README.md file. Markdown content must be 400 KB or less.
   */
  @Path("/raw")
  @POST
  @Produces("text/html")
  @Consumes({"text/x-markdown", "text/plain"})
  String markdown_render_raw(String data);
}
