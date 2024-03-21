package io.apicurio.studio.test.shared.rest.v1;

import io.apicurio.studio.rest.v1.beans.*;
import io.apicurio.studio.spi.storage.StudioStorage;
import io.apicurio.studio.spi.storage.SearchQuerySpecification;
import io.restassured.common.mapper.TypeRef;
import io.restassured.http.ContentType;
import jakarta.inject.Inject;
import org.junit.jupiter.api.Assertions;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.ws.rs.core.Response.Status;

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
    private static final String DESIGNS_METADATA_BASE_URL = "/apis/studio/v1/designs/{designId}/meta";
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

        var metadata = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .body(content1)
                .header("X-Studio-Name", "design1")
                .header("X-Studio-Type", "design1-type")
                .header("X-Studio-Origin", DesignOriginType.create.value())
                .post("/apis/studio/v1/designs")
                .then()
                .statusCode(Status.OK.getStatusCode()) // TODO Codegen needs to be updated if we want to return 201
                .extract().as(Design.class);

        assertEquals("design1", metadata.getName());

        var metadata2 = given()
                .log().all()
                .when()
                .get("/apis/studio/v1/designs/{designId}/meta", metadata.getId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(Design.class);

        assertEquals(metadata.getId(), metadata2.getId());
        assertEquals(metadata.getKind(), metadata2.getKind());
        assertEquals(metadata.getHref(), metadata2.getHref());
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
                .put("/apis/studio/v1/designs/{designId}/meta", metadata.getId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(Design.class);

        assertEquals(metadata.getId(), metadata3.getId());
        assertEquals(metadata.getKind(), metadata3.getKind());
        assertEquals(metadata.getHref(), metadata3.getHref());
        assertEquals(metadata.getName(), metadata3.getName());
        assertEquals("foo", metadata3.getDescription());
        assertEquals(metadata.getCreatedOn(), metadata3.getCreatedOn());
        assertNotEquals(metadata.getModifiedOn(), metadata3.getModifiedOn());

        var content2 = given()
                .log().all()
                .when()
                .get("/apis/studio/v1/designs/{designId}", metadata.getId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().asString();

        assertEquals(content1, content2);

        given()
                .log().all()
                .when()
                .delete("/apis/studio/v1/designs/{designId}", metadata.getId())
                .then()
                .statusCode(Status.NO_CONTENT.getStatusCode());

        given()
                .log().all()
                .when()
                .get("/apis/studio/v1/designs/{designId}/meta", metadata.getId())
                .then()
                .statusCode(Status.NOT_FOUND.getStatusCode());
    }

    public void runCreateDesign() {

        String content1 = resourceToString("openapi-empty.json");

        // Happy path

        var name1 = "design1";

        var metadata1 = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .body(content1)
                .header("X-Studio-Name", name1)
                .header("X-Studio-Type", name1 + "-type")
                .header("X-Studio-Origin", DesignOriginType.create.value())
                .header("X-Studio-Description", name1 + "-description")
                .post(DESIGNS_BASE_URL)
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(Design.class);

        assertEquals("DesignMetadata", metadata1.getKind());
        assertEquals(DESIGNS_BASE_URL + "/" + metadata1.getId(), metadata1.getHref());

        assertEquals(name1, metadata1.getName());
        assertEquals(name1 + "-type", metadata1.getType());
        assertEquals(DesignOriginType.create, metadata1.getOrigin());
        assertEquals(name1 + "-description", metadata1.getDescription());

        assertTimeWithin(metadata1.getCreatedOn(), Duration.ofSeconds(3));
        assertTimeWithin(metadata1.getModifiedOn(), Duration.ofSeconds(3));

        var metadata1B = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .get(DESIGNS_METADATA_BASE_URL, metadata1.getId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(Design.class);

        assertEquals(metadata1, metadata1B);

        // Required headers

        var allHeaders = Map.of(
                "X-Studio-Name", name1,
                "X-Studio-Type", name1 + "-type",
                "X-Studio-Origin", DesignOriginType.create.value(),
                "X-Studio-Description", name1 + "-description"
        );

        var requiredHeaders = List.of(
                "X-Studio-Name", "X-Studio-Type", "X-Studio-Origin"
        );

        for (String header : requiredHeaders) {
            var headers = allHeaders.entrySet().stream()
                    .filter(e -> !e.getKey().equals(header))
                    .collect(Collectors.toSet());
            var r = given()
                    .log().all()
                    .when()
                    .contentType(ContentType.JSON)
                    .body(content1);
            for (Entry<String, String> h : headers) {
                r.header(h.getKey(), h.getValue());
            }
            r.post(DESIGNS_BASE_URL)
                    .then()
                    .statusCode(Status.BAD_REQUEST.getStatusCode());
        }

        // TODO Implement full data cleanup
    }

    public void runCreateDesignEvent() {

        String content1 = resourceToString("openapi-empty.json");

        // Happy path

        var name1 = "design2";

        var metadata1 = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .body(content1)
                .header("X-Studio-Name", name1)
                .header("X-Studio-Type", name1 + "-type")
                .header("X-Studio-Origin", DesignOriginType.create.value())
                .post(DESIGNS_BASE_URL)
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(Design.class);

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
                .post(DESIGNS_EVENTS_BASE_URL, metadata1.getId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(DesignEvent.class);


        assertEquals("DesignEvent", event1.getKind());
        assertEquals(DESIGNS_EVENTS_BASE_URL.replace("{designId}", metadata1.getId())
                + "/" + event1.getId(), event1.getHref());

        assertEquals(metadata1.getId(), event1.getDesignId());
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
                .get(DESIGNS_EVENTS_BASE_URL, metadata1.getId())
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(new TypeRef<List<DesignEvent>>() {
                });

        assertEquals(1, events1.size());
        assertEquals(event1, events1.get(0));
    }

    // TODO Extract common code with other tests
    private void createDesign(Map<String, String> headers) {
        var r = given()
                .log().all()
                .when()
                .contentType(ContentType.JSON)
                .body(resourceToString("openapi-empty.json"));
        for (Entry<String, String> h : headers.entrySet()) {
            r.header(h.getKey(), h.getValue());
        }
        r.post(DESIGNS_BASE_URL)
                .then()
                .statusCode(Status.OK.getStatusCode());
    }

    public void runSearchDesigns() {

        createDesign(Map.of(
                "X-Studio-Name", "red1",
                "X-Studio-Type", "alpha",
                "X-Studio-Origin", DesignOriginType.create.value(),
                "X-Studio-Description", "foo"
        ));
        createDesign(Map.of(
                "X-Studio-Name", "green1",
                "X-Studio-Type", "alpha",
                "X-Studio-Origin", DesignOriginType.file.value(),
                "X-Studio-Description", "foo bar"
        ));
        createDesign(Map.of(
                "X-Studio-Name", "red2",
                "X-Studio-Type", "beta",
                "X-Studio-Origin", DesignOriginType.registry.value(),
                "X-Studio-Description", "foo baz"
        ));
        createDesign(Map.of(
                "X-Studio-Name", "green2",
                "X-Studio-Type", "beta",
                "X-Studio-Origin", DesignOriginType.url.value(),
                "X-Studio-Description", "baz"
        ));

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
                .queryParam("type", "b")
                .queryParam("description", "f")
                .get(DESIGNS_BASE_URL)
                .then()
                .statusCode(Status.OK.getStatusCode())
                .extract().as(DesignSearchResults.class);

        assertEquals(List.of("red2"), search5.getDesigns().stream().map(Design::getName).toList());

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
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
