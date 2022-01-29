/*
 * Copyright 2022 Red Hat
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package io.apicurio.studio.rest.v1;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.anything;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.equalTo;
import org.junit.jupiter.api.Test;

import io.apicurio.studio.rest.v1.beans.ConfigurationProperty;
import io.apicurio.studio.rest.v1.beans.UpdateConfigurationProperty;
import io.quarkus.test.junit.QuarkusTest;
import io.restassured.http.ContentType;

/**
 * @author eric.wittmann@gmail.com
 */
@QuarkusTest
public class AdminResourceTest extends ResourceTestBase {

    @Test
    public void testConfigProperties() throws Exception {
        final String TEST_PROPERTY_NAME = "app.properties.test.string";
        final String TEST_PROPERTY_2_NAME = "app.properties.test.int";

        // Start with no role mappings
        given()
            .when()
                .get("/studio/v1/admin/config/properties")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("[0]", nullValue());

        // Add
        ConfigurationProperty property = new ConfigurationProperty();
        property.setName(TEST_PROPERTY_NAME);
        property.setValue("foo");
        given()
            .when()
                .contentType(CT_JSON).body(property)
                .post("/studio/v1/admin/config/properties")
            .then()
                .statusCode(204)
                .body(anything());

        // Verify the property was set.
        given()
            .when()
                .pathParam("propertyName", TEST_PROPERTY_NAME)
                .get("/studio/v1/admin/config/properties/{propertyName}")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("name", equalTo(TEST_PROPERTY_NAME))
                .body("value", equalTo("foo"));

        given()
            .when()
                .get("/studio/v1/admin/config/properties")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("[0].name", equalTo(TEST_PROPERTY_NAME))
                .body("[0].value", equalTo("foo"));

        // Add another property
        property = new ConfigurationProperty();
        property.setName(TEST_PROPERTY_2_NAME);
        property.setValue("bar");
        given()
            .when()
                .contentType(CT_JSON).body(property)
                .post("/studio/v1/admin/config/properties")
            .then()
                .statusCode(204)
                .body(anything());

        // Verify the property was set.
        given()
            .when()
                .pathParam("propertyName", TEST_PROPERTY_2_NAME)
                .get("/studio/v1/admin/config/properties/{propertyName}")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("name", equalTo(TEST_PROPERTY_2_NAME))
                .body("value", equalTo("bar"));

        // Change the value of a property
        UpdateConfigurationProperty update = new UpdateConfigurationProperty();
        update.setValue("baz");
        given()
            .when()
                .contentType(CT_JSON).body(update)
                .pathParam("propertyName", TEST_PROPERTY_2_NAME)
                .put("/studio/v1/admin/config/properties/{propertyName}")
            .then()
                .statusCode(204)
                .body(anything());

        // Verify the property was updated.
        given()
            .when()
                .pathParam("propertyName", TEST_PROPERTY_2_NAME)
                .get("/studio/v1/admin/config/properties/{propertyName}")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("name", equalTo(TEST_PROPERTY_2_NAME))
                .body("value", equalTo("baz"));

        // Delete a config property
        given()
            .when()
                .pathParam("propertyName", TEST_PROPERTY_2_NAME)
                .delete("/studio/v1/admin/config/properties/{propertyName}")
            .then()
                .statusCode(204)
                .body(anything());

        // Verify the property was deleted.
        given()
            .when()
                .pathParam("propertyName", TEST_PROPERTY_2_NAME)
                .get("/studio/v1/admin/config/properties/{propertyName}")
            .then()
                .statusCode(404);
        given()
            .when()
                .get("/studio/v1/admin/config/properties")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("[0].name", equalTo(TEST_PROPERTY_NAME))
                .body("[0].value", equalTo("foo"));

        // Delete the other property
        given()
            .when()
                .contentType(CT_JSON).body(update)
                .pathParam("propertyName", TEST_PROPERTY_NAME)
                .delete("/studio/v1/admin/config/properties/{propertyName}")
            .then()
                .statusCode(204)
                .body(anything());

        // Verify the property was deleted.
        given()
            .when()
                .pathParam("propertyName", TEST_PROPERTY_NAME)
                .get("/studio/v1/admin/config/properties/{propertyName}")
            .then()
                .statusCode(404);

        given()
            .when()
                .get("/studio/v1/admin/config/properties")
            .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .body("size()", equalTo(0));

        // Try to add a config property that doesn't exist.
        // TODO commented this out until we have this implemented
//        property = new ConfigurationProperty();
//        property.setName("property-does-not-exist");
//        property.setValue("foobar");
//        given()
//            .when()
//                .contentType(CT_JSON).body(property)
//                .post("/studio/v1/admin/config/properties")
//            .then()
//                .statusCode(404);

    }
}
