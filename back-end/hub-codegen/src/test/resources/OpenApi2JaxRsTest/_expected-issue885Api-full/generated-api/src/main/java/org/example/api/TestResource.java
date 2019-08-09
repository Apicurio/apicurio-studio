package org.example.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

/**
 * A JAX-RS interface.  An implementation of this interface must be provided.
 */
@Path("/test")
public interface TestResource {
  /**
   * 测试中文字符
   */
  @Path("/chinese/character")
  @GET
  void generatedMethod1();
}
