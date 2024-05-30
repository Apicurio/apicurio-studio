package io.apicurio.studio.test.shared.rest.v1;

import io.restassured.http.ContentType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.is;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class SystemResourceTestShared {

    public void runBasic() {

        given()
                .when()
                .contentType(ContentType.JSON)
                .get("/apis/studio/v1/system/info")
                .then()
                .statusCode(Response.Status.OK.getStatusCode())
                .body("name", is("Apicurio Studio"));
    }
}
