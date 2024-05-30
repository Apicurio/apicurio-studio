package io.apicurio.studio.test.run.rest.v1.h2;

import io.apicurio.studio.test.profile.AuthTestProfile;
import io.apicurio.studio.test.resource.JWSMockResource;
import io.apicurio.studio.test.shared.rest.v1.DesignsResourceTestShared;
import io.apicurio.rest.client.VertxHttpClientProvider;
import io.apicurio.rest.client.auth.OidcAuth;
import io.apicurio.rest.client.auth.exception.AuthErrorHandler;
import io.apicurio.rest.client.spi.ApicurioHttpClientFactory;
import io.quarkus.test.junit.QuarkusTest;
import io.quarkus.test.junit.TestProfile;
import io.restassured.RestAssured;
import io.restassured.filter.Filter;
import io.vertx.core.Vertx;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.api.TestInstance.Lifecycle;

import java.util.ArrayList;
import java.util.List;

/**
 * @author Carles Arnal
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@QuarkusTest
@TestProfile(AuthTestProfile.class)
@TestInstance(Lifecycle.PER_CLASS)
class DesignsResourceAuthTest {

    @Inject
    DesignsResourceTestShared drts;

    @ConfigProperty(name = "quarkus.oidc.token-path")
    String tokenEndpoint;

    private List<Filter> original;

    @BeforeAll
    void beforeAll() {
        drts.cleanUp();

        ApicurioHttpClientFactory.setProvider(new VertxHttpClientProvider(Vertx.vertx()));
        var oidcAuth = new OidcAuth(ApicurioHttpClientFactory.create(tokenEndpoint, new AuthErrorHandler()), JWSMockResource.ADMIN_CLIENT_ID, "test");
        var accessToken = oidcAuth.authenticate();

        original = new ArrayList<>(RestAssured.filters());
        RestAssured.filters((requestSpec, responseSpec, ctx) -> {
            requestSpec.header("Authorization", "Bearer " + accessToken);
            return ctx.next(requestSpec, responseSpec);
        });
    }

    @AfterAll
    void afterAll() {
        RestAssured.replaceFiltersWith(original);
    }

    @Test
    void basicCRUD() {
        drts.runBasicCRUD();
    }

    @Test
    void createDesign() {
        drts.runCreateDesign();
    }

    @Test
    void createDesignEvent() {
        drts.runCreateDesignEvent();
    }

    @Test
    void searchDesigns() {
        drts.runSearchDesigns();
    }
}
