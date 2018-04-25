package org.example.api;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

/**
 * The JAX-RS application.
 */
@ApplicationScoped
@ApplicationPath("/")
class JaxRsApplication extends Application {
}
