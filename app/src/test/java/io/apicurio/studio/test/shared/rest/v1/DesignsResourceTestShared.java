package io.apicurio.studio.test.shared.rest.v1;

import io.apicurio.studio.rest.v1.beans.*;
import io.apicurio.studio.spi.storage.SearchQuerySpecification;
import io.apicurio.studio.spi.storage.StudioStorage;
import io.restassured.common.mapper.TypeRef;
import io.restassured.http.ContentType;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response.Status;
import org.junit.jupiter.api.Assertions;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

import static io.apicurio.studio.test.shared.Utils.assertTimeWithin;
import static io.restassured.RestAssured.given;
import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.*;

/**
 * @author Jakub Senko <em>m@jsenko.net</em>
 */
@ApplicationScoped
public class DesignsResourceTestShared {

    private static final String DESIGNS_BASE_URL = "/apis/studio/v1/designs";
    private static final String DESIGNS_METADATA_BASE_URL = "/apis/studio/v1/designs/{designId}";
    private static final String DESIGNS_EVENTS_BASE_URL = "/apis/studio/v1/designs/{designId}/events";

    @Inject
    StudioStorage storage;

    public void cleanUp() {
        SearchQuerySpecification.SearchQuery searchQuery = new SearchQuerySpecification.SearchQuery();
        searchQuery.orderBy("createdOn", SearchQuerySpecification.SearchOrdering.ASC);

        storage.searchDesignMetadata(searchQuery).forEach(designMetadataDto -> {
            storage.deleteDesign(designMetadataDto.getId());
        });
    }

    public void runBasicCRUD() {

        String content1 = resourceToString("openapi-empty.json");

        var metadata = createDesign("design1", DesignType.JSON, null, DesignOriginType.create, content1);

        assertEquals("design1", metadata.getName());

        var metadata2 = given()
                .log().all()
                .when()
                .get("/apis/studio/v1/designs/{designId}", metadata.getDesignId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(Design.class);

        assertEquals(metadata.getDesignId(), metadata2.getDesignId());
        assertEquals(metadata.getOrigin(), metadata2.getOrigin());
        assertEquals(metadata.getType(), metadata2.getType());
        assertEquals(metadata.getName(), metadata2.getName());
        assertNull(metadata2.getDescription());
        assertEquals(metadata.getCreatedOn(), metadata2.getCreatedOn());
        assertEquals(metadata.getModifiedOn(), metadata2.getModifiedOn());

        var updatedMetadata = EditableDesignMetadata.builder()
                .description("foo")
                .build();

        await().pollDelay(Duration.ofSeconds(3)).untilAsserted(() -> Assertions.assertTrue(true));

        var metadata3 = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .body(updatedMetadata)
                .put("/apis/studio/v1/designs/{designId}", metadata.getDesignId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(Design.class);

        assertEquals(metadata.getDesignId(), metadata3.getDesignId());
        assertEquals(metadata.getType(), metadata3.getType());
        assertEquals(metadata.getOrigin(), metadata3.getOrigin());
        assertEquals(metadata.getName(), metadata3.getName());
        assertEquals("foo", metadata3.getDescription());
        assertEquals(metadata.getCreatedOn(), metadata3.getCreatedOn());
        assertNotEquals(metadata.getModifiedOn(), metadata3.getModifiedOn());

        var content2 = given()
                .log().all()
                .when()
                .get("/apis/studio/v1/designs/{designId}/content", metadata.getDesignId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().asString();

        assertEquals(content1, content2);

        given()
                .log().all()
                .when()
                .delete("/apis/studio/v1/designs/{designId}", metadata.getDesignId())
                .then()
                .statusCode(Status.NO_CONTENT.getStatusCode());

        given()
                .log().all()
                .when()
                .get("/apis/studio/v1/designs/{designId}", metadata.getDesignId())
                .then()
                .statusCode(Status.NOT_FOUND.getStatusCode());
    }

    public void runCreateDesign() {

        String content1 = resourceToString("openapi-empty.json");

        // Happy path
        var name1 = "design1";

        var metadata1 = createDesign(name1, DesignType.OPENAPI, name1 + "-description", DesignOriginType.create, content1);

        assertEquals("OPENAPI", metadata1.getType().value());

        assertEquals(name1, metadata1.getName());
        assertEquals("OPENAPI", metadata1.getType().value());
        assertEquals(DesignOriginType.create, metadata1.getOrigin());
        assertEquals(name1 + "-description", metadata1.getDescription());

        assertTimeWithin(metadata1.getCreatedOn(), Duration.ofSeconds(3));
        assertTimeWithin(metadata1.getModifiedOn(), Duration.ofSeconds(3));

        var metadata1B = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .get(DESIGNS_METADATA_BASE_URL, metadata1.getDesignId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(Design.class);

        assertEquals(metadata1, metadata1B);
    }

    public void runCreateDesignEvent() {
        String content1 = resourceToString("openapi-empty.json");

        // Happy path
        var name1 = "design2";
        var metadata1 = createDesign(name1, DesignType.OPENAPI, name1 + "-description", DesignOriginType.create, content1);
        var event1 = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .body(CreateDesignEvent.builder()
                        .type(DesignEventType.CREATE)
                        .data(DesignEventData.builder()
                                .create(DesignEventDataCreate.builder()
                                        .template("foo template")
                                        .build()) // TODO Duplicated information (both type and the key name), improve by choosing one
                                .build())
                        .build())
                .post(DESIGNS_EVENTS_BASE_URL, metadata1.getDesignId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(DesignEvent.class);

        assertEquals("CREATE", event1.getType().value());

        assertEquals(metadata1.getDesignId(), event1.getDesignId());
        assertEquals(DesignEventType.CREATE, event1.getType());
        assertEquals("foo template", event1.getData().getCreate().getTemplate());
        assertNull(event1.getData().getImport());
        assertNull(event1.getData().getRegister());
        assertNull(event1.getData().getUpdate());

        assertTimeWithin(event1.getOn(), Duration.ofSeconds(3)); // TODO Maintain consistency, use createdOn

        var events1 = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .get(DESIGNS_EVENTS_BASE_URL, metadata1.getDesignId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(new TypeRef<List<DesignEvent>>() {
                });

        assertEquals(1, events1.size());
        assertEquals(event1, events1.get(0));
    }

    private Design createDesign(String name, DesignType designType, String description, DesignOriginType originType, String content) {
        CreateDesign createDesign = CreateDesign.builder()
                .name(name)
                .type(designType)
                .origin(DesignOriginType.create)
                .description(description)
                .content(content)
                .build();

        var r = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .body(createDesign);

        return r.post(DESIGNS_BASE_URL)
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(Design.class);
    }

    public void runSearchDesigns() {

        createDesign("red1", DesignType.OPENAPI, "foo", DesignOriginType.create, resourceToString("openapi-empty.json"));

        createDesign("green1", DesignType.OPENAPI, "foo bar", DesignOriginType.file, resourceToString("openapi-empty.json"));

        createDesign("red2", DesignType.OPENAPI, "f", DesignOriginType.registry, resourceToString("openapi-empty.json"));

        createDesign("green2", DesignType.OPENAPI, "baz", DesignOriginType.url, resourceToString("openapi-empty.json"));

        // Order
        var search1 = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .get(DESIGNS_BASE_URL)
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(DesignSearchResults.class);

        assertEquals(4, search1.getCount());
        assertEquals(1, search1.getPage());
        assertEquals(20, search1.getPageSize());
        assertEquals(List.of("green2", "red2", "green1", "red1"), search1.getDesigns().stream().map(Design::getName).toList());

        var search2 = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .queryParam("order", "asc")
                .get(DESIGNS_BASE_URL)
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(DesignSearchResults.class);

        assertEquals(List.of("red1", "green1", "red2", "green2"), search2.getDesigns().stream().map(Design::getName).toList());

        var search3 = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .queryParam("orderby", "name")
                .get(DESIGNS_BASE_URL)
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(DesignSearchResults.class);

        assertEquals(List.of("red2", "red1", "green2", "green1"), search3.getDesigns().stream().map(Design::getName).toList());

        // Filter
        var search4 = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .queryParam("name", "green")
                .get(DESIGNS_BASE_URL)
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(DesignSearchResults.class);

        assertEquals(List.of("green2", "green1"), search4.getDesigns().stream().map(Design::getName).toList());

        var search5 = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .queryParam("type", DesignType.OPENAPI.value())
                .queryParam("description", "f")
                .get(DESIGNS_BASE_URL)
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(DesignSearchResults.class);

        assertEquals(List.of("red2", "green1", "red1"), search5.getDesigns().stream().map(Design::getName).toList());

        // Paging
        var search6 = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .queryParam("page", "2")
                .queryParam("pageSize", "2")
                .get(DESIGNS_BASE_URL)
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(DesignSearchResults.class);

        assertEquals(4, search6.getCount());
        assertEquals(2, search6.getPage());
        assertEquals(2, search6.getPageSize());
        assertEquals(List.of("green1", "red1"), search6.getDesigns().stream().map(Design::getName).toList());
    }

    /**
     * TODO: CAC candidate
     */
    protected final String resourceToString(String resourceName) {
        try (InputStream stream = getClass().getClassLoader().getResourceAsStream(resourceName)) {
            Assertions.assertNotNull(stream, "Resource not found: " + resourceName);
            return new BufferedReader(new InputStreamReader(stream, StandardCharsets.UTF_8)).lines().collect(Collectors.joining("\n"));
        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
