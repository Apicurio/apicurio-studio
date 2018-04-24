
package $PACKAGE$;

import java.util.List;

import javax.enterprise.context.ApplicationScoped;
import javax.ws.rs.*;

$BEAN_IMPORTS$

/**
 * A JAX-RS interface.  An implementation of this interface must be
 * provided.
 */
@Path("$PATH$")
@ApplicationScoped
public interface IBeers {

    $METHODS$

}
